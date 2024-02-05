// import ScrollToHashElement from '@/components/ScrollToHashElement';
// import MainNav from '@/components/widgets/MainNav';
import { Outlet } from 'react-router-dom';
export default function Root() {
  return (
    <div className="grid min-h-screen w-full overflow-y-auto overflow-x-hidden">
      {/* <ScrollToHashElement /> */}
      {/* <MainNav /> */}
      {/* <div id="content">
        
      </div> */}
      <Outlet />
    </div>
  );
}
