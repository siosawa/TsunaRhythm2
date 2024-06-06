import Login from "@/components/Login";
import ClamCafe from "@/components/room/ClamCafe";

export default function Home() {
  return (
    <div>
      <ClamCafe />
      <div className="absolute z-30">
        <Login />
      </div>
    </div>
  );
}
