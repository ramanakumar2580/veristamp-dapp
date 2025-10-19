"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  DocumentCheckIcon,
} from "@heroicons/react/24/outline";

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getLinkClass = (path: string) => {
    const baseClasses =
      "block px-3 py-2 rounded-md text-base font-medium text-center";
    if (pathname === path) {
      return `${baseClasses} bg-blue-600/20 text-blue-300`;
    }
    return `${baseClasses} text-gray-300 hover:bg-gray-700 hover:text-white`;
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-900/70 backdrop-blur-xl border-b border-gray-500/20">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-white transition-opacity hover:opacity-80"
          onClick={() => setIsMenuOpen(false)}
        >
          <DocumentCheckIcon className="h-7 w-7 text-blue-400" />
          VeriStamp
        </Link>
        <div className="hidden md:flex gap-4 items-center">
          <Link href="/certify" className={getLinkClass("/certify")}>
            Certify
          </Link>
          <Link href="/verify" className={getLinkClass("/verify")}>
            Verify
          </Link>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="[&>button]:text-[11px] [&>button]:font-bold [&>button]:px-2 [&>button]:py-1 md:[&>button]:text-xs md:[&>button]:px-3">
            <ConnectButton
              accountStatus={{ smallScreen: "avatar", largeScreen: "full" }}
              chainStatus="none"
              showBalance={false}
            />
          </div>

          {/* Hamburger Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 text-gray-300 hover:text-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <XMarkIcon className="h-7 w-7" />
              ) : (
                <Bars3Icon className="h-7 w-7" />
              )}
            </button>
          </div>
        </div>
      </nav>
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="space-y-1 px-2 pt-2 pb-3">
          <Link
            href="/certify"
            className={getLinkClass("/certify")}
            onClick={() => setIsMenuOpen(false)}
          >
            Certify
          </Link>
          <Link
            href="/verify"
            className={getLinkClass("/verify")}
            onClick={() => setIsMenuOpen(false)}
          >
            Verify
          </Link>
        </div>
      </div>
    </header>
  );
}
