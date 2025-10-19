import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import React from "react";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VeriStamp | The Decentralized Notary",
  description:
    "Create an immutable, verifiable proof of your digital files on the blockchain.",
};
function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-500/20 bg-gray-900/80 backdrop-blur-lg py-4">
      <div className="container mx-auto text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} VeriStamp. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-gray-200 antialiased`}>
        <Providers>
          <Toaster
            position="top-center"
            containerStyle={{ top: 80 }}
            toastOptions={{
              style: {
                background: "#1F2937",
                color: "#FFF",
                border: "1px solid #4B5563",
                borderRadius: "12px",
              },
              success: {
                iconTheme: { primary: "#34D399", secondary: "white" },
              },
              error: { iconTheme: { primary: "#F87171", secondary: "white" } },
            }}
          />
          <Navbar />
          <main className="pb-20">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
