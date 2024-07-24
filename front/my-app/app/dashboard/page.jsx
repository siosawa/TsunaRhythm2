import { Calendar } from "@/components/ui/calendar";
import MonthHWAT from "./components/MonthHWAT";
import RandomWord from "./components/RandomWord";
import GraphWorkingMinutes from "./components/GraphWorkingMinutes";
import GraphHourlyRate from "./components/GraphHourlyRate";
import GraphDailyEarnings from "./components/GraphDailyEarnings";
import GraphProjectWorkingMinutes from "./components/GraphProjectWorkingMinutes";
import ProjectHourlyWageRanking from "./components/ProjectHourlyWageRanking";
import WorkTypeHourlyWageRanking from "./components/WorkTypeHourlyWageRanking";
import TsunaRhythm from "@/components/TsunaRhythm";
import ViewTable from "./components/ViewTable";

const Dashboard = () => {
  return (
    <>
      <div className="mx-7 grid 845s:grid-cols-2 1320s:grid-cols-3 1600s:grid-cols-4 gap-5 place-items-center mt-12">
        <div className=" space-y-2">
          <GraphWorkingMinutes />
          <GraphProjectWorkingMinutes />
        </div>
        <div className="space-y-2">
          <GraphHourlyRate />
          <GraphDailyEarnings />
        </div>
        <div className="space-y-2">
          <ProjectHourlyWageRanking />
          <WorkTypeHourlyWageRanking />
        </div>
        <Calendar />
        <div className="col-span-2">
          {/* <EditTable /> */}
          <ViewTable />
        </div>
        <div className="flex items-center space-x-2 ">
          <MonthHWAT />
          <RandomWord />
        </div>
        <div className="hidden 2xl:block col-span-2 bg-orange-200 rounded-3xl shadow-custom-dark ">
          <TsunaRhythm />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
