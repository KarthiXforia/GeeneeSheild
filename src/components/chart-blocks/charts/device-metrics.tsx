"use client";

import {
  Accessibility, // Activity,
  ArrowDownRight,
  ArrowUpRight,
  CheckCheck,
  Loader2,
  Tablet,
} from "lucide-react";
import Container from "@/components/container";
import { useDeviceMetrics } from "@/hooks/useDeviceMetrics";
import { cn } from "@/lib/utils";

type Metric = {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
};

const iconMap: Record<string, React.ReactNode> = {
  "Total Enrolled Devices": <Tablet className="h-5 w-5" />,
  "Devices in Kiosk Mode": <Tablet className="h-5 w-5" />,
  "Accessibility Enabled": <Accessibility className="h-5 w-5" />,
  "Activation Success Rate": <CheckCheck className="h-5 w-5" />,
};

export default function EnrolledDevicesMetrics() {
  const { data, error, isLoading } = useDeviceMetrics();

  if (isLoading) {
    return (
      <Container className="flex h-40 items-center justify-center border-b border-border">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="flex h-40 items-center justify-center border-b border-border">
        <p className="text-destructive">
          Failed to load device metrics. Please try again later.
        </p>
      </Container>
    );
  }

  const metrics: Metric[] = [
    {
      title: "Total Enrolled Devices",
      value: data?.totalDevices.toLocaleString() || "0",
      change: 0.12, // You might want to calculate this from your API
      icon: iconMap["Total Enrolled Devices"],
    },
    {
      title: "Devices in Kiosk Mode",
      value: data?.kioskModeDevices.toLocaleString() || "0",
      change: 0.08, // You might want to calculate this from your API
      icon: iconMap["Devices in Kiosk Mode"],
    },
    {
      title: "Accessibility Enabled",
      value: data?.accessibilityEnabled.toLocaleString() || "0",
      change: 0.15, // You might want to calculate this from your API
      icon: iconMap["Accessibility Enabled"],
    },
    {
      title: "Activation Success Rate",
      value: `${data?.activationSuccessRate || 0}%`,
      change: 0.05, // You might want to calculate this from your API
      icon: iconMap["Activation Success Rate"],
    },
  ];

  return (
    <Container className="grid grid-cols-1 gap-y-6 border-b border-border py-4 phone:grid-cols-2 laptop:grid-cols-4">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          change={metric.change}
          icon={metric.icon}
        />
      ))}
    </Container>
  );
}

function MetricCard({
  title,
  value,
  change,
  icon,
  className,
}: {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex flex-col", className)}>
      <div className="mb-1 flex items-center gap-2">
        {icon}
        <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xl font-medium">{value}</span>
        <ChangeIndicator change={change} />
      </div>
      <div className="text-xs text-muted-foreground">Compare to last month</div>
    </section>
  );
}

function ChangeIndicator({ change }: { change: number }) {
  return (
    <span
      className={cn(
        "flex items-center rounded-sm px-1 py-0.5 text-xs text-muted-foreground",
        change > 0
          ? "bg-green-50 text-green-500 dark:bg-green-950"
          : "bg-red-50 text-red-500 dark:bg-red-950",
      )}
    >
      {change > 0 ? "+" : ""}
      {Math.round(change * 100)}%
      {change > 0 ? (
        <ArrowUpRight className="ml-0.5 inline-block h-3 w-3" />
      ) : (
        <ArrowDownRight className="ml-0.5 inline-block h-3 w-3" />
      )}
    </span>
  );
}
