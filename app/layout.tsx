// layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import MainNavbar from "@/components/layout/navbar/page";
import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
// import { AuthProvider } from "./store/auth";
import SessionProvider from "./store/session";
import MainFooter from "@/components/layout/footer/page";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { SpeedInsights } from '@vercel/speed-insights/next';

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
      <body >
        <div className="App">
          <NextUIProvider>
            <NextThemesProvider attribute="class" defaultTheme="light">
              <SessionProvider>
                <MainNavbar />
                <main>{children}
                <SpeedInsights />
                </main>
                <MainFooter />
              </SessionProvider>
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
        </div>
      </body>
    </html>
  );
}
