"use client";

import { useState } from "react";

type TreeItem = {
  id: string;
  name: string;
  type: "folder" | "file";
  children?: TreeItem[];
  isExpanded?: boolean;
};

const agentTree: TreeItem[] = [
  {
    id: "scenarios",
    name: "Scenarios",
    type: "folder",
    isExpanded: true,
    children: [
      { id: "service-inquiry", name: "Service inquiry", type: "file" },
      { id: "appointment-booking", name: "Appointment booking", type: "file" },
      { id: "transfer-request", name: "Transfer request", type: "file" },
      { id: "parts-inquiry", name: "Parts inquiry", type: "file" },
    ],
  },
  {
    id: "supporting-docs",
    name: "Supporting docs",
    type: "folder",
    isExpanded: true,
    children: [
      { id: "service-menu", name: "Service menu.pdf", type: "file" },
      { id: "pricing-guide", name: "Pricing guide.csv", type: "file" },
      { id: "transfer-flowchart", name: "Transfer flowchart.png", type: "file" },
    ],
  },
  {
    id: "brand",
    name: "Brand",
    type: "folder",
    children: [],
  },
  {
    id: "rules",
    name: "Rules",
    type: "folder",
    isExpanded: true,
    children: [
      { id: "verify-customer", name: "Verify customer before transfer", type: "file" },
      { id: "collect-info", name: "Collect vehicle info first", type: "file" },
    ],
  },
];

const scenarioSteps = [
  {
    id: 1,
    title: 'Scenario 1: "Service Inquiry"',
    steps: [
      {
        type: "say",
        content: '"Welcome to the Service Department! I\'m here to help with your vehicle service needs. May I have your name and the vehicle you\'re calling about?"',
      },
      {
        type: "condition",
        label: "Customer provides info",
        tag: "@info_confirmed",
        action: "proceed to",
        target: "Service Options",
      },
      {
        type: "condition",
        label: "Customer refuses",
        tag: "@info_not_provided",
        action: "proceed to",
        target: "Escalation",
      },
    ],
  },
  {
    id: 2,
    title: 'Scenario 2: "Appointment Booking"',
    steps: [
      {
        type: "say",
        content: '"Thank you. I can help you schedule a service appointment. What type of service do you need - routine maintenance, repairs, or recall work?"',
      },
      {
        type: "condition",
        label: "Service type selected",
        tag: "verify_service_type",
        action: "proceed to",
        arrow: true,
        target: "Date Selection",
      },
      {
        type: "condition",
        label: "Customer unsure",
        tag: "@needs_guidance",
        action: "if unsure, proceed to",
        target: "Service Advisor",
      },
    ],
  },
];

export default function AgentsPage() {
  const [selectedItem, setSelectedItem] = useState("service-inquiry");
  const [expandedFolders, setExpandedFolders] = useState<string[]>(["scenarios", "supporting-docs", "rules"]);

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const renderTreeItem = (item: TreeItem, depth: number = 0) => {
    const isExpanded = expandedFolders.includes(item.id);
    const isSelected = selectedItem === item.id;

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (item.type === "folder") {
              toggleFolder(item.id);
            } else {
              setSelectedItem(item.id);
            }
          }}
          className={`w-full flex items-center gap-2 px-3 py-1.5 text-left rounded-lg transition-colors ${
            isSelected && item.type === "file"
              ? "bg-white/[0.08] text-white"
              : "text-white/60 hover:bg-white/[0.04] hover:text-white/80"
          }`}
          style={{ paddingLeft: `${12 + depth * 16}px` }}
        >
          {item.type === "folder" ? (
            <>
              <svg
                className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </>
          ) : (
            <>
              <span className="w-3.5" />
              <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </>
          )}
          <span className="text-[13px]">{item.name}</span>
        </button>
        {item.type === "folder" && isExpanded && item.children && (
          <div>{item.children.map((child) => renderTreeItem(child, depth + 1))}</div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full">
      {/* Left Panel - Tree Navigation */}
      <div className="w-64 border-r border-white/[0.08] bg-[#1e1e1e]/60 backdrop-blur-sm flex flex-col">
        {/* Agent Header */}
        <div className="p-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-medium text-white">Service Agent</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded font-medium">G₀</span>
                <svg className="w-3.5 h-3.5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.05] rounded-lg border border-white/[0.08]">
            <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm text-white placeholder-white/40 focus:outline-none w-full"
            />
          </div>
        </div>

        {/* Tree */}
        <div className="flex-1 overflow-auto py-2">
          {agentTree.map((item) => renderTreeItem(item))}
        </div>

        {/* Bottom Status */}
        <div className="p-3 border-t border-white/[0.08]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-white/60">Remaining memory</span>
            </div>
            <span className="text-xs font-medium text-emerald-400">High</span>
          </div>
        </div>
      </div>

      {/* Main Content - Scenario Editor */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-[#1a1a1a]/80 backdrop-blur-sm border-b border-white/[0.08] px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-orange-400/20 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm text-white/80">Service Agent</span>
            </div>
            <span className="text-white/20">/</span>
            <span className="text-sm text-white/60">Multi-modal</span>
            <div className="flex items-center gap-1.5 text-white/40 text-xs">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              draft
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-white/50 text-xs">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>updated a min ago</span>
            </div>
            <button className="flex items-center gap-2 px-4 py-1.5 bg-white text-[#1a1a1a] rounded-lg text-sm font-medium hover:bg-white/90 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3l14 9-14 9V3z" />
              </svg>
              Deploy agent
            </button>
          </div>
        </div>

        {/* Scenario Content */}
        <div className="p-6">
          <h1 className="text-xl font-semibold text-white mb-6">Scenario: Service inquiry</h1>

          <div className="space-y-6">
            {scenarioSteps.map((scenario) => (
              <div key={scenario.id} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/20" />
                  <h3 className="text-white/80 text-sm font-medium">{scenario.title}</h3>
                </div>

                <div className="ml-7 space-y-2">
                  {scenario.steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      {step.type === "say" ? (
                        <>
                          <div className="flex items-center gap-2 text-white/40 text-sm shrink-0 w-20">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Say
                          </div>
                          <p className="text-white/70 text-sm leading-relaxed">{step.content}</p>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 text-white/40 text-sm shrink-0 w-20">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap text-sm">
                            <span className="text-white/70">{step.label}</span>
                            <code className="px-2 py-0.5 bg-white/[0.08] rounded text-orange-400 text-xs font-mono">
                              {step.tag}
                            </code>
                            <span className="text-white/40">{step.action}</span>
                            <span className="text-white/40">○</span>
                            <span className="text-white/70">{step.target}</span>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
