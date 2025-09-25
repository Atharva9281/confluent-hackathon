"use client";
import { useMemo } from "react";
import type { AgentDecision as SecurityAlert } from "@/types/security";
import { useToast } from "@/components/Toast";

interface AlertsTableProps {
  alerts: SecurityAlert[];
  onApprove?: (alert: SecurityAlert) => void;
  onOverride?: (alert: SecurityAlert) => void;
}

export default function AlertsTable({ alerts, onApprove, onOverride }: AlertsTableProps) {
  const { show } = useToast();

  const severityRowColor = useMemo(
    () => ({
      Low: "bg-green-50",
      Medium: "bg-yellow-50",
      High: "bg-red-50",
    }),
    []
  );

  const severityBadge = useMemo(
    () => ({
      Low: "bg-green-100 text-green-700",
      Medium: "bg-yellow-100 text-yellow-700",
      High: "bg-red-100 text-red-700",
    }),
    []
  );

  const handleApprove = (a: SecurityAlert) => {
    show("User blocked successfully", "success");
    onApprove?.(a);
  };

  const handleOverride = (a: SecurityAlert) => {
    show("Marked as safe", "info");
    onOverride?.(a);
  };

  return (
    <div className="overflow-x-auto rounded-xl shadow-md bg-white">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2">Timestamp</th>
            <th className="px-4 py-2">User</th>
            <th className="px-4 py-2">Event</th>
            <th className="px-4 py-2">Severity</th>
            <th className="px-4 py-2">Recommended Action</th>
            <th className="px-4 py-2">AI Confidence</th>
            <th className="px-4 py-2">Rationale</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {alerts.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-gray-500" colSpan={8}>
                No alerts yet. Connect to backend to stream alerts.
              </td>
            </tr>
          ) : (
            alerts.map((alert) => (
              <tr key={alert.id} className={`${severityRowColor[alert.severity]} border-b`}>
                <td className="px-4 py-2 whitespace-nowrap">{new Date(alert.timestamp).toLocaleTimeString()}</td>
                <td className="px-4 py-2 whitespace-nowrap">{alert.user}</td>
                <td className="px-4 py-2 whitespace-nowrap">{alert.event}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded ${severityBadge[alert.severity]}`}>
                    {alert.severity}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">{alert.action}</td>
                <td className="px-4 py-2 whitespace-nowrap">{alert.confidence}%</td>
                <td className="px-4 py-2 max-w-[320px]">{alert.rationale}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(alert)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleOverride(alert)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                    >
                      Override
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
