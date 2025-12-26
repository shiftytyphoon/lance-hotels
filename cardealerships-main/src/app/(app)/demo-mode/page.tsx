"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Vapi from "@vapi-ai/web";
import { WebSocketLatencyTest } from "./components/WebSocketLatencyTest";
import { StubModeDemo } from "./components/StubModeDemo";
import LiveVoiceTest from "./components/LiveVoiceTest";

interface Hotel {
  id: string;
  name: string;
  location: string;
}

interface TranscriptMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}

// Initialize Vapi with your public key
// TODO: Replace with your actual Vapi public key
const VAPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "your-vapi-public-key";

// TODO: Replace with your actual Vapi assistant ID
const VAPI_ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || "your-assistant-id";

export default function DemoModePage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotelId, setSelectedHotelId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  
  const vapiRef = useRef<Vapi | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Initialize Vapi
  useEffect(() => {
    if (VAPI_PUBLIC_KEY && VAPI_PUBLIC_KEY !== "your-vapi-public-key") {
      vapiRef.current = new Vapi(VAPI_PUBLIC_KEY);

      // Set up event listeners
      vapiRef.current.on("call-start", () => {
        setIsConnecting(false);
        setIsActive(true);
      });

      vapiRef.current.on("call-end", () => {
        setIsActive(false);
        setIsConnecting(false);
        setIsSpeaking(false);
      });

      vapiRef.current.on("speech-start", () => {
        setIsSpeaking(true);
      });

      vapiRef.current.on("speech-end", () => {
        setIsSpeaking(false);
      });

      vapiRef.current.on("volume-level", (level: number) => {
        setVolumeLevel(level);
      });

      vapiRef.current.on("message", (message: { type: string; role?: string; transcript?: string; transcriptType?: string }) => {
        // Handle transcript messages
        if (message.type === "transcript" && message.transcriptType === "final" && message.transcript) {
          const newMessage: TranscriptMessage = {
            id: Date.now().toString(),
            role: message.role as "user" | "assistant",
            text: message.transcript,
            timestamp: new Date(),
          };
          setTranscript((prev) => [...prev, newMessage]);
        }
      });

      vapiRef.current.on("error", (error: Error) => {
        console.error("Vapi error:", error);
        setIsActive(false);
        setIsConnecting(false);
      });
    }

    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, []);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  // Load hotels
  useEffect(() => {
    async function loadHotels() {
      const { data, error } = await supabase
        .from("hotels")
        .select("id, name, location")
        .order("name");

      if (!error && data) {
        setHotels(data);
      }
      setIsLoading(false);
    }
    loadHotels();
  }, []);

  const selectedHotel = hotels.find((h) => h.id === selectedHotelId);

  const startCall = async () => {
    if (!vapiRef.current || !selectedHotel) return;
    
    setIsConnecting(true);
    setTranscript([]); // Clear previous transcript
    
    try {
      await vapiRef.current.start(VAPI_ASSISTANT_ID, {
        // You can pass assistant overrides here if needed
        // For example, to customize the first message based on the hotel:
        // firstMessage: `Hello! Welcome to ${selectedHotel.name}. How can I help you today?`,
      });
    } catch (error) {
      console.error("Failed to start call:", error);
      setIsConnecting(false);
    }
  };

  const stopCall = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
  };

  const toggleCall = () => {
    if (isActive) {
      stopCall();
    } else {
      startCall();
    }
  };

  const isVapiConfigured = VAPI_PUBLIC_KEY !== "your-vapi-public-key" && VAPI_ASSISTANT_ID !== "your-assistant-id";

  return (
    <div className="h-screen p-6 flex flex-col gap-6 overflow-y-auto">
      {/* Live Voice Test with Deepgram (DEV ONLY) */}
      <LiveVoiceTest />

      {/* WebSocket Latency Test (DEV ONLY) */}
      <WebSocketLatencyTest />

      {/* Stub Mode Demo (DEV ONLY) */}
      <StubModeDemo />

      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Demo Mode</h1>
          <p className="text-white/40 text-sm mt-0.5">Live conversation demo</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Play/Stop Button */}
          <button
            onClick={toggleCall}
            disabled={!selectedHotel || !isVapiConfigured || isConnecting}
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
              !selectedHotel || !isVapiConfigured
                ? "bg-white/[0.04] text-white/20 cursor-not-allowed"
                : isConnecting
                  ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 animate-pulse"
                  : isActive
                    ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                    : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30"
            }`}
          >
            {isConnecting ? (
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : isActive ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="1" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5.14v14l11-7-11-7z" />
              </svg>
            )}
          </button>

          {/* Hotel Selector */}
          <div className="relative">
            <select
              value={selectedHotelId}
              onChange={(e) => setSelectedHotelId(e.target.value)}
              disabled={isLoading || isActive || isConnecting}
              className="appearance-none bg-[#1e1e1e] border border-white/[0.08] rounded-xl px-4 py-2.5 pr-10 text-sm text-white focus:outline-none focus:border-white/[0.16] hover:border-white/[0.12] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
            >
              <option value="" className="bg-[#1e1e1e] text-white/60">
                Select a hotel...
              </option>
              {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id} className="bg-[#1e1e1e] text-white">
                  {hotel.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Vapi Configuration Warning */}
      {!isVapiConfigured && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3 text-sm">
          <p className="text-yellow-400 font-medium">Vapi not configured</p>
          <p className="text-yellow-400/70 text-xs mt-1">
            Add NEXT_PUBLIC_VAPI_PUBLIC_KEY and NEXT_PUBLIC_VAPI_ASSISTANT_ID to your .env.local file
          </p>
        </div>
      )}

      {/* Main Content - Two Modals */}
      <div className="flex-1 flex gap-6 min-h-0">
        {/* Transcription Modal */}
        <div className="flex-1 bg-[#141414] rounded-3xl border border-white/[0.06] flex flex-col overflow-hidden">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
              <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Transcript</p>
              <p className="text-xs text-white/40">
                {isActive ? "Recording..." : "Live conversation"}
              </p>
            </div>
            {isActive && (
              <div className="ml-auto flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs text-red-400">Live</span>
              </div>
            )}
          </div>

          {/* Transcript Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {transcript.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <p className="text-white/30 text-sm">
                    {!isVapiConfigured
                      ? "Configure Vapi to enable voice"
                      : selectedHotel 
                        ? "Press play to start the demo" 
                        : "Select a hotel to begin"}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {transcript.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-white/[0.08] text-white"
                          : "bg-[#1e1e1e] border border-white/[0.06] text-white/80"
                      }`}
                    >
                      <p className="text-xs text-white/40 mb-1">
                        {message.role === "user" ? "You" : "Assistant"}
                      </p>
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={transcriptEndRef} />
              </>
            )}
          </div>
        </div>

        {/* Voice Orb Modal */}
        <div className="w-[420px] bg-white rounded-3xl flex items-center justify-center relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }} />

          {/* Orb Container */}
          <div className="relative flex flex-col items-center">
            {/* The Orb */}
            <button
              onClick={toggleCall}
              disabled={!selectedHotel || !isVapiConfigured}
              className={`relative w-36 h-36 rounded-full cursor-pointer transition-all duration-500 ${
                !selectedHotel || !isVapiConfigured ? "opacity-40 cursor-not-allowed" : "hover:scale-105"
              } ${isActive ? "scale-110" : ""}`}
            >
              {/* Outer glow - responds to volume */}
              <div 
                className={`absolute inset-0 rounded-full blur-2xl transition-all duration-200`}
                style={{
                  background: "linear-gradient(135deg, #a855f7, #3b82f6, #06b6d4, #10b981)",
                  opacity: isActive ? 0.3 + (volumeLevel * 0.5) : 0.3,
                  transform: isActive ? `scale(${1 + volumeLevel * 0.3})` : 'scale(1)',
                }} 
              />
              
              {/* Main sphere */}
              <div 
                className="absolute inset-2 rounded-full overflow-hidden transition-transform duration-200"
                style={{
                  background: "linear-gradient(135deg, #a855f7, #3b82f6, #06b6d4, #10b981)",
                  backgroundSize: "400% 400%",
                  animation: isActive ? "gradientShift 3s ease infinite" : "gradientShift 8s ease infinite",
                  transform: isSpeaking ? `scale(${1 + volumeLevel * 0.1})` : 'scale(1)',
                }}
              >
                {/* Inner highlight */}
                <div className="absolute inset-0 rounded-full" style={{
                  background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 50%)",
                }} />
                
                {/* Animated noise overlay */}
                <div className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
                  isActive ? "opacity-20" : "opacity-10"
                }`} style={{
                  background: "radial-gradient(circle at 70% 70%, rgba(255,255,255,0.2) 0%, transparent 40%)",
                }} />
              </div>

              {/* Pulse rings when active */}
              {isActive && (
                <>
                  <div className="absolute inset-0 rounded-full border-2 border-purple-400/30 animate-ping" style={{ animationDuration: "2s" }} />
                  <div className="absolute inset-0 rounded-full border border-blue-400/20 animate-ping" style={{ animationDuration: "3s", animationDelay: "0.5s" }} />
                </>
              )}

              {/* Connecting spinner */}
              {isConnecting && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                </div>
              )}
            </button>

            {/* Status text */}
            <div className="mt-8 text-center">
              <p className={`text-sm font-medium transition-colors duration-300 ${
                isActive ? "text-purple-600" : isConnecting ? "text-yellow-600" : "text-gray-500"
              }`}>
                {!isVapiConfigured
                  ? "Configure Vapi"
                  : !selectedHotel 
                    ? "Select a hotel to begin" 
                    : isConnecting
                      ? "Connecting..."
                      : isActive 
                        ? isSpeaking 
                          ? "Speaking..." 
                          : "Listening..."
                        : "Ready"}
              </p>
              {selectedHotel && (
                <p className="text-xs text-gray-400 mt-1">{selectedHotel.name}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animation Keyframes */}
      <style jsx>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
}
