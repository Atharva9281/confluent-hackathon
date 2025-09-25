"use client";
import type { AnomalyAlert } from "@/types/security";

interface Props {
  anomalies: AnomalyAlert[];
}

export default function AnomaliesTable({ anomalies }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl shadow-md bg-white">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2">Timestamp</th>
            <th className="px-4 py-2">User</th>
            <th className="px-4 py-2">IP</th>
            <th className="px-4 py-2">Failed Attempts (1m)</th>
          </tr>
        </thead>
        <tbody>
          {anomalies.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-gray-500" colSpan={4}>
                No anomalies detected yet.
              </td>
            </tr>
          ) : (
            anomalies.map((a) => (
              <tr key={a.id} className="border-b bg-yellow-50">
                <td className="px-4 py-2 whitespace-nowrap">{new Date(a.timestamp).toLocaleTimeString()}</td>
                <td className="px-4 py-2 whitespace-nowrap">{a.user}</td>
                <td className="px-4 py-2 whitespace-nowrap">{a.ip}</td>
                <td className="px-4 py-2 whitespace-nowrap">{a.attempts}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
