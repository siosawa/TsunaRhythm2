import MonthHWAT from "./components/MonthHWAT";
import RandomWord from "./components/RandomWord";
import GraphWorkingMinutes from "./components/GraphWorkingMinutes";
import GraphHourlyRate from "./components/GraphHourlyRate";
import GraphDailyEarnings from "./components/GraphDailyEarnings";
import GraphProjectWorkingMinutes from "./components/GraphProjectWorkingMinutes";
import ProjectHourlyWageRanking from "./components/ProjectHourlyWageRanking";
import WorkTypeHourlyWageRanking from "./components/WorkTypeHourlyWageRanking";
import ViewTable from "./components/ViewTable";

const Dashboard = () => {
  return (
    <>
      <div className="mx-7 grid 845s:grid-cols-2 1600s:grid-cols-4 gap-5 place-items-center mt-12">
        <div>
          <div className="flex space-x-4">
            <MonthHWAT />
            <RandomWord />
          </div>
          <ViewTable />
        </div>
        <div className="space-y-5">
          <GraphWorkingMinutes />
          <GraphProjectWorkingMinutes />
        </div>
        <div className="space-y-5">
          <GraphHourlyRate />
          <GraphDailyEarnings />
        </div>
        <div className="space-y-5">
          <ProjectHourlyWageRanking />
          <WorkTypeHourlyWageRanking />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
