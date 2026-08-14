import WelcomeHeader from "../components/features/Dashboard/WelcomeHeader";
import StatsGrid from "../components/features/Dashboard/StatsGrid";
import QuickActions from "../components/features/Dashboard/QuickActions";
import AttendancePreview from "../components/features/Dashboard/AttendancePreview";
import TodayTaskPreview from "../components/features/Dashboard/TodayTaskPreview";
import QuickStats from "../components/features/Dashboard/QuickStats";

function Dashboard() {
  return (
    <div className="p-5 space-y-5">
      <WelcomeHeader />

      <StatsGrid />

      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <AttendancePreview />
        </div>

        <TodayTaskPreview />
      </div>

      <QuickStats />
    </div>
  );
}

export default Dashboard;