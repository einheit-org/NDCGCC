import ScrollToHashElement from "@/components/ScrollToHashElement";
import MainNav from "@/components/widgets/MainNav";
import { Outlet } from "react-router-dom";
export default function Root() {
  return (
    <div className="flex flex-col relative w-full h-screen overflow-y-auto overflow-x-hidden">
      <ScrollToHashElement />
      <MainNav />
      <div id="content">
        <Outlet />
      </div>
    </div>
  );
}
