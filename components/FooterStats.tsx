interface FooterStatsProps {
  totalEvents: number;
  anomalies: number;
  blocked: number;
}

export default function FooterStats({ totalEvents, anomalies, blocked }: FooterStatsProps) {
  return (
    <div className="w-full bg-white text-gray-800 mt-6 p-4 rounded-xl shadow-md flex items-center justify-between">
      <span className="font-medium">
        {totalEvents} events processed, {anomalies} anomalies, {blocked} blocked
      </span>
    </div>
  );
}

