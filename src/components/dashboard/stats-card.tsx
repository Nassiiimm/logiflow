import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

export function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "bg-cyan-500/20 text-cyan-400",
}: StatsCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-6 transition-all hover:border-zinc-700/50 hover:shadow-lg hover:shadow-cyan-500/5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-zinc-100">{value}</p>
          {change && (
            <p
              className={cn(
                "mt-2 text-sm font-medium",
                changeType === "positive" && "text-emerald-400",
                changeType === "negative" && "text-red-400",
                changeType === "neutral" && "text-zinc-500"
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className={cn("rounded-xl p-3", iconColor)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
