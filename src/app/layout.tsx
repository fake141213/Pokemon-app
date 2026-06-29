import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pokémon Explorer",
  description: "A paginated Pokémon explorer built with Next.js and MUI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="app-header">
          <div className="app-header-content">
            <Link href="/" className="app-title">
              Pokémon Explorer
            </Link>
            <nav className="app-nav">
              <Link href="/about">About</Link>
            </nav>
          </div>
        </header>
        <main className="app-main">{children}</main>
      </body>
    </html>
  );
}
