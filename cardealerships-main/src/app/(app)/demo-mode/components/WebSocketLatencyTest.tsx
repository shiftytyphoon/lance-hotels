'use client';

import { useState, useRef, useEffect } from 'react';

/**
 * WebSocket Latency Test Component
 *
 * Tests round-trip latency to validate Edge Function performance.
 * Target: <50ms (local), <100ms (deployed)
 *
 * Usage: Add to demo-mode page during development
 */

interface LatencyMetrics {
  min: number;
  max: number;
  avg: number;
  p50: number;
  p95: number;
  p99: number;
}

export function WebSocketLatencyTest() {
  const [isConnected, setIsConnected] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [latencies, setLatencies] = useState<number[]>([]);
  const [metrics, setMetrics] = useState<LatencyMetrics | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Calculate percentiles
  const calculateMetrics = (values: number[]): LatencyMetrics => {
    if (values.length === 0) {
      return { min: 0, max: 0, avg: 0, p50: 0, p95: 0, p99: 0 };
    }

    const sorted = [...values].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);

    return {
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: Math.round(sum / sorted.length),
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    };
  };

  const connect = () => {
    // Determine WebSocket URL (ws in dev, wss in prod)
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/voice/stream`;

    console.log('[LatencyTest] Connecting to:', wsUrl);

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('[LatencyTest] Connected');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'echo' && data.clientTime) {
          const roundTrip = Date.now() - data.clientTime;
          setLatencies((prev) => [...prev, roundTrip]);
        }
      } catch (error) {
        console.error('[LatencyTest] Parse error:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('[LatencyTest] WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('[LatencyTest] Disconnected');
      setIsConnected(false);
      setIsTesting(false);
    };
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  const runTest = async () => {
    if (!wsRef.current || !isConnected) {
      alert('Connect first!');
      return;
    }

    setIsTesting(true);
    setLatencies([]);
    setMetrics(null);

    // Send 50 echo messages (1 per 100ms = 5 seconds total)
    for (let i = 0; i < 50; i++) {
      wsRef.current.send(JSON.stringify({
        type: 'echo',
        timestamp: Date.now(),
      }));

      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    setIsTesting(false);
  };

  // Update metrics when latencies change
  useEffect(() => {
    if (latencies.length > 0) {
      setMetrics(calculateMetrics(latencies));
    }
  }, [latencies]);

  return (
    <div className="bg-[#1e1e1e] rounded-xl p-6 border border-white/[0.06]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-medium">WebSocket Latency Test</h3>
          <p className="text-white/40 text-xs mt-1">
            Round-trip measurement (client → Edge → client)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isConnected ? (
            <button
              onClick={connect}
              className="px-4 py-2 bg-emerald-500/20 text-emerald-400 text-sm rounded-lg hover:bg-emerald-500/30 transition-colors border border-emerald-500/30"
            >
              Connect
            </button>
          ) : (
            <>
              <button
                onClick={runTest}
                disabled={isTesting}
                className="px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTesting ? 'Testing...' : 'Run Test (50 pings)'}
              </button>
              <button
                onClick={disconnect}
                className="px-4 py-2 bg-red-500/20 text-red-400 text-sm rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30"
              >
                Disconnect
              </button>
            </>
          )}
        </div>
      </div>

      {/* Connection Status */}
      <div className="mb-4 flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-emerald-500' : 'bg-red-500'
          }`}
        />
        <span className="text-white/60 text-sm">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {/* Metrics */}
      {metrics && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/[0.04] rounded-lg p-3">
            <p className="text-white/40 text-xs mb-1">Average</p>
            <p className="text-white text-xl font-semibold">{metrics.avg}ms</p>
          </div>

          <div className="bg-white/[0.04] rounded-lg p-3">
            <p className="text-white/40 text-xs mb-1">P50 (Median)</p>
            <p className="text-white text-xl font-semibold">{metrics.p50}ms</p>
          </div>

          <div className="bg-white/[0.04] rounded-lg p-3">
            <p className="text-white/40 text-xs mb-1">P95</p>
            <p className="text-white text-xl font-semibold">{metrics.p95}ms</p>
          </div>

          <div className="bg-white/[0.04] rounded-lg p-3">
            <p className="text-white/40 text-xs mb-1">Min</p>
            <p className="text-white text-xl font-semibold">{metrics.min}ms</p>
          </div>

          <div className="bg-white/[0.04] rounded-lg p-3">
            <p className="text-white/40 text-xs mb-1">Max</p>
            <p className="text-white text-xl font-semibold">{metrics.max}ms</p>
          </div>

          <div className="bg-white/[0.04] rounded-lg p-3">
            <p className="text-white/40 text-xs mb-1">P99</p>
            <p className="text-white text-xl font-semibold">{metrics.p99}ms</p>
          </div>
        </div>
      )}

      {/* Recent latencies */}
      {latencies.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/[0.06]">
          <p className="text-white/40 text-xs mb-2">
            Recent pings ({latencies.length} total):
          </p>
          <div className="flex flex-wrap gap-1">
            {latencies.slice(-20).map((latency, i) => (
              <span
                key={i}
                className={`px-2 py-1 rounded text-xs ${
                  latency < 50
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : latency < 100
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {latency}ms
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Target indicators */}
      <div className="mt-4 pt-4 border-t border-white/[0.06] text-xs text-white/40">
        <p>Targets: &lt;50ms (excellent) | &lt;100ms (good) | &gt;100ms (needs optimization)</p>
      </div>
    </div>
  );
}
