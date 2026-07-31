import Link from "next/link";
import { Sparkles, Globe, Share2, Mail, MessageSquare } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#060608] text-zinc-400 text-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-purple-900/30">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#09090B]">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Revive<span className="text-gradient-primary">AI</span>
              </span>
            </Link>

            <p className="text-zinc-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              The AI-powered Business Recovery Assistant designed to help local businesses analyze Google reviews, solve recurring complaints, and win back lost customers automatically.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://reviveai.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-purple-500/40 transition-colors"
                aria-label="Website"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href="https://reviveai.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-purple-500/40 transition-colors"
                aria-label="Community"
              >
                <MessageSquare className="h-4 w-4" />
              </a>
              <a
                href="https://reviveai.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-purple-500/40 transition-colors"
                aria-label="Share"
              >
                <Share2 className="h-4 w-4" />
              </a>
            </div>
          </div>


          {/* Column 1: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="#features" className="hover:text-white transition-colors">
                  AI Review Analysis
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-white transition-colors">
                  Complaint Detection
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-white transition-colors">
                  WhatsApp Recovery
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-white transition-colors">
                  AI Marketing Posts
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-white transition-colors">
                  Integrations
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  Case Studies
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  Blog & News
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Legal & Contact</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="mailto:support@reviveai.com" className="hover:text-white transition-colors inline-flex items-center gap-1">
                  <Mail className="h-3 w-3" /> support@reviveai.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} ReviveAI Inc. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Crafted for AI Business Recovery & Hackathon Demo</p>
        </div>
      </div>
    </footer>
  );
}
