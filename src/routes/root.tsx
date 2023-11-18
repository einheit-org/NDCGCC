import ScrollToHashElement from "@/components/ScrollToHashElement";
import Home from "./home";
import MainNav from "@/components/widgets/MainNav";
export default function Root() {
  return (
    <div className="flex flex-col w-full h-screen overflow-y-auto overflow-x-hidden">
      <ScrollToHashElement />
      <MainNav />
      <div id="content">
        <Home />
      </div>
    </div>
  );
}
