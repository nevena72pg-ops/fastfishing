import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { captainServiceHeaders, captainStorageHeaders, currentCaptainSession } from "@/lib/captain-session";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SEA_LOG_BUCKET = "sea-log";

const ALLOWED_CATEGORIES = new Set(["species", "waste", "water", "weather", "other"]);
const ALLOWED_IMAGE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/heic", "heic"],
  ["image/heif", "heif"],
]);

function optionalText(value: FormDataEntryValue | null, maxLength: number) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
}

function optionalNumber(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeObservedAt(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.trim()) return new Date().toISOString();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function safeStorageDetail(detail: string) {
  return detail
    .replace(/sb_(?:secret|publishable)_[A-Za-z0-9_-]+/g, "[redacted]")
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer [redacted]")
    .slice(0, 320);
}

async function uploadPhoto(captainId: string, photo: File) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;

  if (photo.size > 10 * 1024 * 1024) {
    throw new Error("Fotografija je veća od 10 MB.");
  }

  const extension = ALLOWED_IMAGE_TYPES.get(photo.type);
  if (!extension) {
    throw new Error("Format fotografije nije podržan.");
  }

  const stamp = new Date().toISOString().slice(0, 10);
  const path = `${captainId}/${stamp}-${randomUUID()}.${extension}`;
  const bytes = await photo.arrayBuffer();

  const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${SEA_LOG_BUCKET}/${path}`, {
    method: "POST",
    headers: {
      ...captainStorageHeaders(),
      "Content-Type": photo.type,
      "x-upsert": "false",
    },
    body: bytes,
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Sea Log photo upload failed", response.status, detail);
    const safeDetail = safeStorageDetail(detail) || response.statusText || "bez detalja";
    throw new Error(`Foto upload greška ${response.status}: ${safeDetail}`);
  }

  return path;
}

export async function POST(request: Request) {
  const session = await currentCaptainSession();
  if (!session) {
    return NextResponse.json({ error: "Captain session is required." }, { status: 401 });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Sea Log baza nije konfigurisana." }, { status: 503 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Neispravan Sea Log unos." }, { status: 400 });
  }

  const category = String(formData.get("category") || "").trim();
  if (!ALLOWED_CATEGORIES.has(category)) {
    return NextResponse.json({ error: "Izaberi vrstu opažanja." }, { status: 400 });
  }

  const latitude = optionalNumber(formData.get("latitude"));
  const longitude = optionalNumber(formData.get("longitude"));
  const locationAccuracy = optionalNumber(formData.get("locationAccuracy"));

  if (latitude !== null && (latitude < -90 || latitude > 90)) {
    return NextResponse.json({ error: "GPS širina nije ispravna." }, { status: 400 });
  }
  if (longitude !== null && (longitude < -180 || longitude > 180)) {
    return NextResponse.json({ error: "GPS dužina nije ispravna." }, { status: 400 });
  }

  const photoValue = formData.get("photo");
  let photoPath: string | null = null;

  try {
    if (photoValue instanceof File && photoValue.size > 0) {
      photoPath = await uploadPhoto(session.id, photoValue);
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Fotografija nije sačuvana." },
      { status: 503 },
    );
  }

  const payload = {
    captain_name: session.name,
    category,
    species_name: category === "species" ? optionalText(formData.get("speciesName"), 180) : null,
    notes: optionalText(formData.get("notes"), 2000),
    latitude,
    longitude,
    location_accuracy_m: locationAccuracy,
    observed_at: normalizeObservedAt(formData.get("observedAt")),
    photo_path: photoPath,
    review_status: "submitted",
  };

  const response = await fetch(`${SUPABASE_URL}/rest/v1/sea_log_observations`, {
    method: "POST",
    headers: {
      ...captainServiceHeaders(),
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Sea Log insert failed", response.status, detail);

    if (photoPath) {
      await fetch(`${SUPABASE_URL}/storage/v1/object/${SEA_LOG_BUCKET}/${photoPath}`, {
        method: "DELETE",
        headers: captainStorageHeaders(),
        cache: "no-store",
      }).catch(() => undefined);
    }

    return NextResponse.json(
      { error: "Sea Log baza još nije aktivirana ili unos nije mogao biti sačuvan." },
      { status: 503 },
    );
  }

  const rows = (await response.json()) as { id?: string }[];
  return NextResponse.json({ ok: true, id: rows[0]?.id ?? null }, { status: 201 });
}
