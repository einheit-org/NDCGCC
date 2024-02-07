import ScrollToHashElement from '@/components/ScrollToHashElement';
import MainNav from '@/components/widgets/MainNav';
import { Outlet } from 'react-router-dom';
export default function Root() {
  return (
    <div className="relative flex h-screen w-full flex-col overflow-y-auto overflow-x-hidden">
      <ScrollToHashElement />
      <MainNav />
      <div id="content">
        <Outlet />
      </div>
    </div>
  );
}
