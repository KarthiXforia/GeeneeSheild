import Container from "@/components/container";
import BlockedDomainHeatmap from "../charts/blocked-domain-heatmap";
import BlockedDomainTrends from "../charts/blocked-domain-trends";
import BlockedDomains from "../charts/blocked-domains";
import PeakAccessTime from "../charts/peak-access-time";
import { RegionFilter } from "../components/region-filter";
import BlockedDomainSummary from "../charts/blocked-domain-summary";

export default function WebAccessFiltering() {
  return (
    <div className="space-y-6">
      {/* Summary Section */}
      <div className="border-b border-border">
        <Container className="py-4">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <h3 className="text-lg font-semibold">Blocked Domains Summary</h3>
            <RegionFilter />
          </div>
          <BlockedDomainSummary />
        </Container>
      </div>

      {/* Two column section for Blocked Domains and Domain Categories */}
      <div className="grid grid-cols-1 divide-y border-b border-border laptop:grid-cols-2 laptop:divide-x laptop:divide-y-0 laptop:divide-border">
        <Container className="py-4 laptop:col-span-1">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <h3 className="text-lg font-semibold">Blocked Domain Attempts</h3>
            <RegionFilter />
          </div>
          <BlockedDomains />
        </Container>

        <Container className="py-4 laptop:col-span-1">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <h3 className="text-lg font-semibold">Blocked Domain Activity</h3>
          </div>
          <BlockedDomainHeatmap />
        </Container>
      </div>

      <div className="border-b border-border">
        <Container className="py-4">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <h3 className="text-lg font-semibold">Blocked Domain Trends</h3>
            <RegionFilter />
          </div>
          <BlockedDomainTrends />
        </Container>
      </div>

      {/* Peak Access Time */}
      <div className="border-b border-border">
        <Container className="py-4">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <h3 className="text-lg font-semibold">Peak Access Time</h3>
            <RegionFilter />
          </div>
          <PeakAccessTime />
        </Container>
      </div>
    </div>
  );
}
