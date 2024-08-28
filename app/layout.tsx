import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MainNavbar from "@/components/layout/navbar/page";
import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthProvider } from "./store/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hostellers Sahayyak",
  description: "This is Hostellers Sahayyak to connect the Hostellers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextUIProvider>
          <NextThemesProvider attribute="class" defaultTheme="light">
            <AuthProvider>
              <MainNavbar />
              {children}
            </AuthProvider>
          </NextThemesProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
