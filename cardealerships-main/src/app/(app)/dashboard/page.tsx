"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface DashboardStats {
  totalCalls: number;
  callsHandled: number;
  appointments: number;
  transfers: number;
}

interface Call {
  id: string;
  started_at: string;
  ended_at: string | null;
  duration_s: number | null;
  outcome: string | null;
  twilio_call_sid: string | null;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalCalls: 0,
    callsHandled: 0,
    appointments: 0,
    transfers: 0,
  });
  const [recentCalls, setRecentCalls] = useState<Call[]>([]);
  const [tenantName, setTenantName] = useState("Dashboard");
  const router = useRouter();

  useEffect(() => {
    async function loadDashboard() {
      try {
        const supabase = createClient();

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/signin');
          return;
        }

        // Get user profile and tenant
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*, tenants(*)')
          .eq('user_id', user.id)
          .single();

        if (profile?.tenants) {
          setTenantName(profile.tenants.name);
        }

        // Get all calls for this tenant
        const { data: calls } = await supabase
          .from('calls')
          .select('*')
          .order('started_at', { ascending: false });

        if (calls) {
          // Calculate stats
          const totalCalls = calls.length;
          const callsHandled = calls.filter(c => c.ended_at).length;
          const appointments = calls.filter(c => c.outcome === 'booked').length;
          const transfers = calls.filter(c => c.outcome === 'transferred').length;

          setStats({
            totalCalls,
            callsHandled,
            appointments,
            transfers,
          });

          // Set recent calls (limit to 10)
          setRecentCalls(calls.slice(0, 10));
        }
      } catch (error) {
        console.error('Dashboard load error:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  const getOutcomeColor = (outcome: string | null) => {
    switch (outcome) {
      case "booked":
        return "text-emerald-400";
      case "transferred":
        return "text-amber-400";
      case "voicemail":
        return "text-blue-400";
      default:
        return "text-white/60";
    }
  };

  const formatOutcome = (outcome: string | null) => {
    if (!outcome) return "In Progress";
    return outcome.charAt(0).toUpperCase() + outcome.slice(1);
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "-";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-white/60">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Overview</h1>
        <p className="text-white/40 text-sm mt-1">Welcome back to {tenantName}. Here&apos;s what&apos;s happening with your calls.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1e1e1e] rounded-xl p-5 border border-white/[0.06]">
          <p className="text-white/50 text-sm">Total Calls</p>
          <div className="flex items-end justify-between mt-2">
            <p className="text-3xl font-semibold text-white">{stats.totalCalls}</p>
          </div>
        </div>
        <div className="bg-[#1e1e1e] rounded-xl p-5 border border-white/[0.06]">
          <p className="text-white/50 text-sm">Calls Handled</p>
          <div className="flex items-end justify-between mt-2">
            <p className="text-3xl font-semibold text-white">{stats.callsHandled}</p>
          </div>
        </div>
        <div className="bg-[#1e1e1e] rounded-xl p-5 border border-white/[0.06]">
          <p className="text-white/50 text-sm">Appointments</p>
          <div className="flex items-end justify-between mt-2">
            <p className="text-3xl font-semibold text-white">{stats.appointments}</p>
          </div>
        </div>
        <div className="bg-[#1e1e1e] rounded-xl p-5 border border-white/[0.06]">
          <p className="text-white/50 text-sm">Transfers</p>
          <div className="flex items-end justify-between mt-2">
            <p className="text-3xl font-semibold text-white">{stats.transfers}</p>
          </div>
        </div>
      </div>

      {/* Recent Calls */}
      <div className="bg-[#1e1e1e] rounded-xl border border-white/[0.06]">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="text-white font-medium">Recent Calls</h2>
          <Link href="/calls" className="text-white/40 hover:text-white/60 text-sm transition-colors">
            View all →
          </Link>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-5 gap-4 px-5 py-3 border-b border-white/[0.06] text-xs text-white/40 uppercase tracking-wider">
          <span>Call ID</span>
          <span>Twilio SID</span>
          <span>Duration</span>
          <span>Outcome</span>
          <span className="text-right">Time</span>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-white/[0.06]">
          {recentCalls.length === 0 ? (
            <div className="px-5 py-8 text-center text-white/40">
              No calls yet. Calls will appear here once your voice agent handles them.
            </div>
          ) : (
            recentCalls.map((call) => (
              <div key={call.id} className="grid grid-cols-5 gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                <span className="text-white text-sm font-mono">{call.id.substring(0, 8)}...</span>
                <span className="text-white/50 text-sm font-mono">{call.twilio_call_sid?.substring(0, 12) || 'N/A'}...</span>
                <span className="text-white/50 text-sm">{formatDuration(call.duration_s)}</span>
                <span className={`text-sm ${getOutcomeColor(call.outcome)}`}>{formatOutcome(call.outcome)}</span>
                <span className="text-white/30 text-sm text-right">{formatTimeAgo(call.started_at)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
