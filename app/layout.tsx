import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter, Montserrat } from "next/font/google"
import { AuthProvider } from "@/lib/auth-context"
import "./globals.css"
import { StoreProvider } from "./StoreProvider"
import { DispatchProvider } from "./DispatchProvider"
import { Suspense } from "react"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hệ thống Quản lý Sư đoàn Phòng không 375",
  description: "Military Management System for Air Defense Squadron 375",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
    generator: 'v0.app'
}

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-inter",
})

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-montserrat",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
     <StoreProvider>
      <DispatchProvider>
        <html lang="vi" className={`${inter.variable} ${montserrat.variable} antialiased`}>
      <body className="font-sans">
        <div className="min-h-screen bg-background">
           <Suspense fallback={<>Loading...</>}>
              <AuthProvider>{children}</AuthProvider>
            
            
            </Suspense>

            {/* <ToastContainer /> */}
            {/* <CustomImage /> */}
          </div>
      </body>
    </html>
      </DispatchProvider>
      </StoreProvider>
  )
}
