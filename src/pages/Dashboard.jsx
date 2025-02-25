import SideBarDashboard from "../components/SideBarDashboard.jsx";
import { Outlet, useParams } from "react-router-dom";

export const Dashboard = () => {
  const { username } = useParams();
  console.log(username);
  
  return (
    <>
      <SideBarDashboard />
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <Outlet />
      </main>
    </>
  );
}
