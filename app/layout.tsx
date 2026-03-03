import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "[Your Name] — Portfolio",
  description: "Student. Builder. Tinkerer.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "[Your Name]",
    description: "Student. Builder. Tinkerer.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
