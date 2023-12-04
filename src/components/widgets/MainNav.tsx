import { Info, PhoneIcon, BarChartHorizontal, LogIn, Menu } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import MobileNav from "../MobileNav"

export default function MainNav() {
  const [openMobileNav, setOpenMobileNav] = useState(false)
  return (
    <nav className="fixed shadow-lg w-full flex items-center p-2 bg-ndcgreen">
      <div className="w-11/12 mx-auto flex flex-row items-center justify-between">
        <div className="flex flex-col items-center justify-start">
          <Link to="/" className="flex flex-row items-center">
            <div className="bg-white/80 w-14 h-14 px-2 rounded-full flex items-center">
              <img src="/logo.png" alt="NDC Good Governance" />
            </div>
            <div className="flex flex-col items-center justify-center ml-3">
              <p className=" text-black font-extrabold text-5xl leading-none drop-shadow-lg">
                <span className="text-white">N</span>
                <span className="text-ndcred">D</span>C
              </p>
              <p className="uppercase text-[7.5px] text-white -mt-1 font-semibold">
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
                className="hover:bg-ndcgreen text-white  bg-black/90 px-4 py-2.5 font-medium flex items-center text-xs lg:ml-2 w-full rounded-fancy"
              >
                <Info strokeWidth={3} size={16} />
                <span className="ml-2">About</span>
              </Link>
            </li>
            <li>
              <Link
                to="/#contact"
                className="hover:bg-ndcgreen text-white  bg-black/90 px-4 py-2.5 font-medium flex items-center text-xs lg:ml-2 w-full rounded-fancy"
              >
                <PhoneIcon strokeWidth={3} size={16} />
                <span className="ml-2">Contact</span>
              </Link>
            </li>
            <li>
              <Link
                to="/donorwall"
                className="text-xs py-3 px-4 font-normal flex items-center w-auto whitespace-nowrap bg-white text-black  hover:bg-black/80 hover:text-white rounded-fancy ml-2 border-[1px] border-white"
              >
                <BarChartHorizontal strokeWidth={3} size={16} />
                <span className="ml-2">Donor Wall</span>
              </Link>
            </li>
            <li>
              <Link
                to="/arrears"
                className="text-xs py-3 px-4 font-normal flex items-center w-full whitespace-nowrap bg-ndcgreen text-white  hover:bg-black/80 hover:text-white rounded-fancy ml-2 border-[1px] border-white"
              >
                <BarChartHorizontal strokeWidth={3} size={16} />
                <span className="ml-2">Check Arrears</span>
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="flex flex-row items-center text-xs py-3 px-4 font-normal w-full whitespace-nowrap bg-ndcred text-white border-[1px] border-ndcgreen hover:border-white  hover:bg-ndcgreen hover:text-white rounded-fancy ml-2"
              >
                <LogIn size={16} />
                <span className="ml-2">Register</span>
              </Link>
            </li>
            <li>
              <Link
                to="/agent"
                className="text-xs py-3 px-4 font-normal flex items-center w-full whitespace-nowrap bg-black text-white border-[1px] border-ndcgreen hover:border-white  hover:bg-ndcgreen hover:text-white rounded-fancy ml-2"
              >
                <LogIn size={16} />
                <span className="ml-2">Agent</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin"
                className="text-xs py-3 px-4 font-normal flex items-center w-full whitespace-nowrap bg-black text-white border-[1px] border-ndcgreen hover:border-white  hover:bg-ndcgreen hover:text-white rounded-fancy ml-2"
              >
                <LogIn size={16} />
                <span className="ml-2">Admin</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex xl:hidden">
          <button className="text-white" onClick={() => setOpenMobileNav(!openMobileNav)}>
            <Menu />
          </button>
        </div>
        {openMobileNav && <MobileNav isOpen={openMobileNav} setClose={setOpenMobileNav} />}
      </div>
    </nav>
  )
}