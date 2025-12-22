"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState } from "react";

const navItems = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
  {
    name: "Calls",
    href: "/calls",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    name: "Agents",
    href: "/agents",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: "Setup",
    href: "/setup",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2940&auto=format&fit=crop"
          alt="Mountains"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a]/95 via-[#1a1a1a]/80 to-[#1a1a1a]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-[#1a1a1a]/40" />
      </div>

      {/* Sidebar */}
      <aside
        className={`relative z-20 bg-[#1e1e1e]/90 backdrop-blur-xl border-r border-white/[0.08] flex flex-col transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-60"
        }`}
      >
        {/* Logo */}
        <div className={`p-4 border-b border-white/[0.08] flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="relative h-7 w-7 shrink-0">
              <Image
                src="/logo.png"
                alt="Lance Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            {!isCollapsed && (
              <span className="font-sans font-semibold text-[15px] tracking-wide text-white">LANCE</span>
            )}
          </Link>
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>

        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-3 mx-auto mt-3 rounded-md text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Search */}
        {!isCollapsed && (
          <div className="px-3 py-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.05] rounded-lg border border-white/[0.08]">
              <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm text-white/40">Search...</span>
              <div className="ml-auto flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 text-[10px] text-white/30 bg-white/[0.08] rounded">⌘</kbd>
                <kbd className="px-1.5 py-0.5 text-[10px] text-white/30 bg-white/[0.08] rounded">K</kbd>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-white/[0.08] text-white"
                    : "text-white/60 hover:bg-white/[0.04] hover:text-white/80"
                } ${isCollapsed ? "justify-center" : ""}`}
              >
                <span className={isActive ? "text-orange-400" : ""}>{item.icon}</span>
                {!isCollapsed && (
                  <span className="text-[13px] font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className={`px-3 pb-3 ${isCollapsed ? "hidden" : ""}`}>
          {/* Status */}
          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs text-white/60">Remaining memory</span>
              </div>
              <span className="text-xs font-medium text-emerald-400">High</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-xs text-white/60">Last locked by</span>
              </div>
              <span className="text-xs text-white/80 bg-white/[0.08] px-2 py-0.5 rounded">Internal system</span>
            </div>
          </div>
        </div>

        {/* Sign out */}
        <div className="p-3 border-t border-white/[0.08]">
          <button
            onClick={handleSignOut}
            className={`flex items-center gap-3 px-3 py-2 w-full text-white/60 hover:bg-white/[0.04] hover:text-white/80 rounded-lg transition-all duration-200 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!isCollapsed && <span className="text-[13px] font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto relative z-10">
        {children}
      </main>
    </div>
  );
}
