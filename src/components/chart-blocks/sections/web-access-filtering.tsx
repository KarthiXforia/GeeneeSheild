import Container from "@/components/container";
import BlockedDomains from "../charts/blocked-domains";
import DomainCategories from "../charts/domain-categories";
import PeakAccessTime from "../charts/peak-access-time";
import { RegionFilter } from "../components/region-filter";

export default function WebAccessFiltering() {
  return (
    <div>
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
            <h3 className="text-lg font-semibold">Domain Categories</h3>
            <RegionFilter />
          </div>
          <DomainCategories />
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
