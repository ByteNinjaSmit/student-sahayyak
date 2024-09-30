// layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import MainNavbar from "@/components/layout/navbar/page";
import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthProvider } from "./store/auth";
import MainFooter from "@/components/layout/footer/page";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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
            <ToastContainer
              position="top-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              bodyClassName="toastBody"
            />
          </NextThemesProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
