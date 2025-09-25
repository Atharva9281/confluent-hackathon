import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MetricCard from "@/components/MetricCard";
import AlertsTable from "@/components/AlertsTable";
import FooterStats from "@/components/FooterStats";
import SecurityEventsTable from "@/components/SecurityEventsTable";
import AnomaliesTable from "@/components/AnomaliesTable";
import type { AgentDecision, AnomalyAlert, SecurityEvent } from "@/types/security";

export default function Home() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyAlert[]>([]);
  const [decisions, setDecisions] = useState<AgentDecision[]>([]);
  const [totalEvents, setTotalEvents] = useState<number>(0);
  const [anomalyCount, setAnomalyCount] = useState<number>(0);
  const [blocked, setBlocked] = useState<number>(0); // HIGH severity count

  // failure windows: key=user|ip -> timestamps (ms) within rolling minute
  const failWindows = useRef<Map<string, number[]>>(new Map());

  const anomaliesMetric = anomalyCount;

  const onApprove = useCallback((_a: AgentDecision) => {
    // No-op for counters; decisions already updated based on severity
  }, []);

  const onOverride = useCallback((_a: AgentDecision) => {
    // No-op for counters, but could track overrides here
  }, []);

  // Random event generator with optional overrides (used for clustering)
  const generateEvent = (
    overrides?: Partial<SecurityEvent>
  ): SecurityEvent => ({
    timestamp: new Date().toISOString(),
    user: overrides?.user ?? `U${Math.floor(Math.random() * 1000)}`,
    event: 'login',
    ip:
      overrides?.ip ??
      `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(
        Math.random() * 255
      )}`,
    status: overrides?.status ?? (Math.random() > 0.7 ? 'success' : 'fail'),
  });

  // Process one event through the pipeline
  const processEvent = useCallback((ev: SecurityEvent) => {
    setTotalEvents((v) => v + 1);
    setEvents((prev) => [ev, ...prev].slice(0, 10));

    if (ev.status === 'fail') {
      const key = `${ev.user}|${ev.ip}`;
      const now = Date.now();
      const arr = failWindows.current.get(key) ?? [];
      const windowStart = now - 60_000; // 1 minute window
      const pruned = arr.filter((t) => t >= windowStart);
      pruned.push(now);
      failWindows.current.set(key, pruned);

      const attempts = pruned.length;
      // Trigger anomaly only at threshold edges to avoid duplicates
      if (attempts === 5 || attempts === 8) {
        const anomaly: AnomalyAlert = {
          id: Math.random().toString(36).slice(2),
          timestamp: ev.timestamp,
          user: ev.user,
          ip: ev.ip,
          attempts,
        };
        setAnomalyCount((c) => c + 1);
        setAnomalies((prev) => [anomaly, ...prev].slice(0, 10));

        const severity: AgentDecision['severity'] =
          attempts >= 8 ? 'High' : attempts >= 5 ? 'Medium' : 'Low';
        const action =
          severity === 'High'
            ? 'Block IP immediately'
            : severity === 'Medium'
            ? 'Step-up MFA'
            : 'Monitor';
        const decision: AgentDecision = {
          id: anomaly.id,
          timestamp: ev.timestamp,
          user: ev.user,
          event: 'login',
          severity,
          action,
          confidence: Math.floor(Math.random() * 20) + 80, // 80-99
          rationale: 'Multiple failed logins indicate brute-force attack.',
        };
        setDecisions((prev) => [decision, ...prev].slice(0, 10));
        if (severity === 'High') setBlocked((v) => v + 1);
      }
    }
  }, []);

  useEffect(() => {
    // Seed 100 events immediately with multiple failure clusters for diverse IPs
    const clusters = Array.from({ length: 4 }).map(() => ({
      user: `U${Math.floor(Math.random() * 1000)}`,
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    }));
    for (let i = 0; i < 100; i++) {
      const inCluster = i < 40; // 40 fails spread across 4 clusters (~10 each)
      const c = clusters[i % clusters.length];
      const ev = generateEvent({
        user: inCluster ? c.user : undefined,
        ip: inCluster ? c.ip : undefined,
        status: inCluster ? 'fail' : undefined,
      });
      processEvent(ev);
    }

    // Burst every 60s with two separate clusters to diversify anomaly IPs
    const intervalMs = 60000;
    const handle = setInterval(() => {
      const clusterA = {
        user: `U${Math.floor(Math.random() * 1000)}`,
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      };
      const clusterB = {
        user: `U${Math.floor(Math.random() * 1000)}`,
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      };
      for (let i = 0; i < 20; i++) {
        const useA = i % 2 === 0; // alternate clusters
        const isClusterFail = i < 10; // first 10 are fails across A/B => 5 fails each
        const c = useA ? clusterA : clusterB;
        const ev = generateEvent({
          user: isClusterFail ? c.user : undefined,
          ip: isClusterFail ? c.ip : undefined,
          status: isClusterFail ? 'fail' : undefined,
        });
        processEvent(ev);
      }
    }, intervalMs);
    return () => clearInterval(handle);
  }, [processEvent]);

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Security Dashboard</h1>
          <p className="text-gray-600">Real-time monitoring and actions</p>
        </header>

        {/* Metrics */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <MetricCard title="Events Processed" value={totalEvents} color="blue" />
          <MetricCard title="Anomalies Flagged" value={anomaliesMetric} color="yellow" />
          <MetricCard title="Threats Blocked" value={blocked} color="red" />
        </section>

        {/* Live Security Events */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Security Events</h2>
          <SecurityEventsTable events={events} />
        </section>

        {/* Anomaly Alerts */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Anomaly Alerts</h2>
          <AnomaliesTable anomalies={anomalies} />
        </section>

        {/* Agent Decisions (AI Layer) */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Agent Decisions</h2>
          <AlertsTable alerts={decisions} onApprove={onApprove} onOverride={onOverride} />
        </section>

        {/* Footer */}
        <footer>
          <FooterStats totalEvents={totalEvents} anomalies={anomaliesMetric} blocked={blocked} />
        </footer>
      </div>
    </div>
  );
}
