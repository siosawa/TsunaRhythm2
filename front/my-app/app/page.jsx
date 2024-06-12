import Login from "@/components/Login";
import RootClamCafe from "@/components/room/RootClamCafe";

export default function Home() {
  return (
    <div>
      <RootClamCafe />
      <div className="absolute z-30">
        <Login />
      </div>
    </div>
  );
}
