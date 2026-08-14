import WelcomeHeader from "../components/Dashborad/WelcomeHeader";
import StatsGrid from "../components/Dashborad/StatsGrid";
import QuickActions from "../components/Dashborad/QuickActions";
import AttendancePreview from "../components/Dashborad/AttendancePreview";
import TodayTaskPreview from "../components/Dashborad/TodayTaskPreview";
import QuickStats from "../components/Dashborad/QuickStats";

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