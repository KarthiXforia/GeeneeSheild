import {
  DeviceManagement,
  SecurityCompliance,
  UsageAnalytics,
  WebAccessFiltering,
} from "@/components/chart-blocks";
import BlockedApps from "@/components/chart-blocks/sections/blocked-apps";
import Container from "@/components/container";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* 📱 Device Management Section */}
      <div className="border-b border-border">
        <Container>
          <h2 className="py-4 text-xl font-semibold">📱 Device Management</h2>
        </Container>
        <DeviceManagement />
      </div>

      {/* 🌐 Web Access & Filtering Section */}
      <div className="border-b border-border">
        <Container>
          <h2 className="py-4 text-xl font-semibold">
            🌐 Web Access & Filtering
          </h2>
        </Container>
        <WebAccessFiltering />
      </div>

      {/* 📱 Blocked Apps Section */}
      <div className="border-b border-border">
        <Container>
          <h2 className="py-4 text-xl font-semibold">
            🚫 Blocked Apps Accesssed
          </h2>
        </Container>
        <BlockedApps />
      </div>

      {/* 🔒 Security & Compliance Section */}
      <div className="border-b border-border">
        <Container>
          <h2 className="py-4 text-xl font-semibold">
            🔒 Security & Compliance
          </h2>
        </Container>
        <SecurityCompliance />
      </div>

      {/* 📊 Usage Analytics Section */}
      <div>
        <Container>
          <h2 className="py-4 text-xl font-semibold">📊 Usage Analytics</h2>
        </Container>
        <UsageAnalytics />
      </div>
    </div>
  );
}
