import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar"
import ToasterProvider from "../components/ToasterProvider"
import { AuthProvider } from "../context/AuthContext"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ShopEase — Premium Shopping Experience",
  description: "Discover high-quality products. Secure checkout, fast delivery, and a premium experience every time.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-73px)]">{children}</main>
          <ToasterProvider />
        </AuthProvider>
      </body>
    </html>
  );
}
