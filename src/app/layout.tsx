import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Schweitzer Elementary PTA",
  description: "Schweitzer Elementary PTA Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background-light dark:bg-background-dark`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
