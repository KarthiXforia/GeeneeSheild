import Container from "@/components/container";
import ActivationOverTime from "../charts/activation-over-time";
import BrowserUsage from "../charts/browser-usage";
import DeviceModeDistribution from "../charts/device-mode-distribution";
import { RegionFilter } from "../components/region-filter";

export default function UsageAnalytics() {
  return (
    <div>
      {/* Two column section for Device Mode Distribution and Browser Usage */}
      <div className="grid grid-cols-1 divide-y border-b border-border laptop:grid-cols-2 laptop:divide-x laptop:divide-y-0 laptop:divide-border">
        <Container className="py-4 laptop:col-span-1">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <h3 className="text-lg font-semibold">Kiosk vs Active Mode</h3>
            <RegionFilter />
          </div>
          <DeviceModeDistribution />
        </Container>
        <Container className="py-4 laptop:col-span-1">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <h3 className="text-lg font-semibold">Browser Usage</h3>
            <RegionFilter />
          </div>
          <BrowserUsage />
        </Container>
      </div>

      {/* Activation Trend Over Time */}
      <div className="border-b border-border">
        <Container className="py-4">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <h3 className="text-lg font-semibold">Activation Trend Timeline</h3>
            <RegionFilter />
          </div>
          <ActivationOverTime />
        </Container>
      </div>
    </div>
  );
}
