import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { UserProvider } from "@/lib/auth";
import { getUser } from "@/lib/db/queries";
import { Providers } from "./providers";
import { Header } from "./(dashboard)/layout";
import { Toaster } from "@/components/ui/toaster";
export const metadata: Metadata = {
  title: "Media Editor app",
  description: "powered by ImageKit.",
};

export const viewport: Viewport = {
  maximumScale: 1,
};

const manrope = Manrope({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userPromise = getUser();

  return (
    <html
      lang="en"
      className={`bg-white dark:bg-gray-950 text-black dark:text-white ${manrope.className}`}
    >
      <body className="min-h-[100dvh] bg-gray-50">
        <UserProvider userPromise={userPromise}>
          <Providers>
            <Header />
            {children}
            <Toaster />
          </Providers>
        </UserProvider>
      </body>
    </html>
  );
}
