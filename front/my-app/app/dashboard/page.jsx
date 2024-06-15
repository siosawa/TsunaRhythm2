import { Calendar } from "@/components/ui/calendar";
import { EditTable } from "./components/EditTable";
import MonthHWAT from "./components/MonthHWAT";
import RandomWord from "./components/RandomWord";
const Dashboard = () => {
  return (
    <>
      <div className="flex flex-col items-start space-y-4 mt-12">
        <div>dashboard?</div>
        <div className="my-10 mx-7 bg-white rounded-3xl shadow-custom-dark">
          <Calendar />
        </div>
        <div className="lg:w-1/3">
          <EditTable />
        </div>
      </div>
      <MonthHWAT />
      <RandomWord />
    </>
  );
};

export default Dashboard;

{
  /* <Logo />
<MonthHWAT />
<RandomWord />
<CaseHW />
<WorkHW />
<GraphHWA />
<GraphHWT />
<Calendar />
<EditTable />  */
}
