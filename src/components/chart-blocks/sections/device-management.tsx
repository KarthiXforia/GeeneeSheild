import Container from "@/components/container";
import { EnrolledDevicesMetrics } from "..";
import ActiveVsInactiveDevices from "../charts/active-vs-inactive";
import BatteryConsumption from "../charts/battery-consumption";
import DeviceActivationTrend from "../charts/device-activation-trend";
import { RegionFilter } from "../components/region-filter";

export default function DeviceManagement() {
  return (
    <div>
      {/* Metrics at the top */}
      <EnrolledDevicesMetrics />

      {/* Two column section */}
      <div className="grid grid-cols-1 divide-y border-b border-border laptop:grid-cols-3 laptop:divide-x laptop:divide-y-0 laptop:divide-border">
        <Container className="py-4 laptop:col-span-2">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <h3 className="text-lg font-semibold">Device Activation Trend</h3>
            <RegionFilter />
          </div>
          <DeviceActivationTrend />
        </Container>
        <Container className="py-4 laptop:col-span-1">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <h3 className="text-lg font-semibold">Battery Consumption</h3>
            <RegionFilter />
          </div>
          <BatteryConsumption />
        </Container>
      </div>

      {/* Bar chart for active vs inactive */}
      <div className="border-b border-border">
        <Container className="py-4">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <h3 className="text-lg font-semibold">
              Active vs Inactive Devices
            </h3>
            <RegionFilter />
          </div>
          <ActiveVsInactiveDevices />
        </Container>
      </div>
    </div>
  );
}
