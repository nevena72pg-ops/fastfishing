import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FishWithLocals — Meet the people who know the sea",
  description: "Meet personally verified local fishing captains in Bar and Budva, Montenegro.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
