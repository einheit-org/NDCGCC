import { Link } from 'react-router-dom';

export default function MobileNav({
  isOpen,
  setClose,
}: {
  isOpen: boolean;
  setClose: (val: boolean) => void;
}) {
  const hide = () => setClose(false);
  const show = () => setClose(true);
  return (
    <div
      className="absolute left-0 right-0 top-16 z-[9999] mt-2 block flex-grow items-center overflow-y-scroll bg-ndcgreen p-2 xl:mt-0 xl:flex xl:bg-transparent xl:bg-opacity-0 xl:p-0 xl:shadow-none"
      id=""
    >
      <div className="mt-3  border-t xl:hidden">
        <Link
          onBlur={hide}
          onFocus={show}
          onClick={() => setClose(!isOpen)}
          className="mb-2 block w-full whitespace-nowrap bg-white px-4 py-3 text-xs font-normal hover:bg-white hover:text-black "
          to="/"
        >
          <i className="fa-solid fa-home  mr-2 "></i>Home
        </Link>
        <Link
          onBlur={hide}
          onFocus={show}
          onClick={() => setClose(!isOpen)}
          className="mb-2 block w-full whitespace-nowrap bg-white px-4 py-3 text-xs font-normal hover:bg-white hover:text-black "
          to="/#about"
        >
          <i className="fa-solid fa-info-circle mr-2 "></i>About
        </Link>
        <Link
          onBlur={hide}
          onFocus={show}
          onClick={() => setClose(!isOpen)}
          className="mb-2 block w-full whitespace-nowrap bg-white px-4 py-3 text-xs font-normal hover:bg-white hover:text-black "
          to="/#contact"
        >
          <i className="fa-solid fa-phone mr-2 "></i>Contact
        </Link>
        <Link
          onBlur={hide}
          onFocus={show}
          onClick={() => setClose(!isOpen)}
          className="mb-2 block w-full whitespace-nowrap bg-white px-4 py-3 text-xs font-normal hover:bg-white hover:text-black "
          to="/arrears"
        >
          <i className="fa-solid fa-chart-bar  mr-2 "></i>Check Arrears
        </Link>
        <Link
          onBlur={hide}
          onFocus={show}
          onClick={() => setClose(!isOpen)}
          className="mb-2 block w-full whitespace-nowrap bg-white px-4 py-3 text-xs font-normal hover:bg-white hover:text-black "
          to="/donorwall"
        >
          <i className="fa-solid fa-donate  mr-2 "></i>Donor Wall
        </Link>
        <Link
          onBlur={hide}
          onFocus={show}
          onClick={() => setClose(!isOpen)}
          className="mb-2 block w-full whitespace-nowrap bg-white px-4 py-3 text-xs font-normal hover:bg-white  hover:text-black"
          to="/register"
        >
          <i className="fa-solid fa-right-to-bracket mr-2 "></i>Register
        </Link>
        <Link
          onBlur={hide}
          onFocus={show}
          onClick={() => setClose(!isOpen)}
          className="mb-2 block w-full whitespace-nowrap bg-white px-4 py-3 text-xs font-normal hover:bg-white  hover:text-black"
          to="/agent"
        >
          <i className="fa-solid fa-right-to-bracket mr-2 "></i>Agent
        </Link>
        <Link
          onBlur={hide}
          onFocus={show}
          onClick={() => setClose(!isOpen)}
          className="mb-2 block w-full whitespace-nowrap bg-white px-4 py-3 text-xs font-bold hover:bg-white  hover:text-black"
          to="/admin"
        >
          <i className="fa-solid fa-right-to-bracket mr-2 "></i>Admin
        </Link>
      </div>
    </div>
  );
}
