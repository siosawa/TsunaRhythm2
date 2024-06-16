import { Calendar } from "@/components/ui/calendar";
import { EditTable } from "./components/EditTable";
import MonthHWAT from "./components/MonthHWAT";
import RandomWord from "./components/RandomWord";
import GraphWorkingMinutes from "./components/GraphWorkingMinutes";
import GraphHourlyRate from "./components/GraphHourlyRate";
import GraphDailyEarnings from "./components/GraphDailyEarnings";
import ProjectHourlyWageRanking from "./components/ProjectHourlyWageRanking";
import WorkTypeHourlyWageRanking from "./components/WorkTypeHourlyWageRanking";

const Dashboard = () => {
  return (
    <>
      <div className="flex flex-col items-center mt-16 mx-7 space-y-2 ">
        <Calendar />
        <div className="flex space-x-2">
          <MonthHWAT />
          <RandomWord />
        </div>
        <GraphWorkingMinutes />
        <GraphHourlyRate />
        <GraphDailyEarnings />
        <ProjectHourlyWageRanking />
        <WorkTypeHourlyWageRanking />
        <EditTable />
      </div>
    </>
  );
};

export default Dashboard;
