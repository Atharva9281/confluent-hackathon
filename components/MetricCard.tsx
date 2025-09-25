import React from "react";

type Color = "blue" | "yellow" | "red";

interface MetricCardProps {
  title: string;
  value: number;
  color: Color;
}

const colorMap: Record<Color, string> = {
  blue: "bg-blue-500",
  yellow: "bg-yellow-500",
  red: "bg-red-500",
};

export default function MetricCard({ title, value, color }: MetricCardProps) {
  return (
    <div className="rounded-xl shadow-md p-4 bg-white flex flex-col items-start">
      <span className="text-sm text-gray-600">{title}</span>
      <span
        className={`mt-2 inline-flex items-center justify-center text-3xl font-bold ${colorMap[color]} text-white rounded-lg px-3 py-1`}
      >
        {value}
      </span>
    </div>
  );
}

