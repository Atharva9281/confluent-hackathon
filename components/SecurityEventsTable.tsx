"use client";
import type { SecurityEvent } from "@/types/security";

interface Props {
  events: SecurityEvent[];
}

export default function SecurityEventsTable({ events }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl shadow-md bg-white">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2">Timestamp</th>
            <th className="px-4 py-2">User</th>
            <th className="px-4 py-2">Event</th>
            <th className="px-4 py-2">IP</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-gray-500" colSpan={5}>
                Waiting for events…
              </td>
            </tr>
          ) : (
            events.map((e) => (
              <tr key={`${e.timestamp}-${e.user}-${e.ip}`} className="border-b">
                <td className="px-4 py-2 whitespace-nowrap">{new Date(e.timestamp).toLocaleTimeString()}</td>
                <td className="px-4 py-2 whitespace-nowrap">{e.user}</td>
                <td className="px-4 py-2 whitespace-nowrap">{e.event}</td>
                <td className="px-4 py-2 whitespace-nowrap">{e.ip}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      e.status === 'success'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {e.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
