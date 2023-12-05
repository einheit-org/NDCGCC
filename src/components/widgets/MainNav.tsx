import { Info, PhoneIcon, BarChartHorizontal, LogIn, Menu } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import MobileNav from '../MobileNav';

export default function MainNav() {
  const [openMobileNav, setOpenMobileNav] = useState(false);
  return (
    <nav className="fixed flex w-full items-center bg-ndcgreen p-2 shadow-lg">
      <div className="mx-auto flex w-11/12 flex-row items-center justify-between">
        <div className="flex flex-col items-center justify-start">
          <Link to="/" className="flex flex-row items-center">
            <div className="flex h-14 w-14 items-center rounded-full bg-white/80 px-2">
              <img src="/logo.png" alt="NDC Good Governance" />
            </div>
            <div className="ml-3 flex flex-col items-center justify-center">
              <p className=" text-5xl font-extrabold leading-none text-black drop-shadow-lg">
                <span className="text-white">N</span>
                <span className="text-ndcred">D</span>C
              </p>
              <p className="-mt-1 text-[7.5px] font-semibold uppercase text-white">
                Good Governance Card
              </p>
            </div>
          </Link>
        </div>
        <div className="hidden xl:flex">
          <ul className="flex flex-row space-x-3">
            {/* <li>
              <Link
                to="/"
                className="hover:bg-ndcgreen text-white  bg-black/90 px-4 py-2.5 font-medium flex items-center text-xs lg:ml-2 w-full rounded-fancy"
              >
                <HomeIcon strokeWidth={2} size={16} />
                <span className="ml-2">Home</span>
              </Link>
            </li> */}
            <li>
              <Link
                to="/#about"
                className="flex w-full  items-center rounded-fancy bg-black/90 px-4 py-2.5 text-xs font-medium text-white hover:bg-ndcgreen lg:ml-2"
              >
                <Info strokeWidth={3} size={16} />
                <span className="ml-2">About</span>
              </Link>
            </li>
            <li>
              <Link
                to="/#contact"
                className="flex w-full  items-center rounded-fancy bg-black/90 px-4 py-2.5 text-xs font-medium text-white hover:bg-ndcgreen lg:ml-2"
              >
                <PhoneIcon strokeWidth={3} size={16} />
                <span className="ml-2">Contact</span>
              </Link>
            </li>
            <li>
              <Link
                to="/donorwall"
                className="ml-2 flex w-auto items-center whitespace-nowrap rounded-fancy border-[1px] border-white bg-white px-4  py-3 text-xs font-normal text-black hover:bg-black/80 hover:text-white"
              >
                <BarChartHorizontal strokeWidth={3} size={16} />
                <span className="ml-2">Donor Wall</span>
              </Link>
            </li>
            <li>
              <Link
                to="/arrears"
                className="ml-2 flex w-full items-center whitespace-nowrap rounded-fancy border-[1px] border-white bg-ndcgreen px-4  py-3 text-xs font-normal text-white hover:bg-black/80 hover:text-white"
              >
                <BarChartHorizontal strokeWidth={3} size={16} />
                <span className="ml-2">Check Arrears</span>
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="ml-2 flex w-full flex-row items-center whitespace-nowrap rounded-fancy border-[1px] border-ndcgreen bg-ndcred px-4 py-3 text-xs font-normal  text-white hover:border-white hover:bg-ndcgreen hover:text-white"
              >
                <LogIn size={16} />
                <span className="ml-2">Register</span>
              </Link>
            </li>
            <li>
              <Link
                to="/agent"
                className="ml-2 flex w-full items-center whitespace-nowrap rounded-fancy border-[1px] border-ndcgreen bg-black px-4 py-3 text-xs font-normal  text-white hover:border-white hover:bg-ndcgreen hover:text-white"
              >
                <LogIn size={16} />
                <span className="ml-2">Agent</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin"
                className="ml-2 flex w-full items-center whitespace-nowrap rounded-fancy border-[1px] border-ndcgreen bg-black px-4 py-3 text-xs font-normal  text-white hover:border-white hover:bg-ndcgreen hover:text-white"
              >
                <LogIn size={16} />
                <span className="ml-2">Admin</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex xl:hidden">
          <button
            className="text-white"
            onClick={() => setOpenMobileNav(!openMobileNav)}
          >
            <Menu />
          </button>
        </div>
        {openMobileNav && (
          <MobileNav isOpen={openMobileNav} setClose={setOpenMobileNav} />
        )}
      </div>
    </nav>
  );
}
