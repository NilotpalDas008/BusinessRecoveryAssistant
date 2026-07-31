"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Sparkles, Menu, X, ArrowRight } from "lucide-react";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#09090B]/80 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-purple-900/30 group-hover:scale-105 transition-transform duration-300">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#09090B]">
              <Sparkles className="h-5 w-5 text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-purple-200 transition-colors">
            Revive<span className="text-gradient-primary">AI</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="#features"
            className="text-zinc-400 hover:text-white transition-colors duration-200"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-zinc-400 hover:text-white transition-colors duration-200"
          >
            How it Works
          </Link>
          <div className="flex items-center gap-2 text-zinc-400 cursor-not-allowed">
            <span>Pricing</span>
            <Badge variant="purple" className="text-[10px] px-2 py-0.5">
              Coming Soon
            </Badge>
          </div>
        </nav>

        {/* Action CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="gradient" size="sm">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <div className="flex items-center gap-3">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-9 h-9 border border-purple-500/40 shadow-lg shadow-purple-950/50",
                  },
                }}
              />
            </div>
          </Show>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-zinc-400 hover:text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#09090B] px-6 py-6 space-y-4">
          <Link
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-zinc-300 hover:text-white"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-zinc-300 hover:text-white"
          >
            How it Works
          </Link>
          <div className="flex items-center justify-between py-2 text-zinc-400">
            <span className="text-base font-medium">Pricing</span>
            <Badge variant="purple">Coming Soon</Badge>
          </div>
          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button variant="outline" className="w-full justify-center">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="gradient" className="w-full justify-center">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <div className="flex items-center gap-3 py-2">
                <UserButton />
                <span className="text-sm font-medium text-zinc-200">Account Managed</span>
              </div>
            </Show>
          </div>
        </div>
      )}
    </header>
  );
}
