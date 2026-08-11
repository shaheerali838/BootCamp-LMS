import WelcomeHeader from "../components/Dashborad/WelcomeHeader";
import StatsGrid from "../components/Dashborad/StatsGrid";

function Dashboard() {
  return (
    <div className="p-6">
      <WelcomeHeader />
      <StatsGrid />
    </div>
  );
}

export default Dashboard;