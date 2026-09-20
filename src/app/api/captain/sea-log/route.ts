import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { currentCaptainSession } from "@/lib/captain-session";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_LEGACY_SERVICE_ROLE_KEY = process.env.SUPABASE_LEGACY_SERVICE_ROLE_KEY;
const SEA_LOG_BUCKET = "sea-log";

const ALLOWED_CATEGORIES = new Set(["species", "waste", "water", "weather", "other"]);
const ALLOWED_IMAGE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/heic", "heic"],
  ["image/heif", "heif"],
]);

function supabaseAdmin() {
  const adminKey = SUPABASE_LEGACY_SERVICE_ROLE_KEY || SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !adminKey) return null;

  return createClient(SUPABASE_URL, adminKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

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

function safeDetail(detail: string) {
  return detail
    .replace(/sb_(?:secret|publishable)_[A-Za-z0-9_-]+/g, "[redacted]")
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer [redacted]")
    .replace(/eyJ[A-Za-z0-9._-]+/g, "[redacted-jwt]")
    .slice(0, 320);
}

async function uploadPhoto(captainId: string, photo: File) {
  const supabase = supabaseAdmin();
  if (!supabase) return null;

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

  const { error } = await supabase.storage.from(SEA_LOG_BUCKET).upload(path, bytes, {
    contentType: photo.type,
    upsert: false,
  });

  if (error) {
    console.error("Sea Log photo upload failed", error.message);
    throw new Error(`Foto upload greška: ${safeDetail(error.message)}`);
  }

  return path;
}

export async function POST(request: Request) {
  const session = await currentCaptainSession();
  if (!session) {
    return NextResponse.json({ error: "Captain session is required." }, { status: 401 });
  }

  const supabase = supabaseAdmin();
  if (!supabase) {
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
    reporter_type: "captain",
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

  const { data, error } = await supabase
    .from("sea_log_observations")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    console.error("Sea Log insert failed", error.message);

    if (photoPath) {
      await supabase.storage.from(SEA_LOG_BUCKET).remove([photoPath]).catch(() => undefined);
    }

    return NextResponse.json(
      { error: `Sea Log upis greška: ${safeDetail(error.message)}` },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true, id: data?.id ?? null }, { status: 201 });
}
