// layout.tsx (or layout.js)
import type { Metadata } from "next";
import "./globals.css";
import MainNavbar from "@/components/layout/navbar/page";
import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthProvider } from "./store/auth";
import MainFooter from "@/components/layout/footer/page";

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
      <body id="Layout">
        <NextUIProvider>
          <NextThemesProvider attribute="class" defaultTheme="light">
            <AuthProvider>
              <MainNavbar />
              <main>{children}</main>
              <MainFooter />
            </AuthProvider>
          </NextThemesProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
