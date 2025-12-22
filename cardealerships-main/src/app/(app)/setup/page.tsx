"use client";

import { useState } from "react";

type ConnectionType = "twilio" | "sip" | "vapi";

const SERVICE_AGENT_ID = "732ba29e-4aeb-48ad-bd47-440d3fce8b26";

export default function SetupPage() {
  const [connectionType, setConnectionType] = useState<ConnectionType>("twilio");
  const [isConnected, setIsConnected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Twilio config
  const [twilioAccountSid, setTwilioAccountSid] = useState("");
  const [twilioAuthToken, setTwilioAuthToken] = useState("");
  const [twilioPhoneNumber, setTwilioPhoneNumber] = useState("");

  // SIP config
  const [sipUri, setSipUri] = useState("");

  // Vapi Phone Number (already in Vapi)
  const [vapiPhoneNumber, setVapiPhoneNumber] = useState("");

  // Transfer number
  const [transferNumber, setTransferNumber] = useState("+19497218023");

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      let payload: Record<string, unknown> = {
        assistantId: SERVICE_AGENT_ID,
      };

      if (connectionType === "twilio") {
        if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
          throw new Error("Please fill in all Twilio fields");
        }
        payload = {
          ...payload,
          provider: "twilio",
          twilioAccountSid,
          twilioAuthToken,
          phoneNumber: twilioPhoneNumber,
        };
      } else if (connectionType === "sip") {
        if (!sipUri) {
          throw new Error("Please enter your SIP URI");
        }
        payload = {
          ...payload,
          provider: "byosip",
          sipUri,
        };
      } else if (connectionType === "vapi") {
        if (!vapiPhoneNumber) {
          throw new Error("Please enter your Vapi phone number");
        }
        payload = {
          ...payload,
          provider: "vapi",
          phoneNumber: vapiPhoneNumber,
        };
      }

      const response = await fetch("/api/vapi/phone-numbers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save configuration");
      }

      setIsConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestCall = async () => {
    alert("To test, call your connected phone number and the AI agent will answer!");
  };

  const connectionOptions = [
    {
      id: "twilio",
      name: "Twilio",
      desc: "Import from Twilio",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      )
    },
    {
      id: "sip",
      name: "SIP Trunk",
      desc: "Bring your own SIP",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      )
    },
    {
      id: "vapi",
      name: "Vapi Number",
      desc: "Use existing Vapi number",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      )
    },
  ];

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Phone Setup</h1>
        <p className="text-white/50 text-sm mt-2">Connect your phone number to start receiving AI-handled calls.</p>
        <div className="h-px bg-white/10 mt-4" />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm flex items-center gap-3">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Connection Status */}
      {isConnected && (
        <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">Phone Connected!</h3>
            <p className="text-white/50 text-xs mt-0.5">Your phone number is active and receiving calls.</p>
          </div>
        </div>
      )}

      {/* Connection Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-white/70 mb-3">Connection Type</label>
        <div className="grid grid-cols-3 gap-3">
          {connectionOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setConnectionType(option.id as ConnectionType)}
              className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                connectionType === option.id
                  ? "border-orange-500/50 bg-orange-500/10"
                  : "border-white/[0.08] bg-[#252525]/80 hover:border-white/[0.15]"
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
                connectionType === option.id
                  ? "bg-orange-500/20 text-orange-400"
                  : "bg-white/[0.06] text-white/50"
              }`}>
                {option.icon}
              </div>
              <p className="text-white text-sm font-medium">{option.name}</p>
              <p className="text-white/40 text-xs mt-1">{option.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Configuration Form */}
      <div className="bg-[#252525]/80 backdrop-blur-sm rounded-lg border border-white/[0.08] p-5 mb-5">
        <h2 className="text-sm font-medium text-white mb-4">
          {connectionType === "twilio" && "Twilio Configuration"}
          {connectionType === "sip" && "SIP Trunk Configuration"}
          {connectionType === "vapi" && "Vapi Phone Number"}
        </h2>

        {connectionType === "twilio" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2">Account SID</label>
              <input
                type="text"
                value={twilioAccountSid}
                onChange={(e) => setTwilioAccountSid(e.target.value)}
                placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full px-4 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
              />
              <p className="text-white/30 text-xs mt-1.5">Find this in your Twilio Console</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2">Auth Token</label>
              <input
                type="password"
                value={twilioAuthToken}
                onChange={(e) => setTwilioAuthToken(e.target.value)}
                placeholder="Your Twilio Auth Token"
                className="w-full px-4 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2">Phone Number</label>
              <input
                type="tel"
                value={twilioPhoneNumber}
                onChange={(e) => setTwilioPhoneNumber(e.target.value)}
                placeholder="+15551234567"
                className="w-full px-4 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
              />
              <p className="text-white/30 text-xs mt-1.5">Must be a Twilio number in E.164 format</p>
            </div>
          </div>
        )}

        {connectionType === "sip" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2">SIP URI</label>
              <input
                type="text"
                value={sipUri}
                onChange={(e) => setSipUri(e.target.value)}
                placeholder="sip:username@your-provider.com"
                className="w-full px-4 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
              />
              <p className="text-white/30 text-xs mt-1.5">Your SIP trunk URI for inbound calls</p>
            </div>
          </div>
        )}

        {connectionType === "vapi" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2">Vapi Phone Number ID</label>
              <input
                type="text"
                value={vapiPhoneNumber}
                onChange={(e) => setVapiPhoneNumber(e.target.value)}
                placeholder="Phone number ID from Vapi dashboard"
                className="w-full px-4 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
              />
              <p className="text-white/30 text-xs mt-1.5">
                Go to{" "}
                <a href="https://dashboard.vapi.ai/phone-numbers" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">
                  Vapi Dashboard → Phone Numbers
                </a>{" "}
                to buy or view your numbers.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Transfer Configuration */}
      <div className="bg-[#252525]/80 backdrop-blur-sm rounded-lg border border-white/[0.08] p-5 mb-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-white/50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <h2 className="text-sm font-medium text-white">Transfer Settings</h2>
        </div>
        <div>
          <label className="block text-xs font-medium text-white/50 mb-2">
            Transfer Phone Number
          </label>
          <input
            type="tel"
            value={transferNumber}
            onChange={(e) => setTransferNumber(e.target.value)}
            placeholder="+15551234567"
            className="w-full px-4 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
          />
          <p className="text-white/30 text-xs mt-1.5">
            Calls will be transferred to this number when the AI can&apos;t handle the request.
          </p>
        </div>
      </div>

      {/* Vapi Assistant */}
      <div className="bg-[#252525]/80 backdrop-blur-sm rounded-lg border border-white/[0.08] p-5 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-white/50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-sm font-medium text-white">AI Assistant</h2>
        </div>
        <div className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/[0.06] rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-white text-sm font-medium">Service Agent</p>
              <p className="text-white/40 text-xs mt-0.5">Car Dealership Service Department</p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded border border-emerald-500/20">
            Active
          </span>
        </div>
        <p className="text-white/30 text-xs mt-3 font-mono">ID: {SERVICE_AGENT_ID}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#1a1a1a] rounded-lg text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Connecting...
            </>
          ) : (
            "Connect Phone Number"
          )}
        </button>
        {isConnected && (
          <button
            onClick={handleTestCall}
            className="px-5 py-2.5 bg-white/[0.08] border border-white/[0.1] text-white rounded-lg text-sm font-medium hover:bg-white/[0.12] transition-colors"
          >
            Test Call
          </button>
        )}
      </div>
    </div>
  );
}
