import Container from "@/components/container";
import AccessibilityPermissions from "../charts/accessibility-permissions";
import KnoxEnrollmentErrors from "../charts/enrollment-errors";
import EnrollmentFunnel from "../charts/enrollment-funnel";
import { RegionFilter } from "../components/region-filter";

export default function SecurityCompliance() {
  return (
    <div>
      {/* Two column section for Accessibility Permissions and Enrollment Errors */}
      <div className="grid grid-cols-1 divide-y border-b border-border laptop:grid-cols-2 laptop:divide-x laptop:divide-y-0 laptop:divide-border">
        <Container className="py-4 laptop:col-span-1">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <h3 className="text-lg font-semibold">Accessibility Permissions</h3>
            <RegionFilter />
          </div>
          <AccessibilityPermissions />
        </Container>
        <Container className="py-4 laptop:col-span-1">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <h3 className="text-lg font-semibold">Knox Enrollment Errors</h3>
            <RegionFilter />
          </div>
          <KnoxEnrollmentErrors />
        </Container>
      </div>

      {/* Enrollment Funnel */}
      <div className="border-b border-border">
        <Container className="py-4">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <h3 className="text-lg font-semibold">Enrollment Flow Funnel</h3>
            <RegionFilter />
          </div>
          <EnrollmentFunnel />
        </Container>
      </div>
    </div>
  );
}
