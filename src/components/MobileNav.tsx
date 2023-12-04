import { Link } from "react-router-dom";

export default function MobileNav({ isOpen, setClose }: { isOpen: boolean, setClose: (val: boolean) => void }) {
  const hide = () => setClose(false)
  const show = () => setClose(true)
  return (
    <div
      className="absolute left-0 right-0 top-16 xl:flex flex-grow items-center bg-ndcgreen xl:bg-transparent p-2 xl:p-0 xl:bg-opacity-0 xl:shadow-none mt-2 xl:mt-0 overflow-y-scroll block z-[9999]"
      id=""
    >
      <div className="xl:hidden  mt-3 border-t">
        <Link
          onBlur={hide}
          onFocus={show}
          onClick={() => setClose(!isOpen)}
          className="text-xs py-3 px-4 font-normal block w-full whitespace-nowrap bg-white hover:bg-white hover:text-black mb-2 "
          to="/"
        >
          <i className="fa-solid fa-home  mr-2 "></i>Home
        </Link>
        <Link
          onBlur={hide}
          onFocus={show}
          onClick={() => setClose(!isOpen)}
          className="text-xs py-3 px-4 font-normal block w-full whitespace-nowrap bg-white hover:bg-white hover:text-black mb-2 "
          to="/#about"
        >
          <i className="fa-solid fa-info-circle mr-2 "></i>About
        </Link>
        <Link
          onBlur={hide}
          onFocus={show}
          onClick={() => setClose(!isOpen)}
          className="text-xs py-3 px-4 font-normal block w-full whitespace-nowrap bg-white hover:bg-white hover:text-black mb-2 "
          to="/#contact"
        >
          <i className="fa-solid fa-phone mr-2 "></i>Contact
        </Link>
        <Link
          onBlur={hide}
          onFocus={show}
          onClick={() => setClose(!isOpen)}
          className="text-xs py-3 px-4 font-normal block w-full whitespace-nowrap bg-white hover:bg-white hover:text-black mb-2 "
          to="/arrears"
        >
          <i className="fa-solid fa-chart-bar  mr-2 "></i>Check Arrears
        </Link>
        <Link
          onBlur={hide}
          onFocus={show}
          onClick={() => setClose(!isOpen)}
          className="text-xs py-3 px-4 font-normal block w-full whitespace-nowrap bg-white hover:bg-white hover:text-black mb-2 "
          to="/donorwall"
        >
          <i className="fa-solid fa-donate  mr-2 "></i>Donor Wall
        </Link>
        <Link
          onBlur={hide}
          onFocus={show}
          onClick={() => setClose(!isOpen)}
          className="text-xs py-3 px-4 font-normal block w-full whitespace-nowrap bg-white hover:bg-white hover:text-black  mb-2"
          to="/register"
        >
          <i className="fa-solid fa-right-to-bracket mr-2 "></i>Register
        </Link>
        <Link
          onBlur={hide}
          onFocus={show}
          onClick={() => setClose(!isOpen)}
          className="text-xs py-3 px-4 font-normal block w-full whitespace-nowrap bg-white hover:bg-white hover:text-black  mb-2"
          to="/agent"
        >
          <i className="fa-solid fa-right-to-bracket mr-2 "></i>Agent
        </Link>
        <Link
          onBlur={hide}
          onFocus={show}
          onClick={() => setClose(!isOpen)}
          className="text-xs py-3 px-4 font-bold block w-full whitespace-nowrap bg-white hover:bg-white hover:text-black  mb-2"
          to="/admin"
        >
          <i className="fa-solid fa-right-to-bracket mr-2 "></i>Admin
        </Link>
      </div>
    </div>
  );
}
