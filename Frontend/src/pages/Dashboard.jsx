import WelcomeHeader from "../components/Dashborad/WelcomeHeader";
import StatsGrid from "../components/Dashborad/StatsGrid";

import BatchProgressCard from "../components/Dashborad/BatchProgressCard";
import ScheduleCard from "../components/Dashborad/ScheduleCard";

import {
  batchData,
  scheduleData,
} from "../components/common/dashboardData";

function Dashboard() {
  return (
    <div className="p-6">

      <WelcomeHeader />

       <StatsGrid />

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        
        <BatchProgressCard data={batchData} />
        <ScheduleCard data={scheduleData} />

      </div>

     

    </div>
  );
}

export default Dashboard;