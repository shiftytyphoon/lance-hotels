"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VapiCall {
  id: string;
  orgId: string;
  type: string;
  phoneCallProvider: string;
  phoneCallTransport: string;
  status: string;
  endedReason?: string;
  startedAt: string;
  endedAt?: string;
  transcript?: string;
  summary?: string;
  recordingUrl?: string;
  customer?: {
    number: string;
  };
  analysis?: {
    summary?: string;
    structuredData?: {
      caller_name?: string;
      vehicle_make?: string;
      vehicle_year?: string;
      vehicle_model?: string;
      service_request?: string;
      final_outcome?: string;
      appointment_time?: string;
    };
    successEvaluation?: string;
  };
}

const outcomeConfig: Record<string, { label: string; color: string; bg: string }> = {
  appointment_booked: { label: "Appointment Booked", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  transferred_to_human: { label: "Transferred", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  info_provided: { label: "Info Provided", color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20" },
  call_ended_no_resolution: { label: "No Resolution", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
  unknown: { label: "Completed", color: "text-white/60", bg: "bg-white/[0.06] border-white/[0.1]" },
};

export default function CallsPage() {
  const [calls, setCalls] = useState<VapiCall[]>([]);
  const [selectedCall, setSelectedCall] = useState<VapiCall | null>(null);
  const [filterOutcome, setFilterOutcome] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCalls();
  }, []);

  const fetchCalls = async () => {
    try {
      const response = await fetch("/api/vapi/calls");
      if (!response.ok) {
        throw new Error("Failed to fetch calls");
      }
      const data = await response.json();
      setCalls(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load calls");
    } finally {
      setLoading(false);
    }
  };

  const getOutcome = (call: VapiCall): string => {
    return call.analysis?.structuredData?.final_outcome || "unknown";
  };

  const getDuration = (call: VapiCall): string => {
    if (!call.startedAt || !call.endedAt) return "—";
    const start = new Date(call.startedAt);
    const end = new Date(call.endedAt);
    const seconds = Math.floor((end.getTime() - start.getTime()) / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getCallerDisplay = (call: VapiCall): string => {
    if (call.analysis?.structuredData?.caller_name) {
      return call.analysis.structuredData.caller_name;
    }
    return call.customer?.number || "Unknown Caller";
  };

  const getInitials = (name: string): string => {
    if (name.startsWith("+")) return "?";
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const getVehicleInfo = (call: VapiCall): string | null => {
    const data = call.analysis?.structuredData;
    if (data?.vehicle_year && data?.vehicle_make && data?.vehicle_model) {
      return `${data.vehicle_year} ${data.vehicle_make} ${data.vehicle_model}`;
    }
    return null;
  };

  const filteredCalls = filterOutcome === "all"
    ? calls
    : calls.filter(call => getOutcome(call) === filterOutcome);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-white/50">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading calls...
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-8 flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">Calls</h1>
          <p className="text-white/50 mt-1">View and analyze your call history.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchCalls}
            className="px-4 py-2.5 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white/80 hover:bg-white/[0.1] hover:text-white transition-all text-sm font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <select
            value={filterOutcome}
            onChange={(e) => setFilterOutcome(e.target.value)}
            className="px-4 py-2.5 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white/80 focus:outline-none focus:ring-2 focus:ring-white/20 text-sm font-medium appearance-none cursor-pointer"
          >
            <option value="all">All Outcomes</option>
            <option value="appointment_booked">Appointment Booked</option>
            <option value="transferred_to_human">Transferred</option>
            <option value="info_provided">Info Provided</option>
            <option value="call_ended_no_resolution">No Resolution</option>
          </select>
        </div>
      </motion.div>

      {error && (
        <motion.div
          className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.div>
      )}

      {calls.length === 0 ? (
        <motion.div
          className="bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-white/[0.06] p-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="w-16 h-16 bg-white/[0.06] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No calls yet</h3>
          <p className="text-white/50 max-w-sm mx-auto">Once you connect a phone number and receive calls, they&apos;ll appear here.</p>
        </motion.div>
      ) : (
        <div className="flex gap-6">
          {/* Call List */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-white/[0.06] overflow-hidden">
              <div className="divide-y divide-white/[0.06]">
                {filteredCalls.map((call) => {
                  const outcome = getOutcome(call);
                  const config = outcomeConfig[outcome] || outcomeConfig.unknown;

                  return (
                    <button
                      key={call.id}
                      onClick={() => setSelectedCall(call)}
                      className={`w-full p-4 text-left hover:bg-white/[0.03] transition-all ${
                        selectedCall?.id === call.id ? "bg-white/[0.05]" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white/[0.06] rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-white/70">
                              {getInitials(getCallerDisplay(call))}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{getCallerDisplay(call)}</p>
                            <p className="text-white/40 text-xs mt-0.5">
                              {call.customer?.number && call.analysis?.structuredData?.caller_name && call.customer.number}
                              {call.customer?.number && " · "}
                              {getDuration(call)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.color}`}>
                            {config.label}
                          </span>
                          <p className="text-white/30 text-xs mt-1.5">{formatDate(call.startedAt)}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Call Details */}
          <motion.div
            className="w-[380px]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {selectedCall ? (
                <motion.div
                  key={selectedCall.id}
                  className="bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-white/[0.06] p-6 sticky top-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-lg font-medium text-white mb-6">Call Details</h2>

                  <div className="space-y-5">
                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Caller</p>
                      <p className="text-white font-medium">{getCallerDisplay(selectedCall)}</p>
                      {selectedCall.customer?.number && (
                        <p className="text-white/50 text-sm">{selectedCall.customer.number}</p>
                      )}
                    </div>

                    {getVehicleInfo(selectedCall) && (
                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Vehicle</p>
                        <p className="text-white">{getVehicleInfo(selectedCall)}</p>
                      </div>
                    )}

                    {selectedCall.analysis?.structuredData?.service_request && (
                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Service Request</p>
                        <p className="text-white text-sm">{selectedCall.analysis.structuredData.service_request}</p>
                      </div>
                    )}

                    <div className="flex gap-8">
                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Duration</p>
                        <p className="text-white">{getDuration(selectedCall)}</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Time</p>
                        <p className="text-white">{formatDate(selectedCall.startedAt)}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Outcome</p>
                      {(() => {
                        const outcome = getOutcome(selectedCall);
                        const config = outcomeConfig[outcome] || outcomeConfig.unknown;
                        return (
                          <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium border ${config.bg} ${config.color}`}>
                            {config.label}
                          </span>
                        );
                      })()}
                    </div>

                    {selectedCall.analysis?.summary && (
                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Summary</p>
                        <p className="text-white/70 text-sm leading-relaxed">{selectedCall.analysis.summary}</p>
                      </div>
                    )}
                  </div>

                  {selectedCall.transcript && (
                    <div className="mt-6 pt-6 border-t border-white/[0.06]">
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Transcript</p>
                      <div className="max-h-48 overflow-y-auto text-sm text-white/60 bg-white/[0.03] p-4 rounded-xl leading-relaxed">
                        {selectedCall.transcript}
                      </div>
                    </div>
                  )}

                  {selectedCall.recordingUrl && (
                    <div className="mt-4">
                      <a
                        href={selectedCall.recordingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/[0.06] text-white rounded-xl hover:bg-white/[0.1] transition-colors text-sm font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Listen to Recording
                      </a>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  className="bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-white/[0.06] p-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-14 h-14 bg-white/[0.06] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <p className="text-white/40 text-sm">Select a call to view details</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </div>
  );
}
