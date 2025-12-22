"use client";

export default function DashboardPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Welcome to Lance Hotels.</p>
      </div>

      {/* Placeholder content */}
      <div className="bg-[#1e1e1e] rounded-xl p-8 border border-white/[0.06] text-center">
        <p className="text-white/60">Dashboard content will go here once Supabase is configured.</p>
      </div>
    </div>
  );
}
