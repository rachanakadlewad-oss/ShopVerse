import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "../components/Navbar"
import ToasterProvider from "../components/ToasterProvider"
import { AuthProvider } from "../context/AuthContext"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata = {
  title: {
    default: "ShopEase — Premium Shopping",
    template: "%s | ShopEase",
  },
  description:
    "Discover high-quality products. Secure checkout, fast delivery, and a premium experience — every time.",
  keywords: ["shopping", "ecommerce", "products", "online store"],
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "ShopEase — Premium Shopping",
    description: "Discover high-quality products with secure checkout.",
    type: "website",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <AuthProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-64px)]">{children}</main>
          <ToasterProvider />
        </AuthProvider>
      </body>
    </html>
  )
}
