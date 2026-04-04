// components/WarmupHealthCircle.tsx
"use client";

interface Props {
  score: number; // 0–100
  size?: "sm" | "md" | "lg";
}

export default function WarmupHealthCircle({ score, size = "md" }: Props) {
  const radius = 42;
  const stroke = 8;
  const normalized = Math.min(Math.max(score, 0), 100);
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalized / 100) * circumference;

  const color =
    score >= 80
      ? "stroke-green-500"
      : score >= 50
      ? "stroke-amber-500"
      : "stroke-red-500";

  const sizes = {
    sm: "w-20 h-20",
    md: "w-28 h-28",
    lg: "w-36 h-36",
  };

  return (
    <div className={`relative ${sizes[size]}`}>
      <svg viewBox="0 0 100 100" className="rotate-[-90deg]">
        <circle
          cx="50"
          cy="50"
          r={radius}
          strokeWidth={stroke}
          className="stroke-gray-200"
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${color} transition-all duration-700 ease-out`}
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-900">
          {normalized}
        </span>
        <span className="text-xs text-gray-500">Health</span>
      </div>
    </div>
  );
}