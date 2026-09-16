import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

// Light & Dark Mode
import { ThemeProvider } from "@/providers/theme-provider";

import { TooltipProvider } from "@/components/ui/tooltip";

// Context
import { BlogProvider } from "@/context/Blog.context";
import { UserProvider } from "@/context/User.context";
import { LoadingProvider } from "@/context/Loading.context";

// import WorkspaceAccessHandler from "@/components/workspace-access-handler";

import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inkwell-CMS",
  description: "Inkwell CMS for creating blogs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-inter">

            <LoadingProvider>
        <BlogProvider>
          <UserProvider>
              <ThemeProvider>
                <TooltipProvider>
                  {children}
                </TooltipProvider>
              </ThemeProvider>
          </UserProvider>
        </BlogProvider>
            </LoadingProvider>

        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#333",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}
