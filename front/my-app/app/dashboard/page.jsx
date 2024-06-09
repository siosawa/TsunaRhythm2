import { Calendar } from "@/components/ui/calendar";
import { EditTable } from "./components/EditTable";
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
