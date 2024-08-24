import Login from "@/components/Login";
import RootCalmCafe from "@/components/room/RootCalmCafe";

export default function Home(): JSX.Element {
  return (
    <div>
      <RootCalmCafe />
      <div className="absolute z-30">
        <Login />
      </div>
    </div>
  );
}
