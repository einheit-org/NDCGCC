import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function GetCardsSection() {
  return (
    <section className="py-10">
      <div className="container mx-auto flex flex-wrap pt-4 pb-12">
        <h1 className="w-full text-3xl font-bold leading-tight text-center text-white uppercase">Good Governance Cards</h1>
        <div className="w-full mb-8">
          <div className="h-1 mx-auto gradient w-56 opacity-60 my-0 py-0 rounded-t"></div>
        </div>
        <div className="w-full  md:w-1/4 p-3 flex flex-col flex-grow flex-shrink text-white">
          <div className="flex-1  rounded-t rounded-b-none overflow-hidden shadow-xl pb-5 bg-white">
            <div className="flex flex-wrap no-underline hover:no-underline">
              <div className="bg-ndcgreen  w-full p-3 bg-[url('/standard_card.jpeg')]  bg-cover bg-center shadow" >
                <div className="flex justify-between"><div>
                  <h2 className="uppercase font-extrabold leading-4  italic text-center text-white">standard</h2>
                  <h3 className="uppercase  font-medium leading-4 text-xs mt-0.5 text-center text-white">Donor</h3>
                </div>
                  <img alt="logo" width="28" height="25" src="/ndc_card_logo.png" />
                </div>
                <div className="mt-2 ml-3">
                  <div className="w-8  rounded-sm hidden">
                    <svg viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg" height="256" width="256">
                    </svg>
                  </div>
                  <div className="mt-3 mb-1">
                    <h3 className="uppercase text-[1.2rem] font-bold -ml-1 tracking-wide leading-8">NDC 000 000 0000 X</h3>
                    <div className="flex items-center flex-row w-full justify-start -ml-1">
                      <p className="text-[8px] font-light  uppercase mr-0.5">issue date</p>
                      <ChevronRight size={16} strokeWidth={1} className="text-sm mr-1" />
                      <h3 className="uppercase text-[10px] font-bold  tracking-wide ml-0.5 text-sm">05/23</h3>
                    </div>
                    <div className="h-[28px]">
                      <h2 className="uppercase text-xs -ml-1 font-extrabold tracking-widest ">Full Name Here</h2>
                    </div>
                  </div>
                  <h1 className="uppercase font-extrabold text-lg text-right font-sans  mr-1 text-black">NDC</h1>
                </div>
              </div>
              <div className="w-full px-6  mt-3 text-black">
                <h1 className="font-bold text-lg  uppercase mt-3 ">Standard Card</h1>
                <p className="text-xs mb-5 leading-tight ">
                  The standard card cost of purchase is 500Ghc and monthly contributions is 50Ghc.
                  <br />
                  Donors can periodically check their contribution status online
                </p>
                <Link to="/register">
                  <button className="border-2 border-black hover:bg-ndcred/80 hover:text-white hover:border-transparent  px-5 py-3 font-medium flex items-center rounded-fancy text-xs capitalize mx-auto">
                    Register a standard Card
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full  md:w-1/4 p-3 flex flex-col flex-grow flex-shrink text-white">
          <div className="flex-1  rounded-t rounded-b-none overflow-hidden shadow-xl pb-5 bg-white">
            <div className="flex flex-wrap no-underline hover:no-underline">
              <div className="bg-ndcgreen  w-full p-3 bg-[url('/loyalty_card.jpeg')]  bg-cover bg-center shadow" >
                <div className="flex justify-between"><div>
                  <h2 className="uppercase font-extrabold leading-4  italic text-center text-white">loyalty</h2>
                  <h3 className="uppercase  font-medium leading-4 text-xs mt-0.5 text-center text-white">Donor</h3>
                </div>
                  <img alt="logo" width="28" height="25" src="/ndc_card_logo.png" />
                </div>
                <div className="mt-2 ml-3">
                  <div className="w-8  rounded-sm hidden">
                    <svg viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg" height="256" width="256">
                    </svg>
                  </div>
                  <div className="mt-3 mb-1">
                    <h3 className="uppercase text-[1.2rem] font-bold -ml-1 tracking-wide leading-8">NDC 000 000 0000 X</h3>
                    <div className="flex items-center flex-row w-full justify-start -ml-1">
                      <p className="text-[8px] font-light  uppercase mr-0.5">issue date</p>
                      <ChevronRight size={16} strokeWidth={1} className="text-sm mr-1" />
                      <h3 className="uppercase text-[10px] font-bold  tracking-wide ml-0.5 text-sm">05/23</h3>
                    </div>
                    <div className="h-[28px]">
                      <h2 className="uppercase text-xs -ml-1 font-extrabold tracking-widest ">Full Name Here</h2>
                    </div>
                  </div>
                  <h1 className="uppercase font-extrabold text-lg text-right font-sans  mr-1 text-black">NDC</h1>
                </div>
              </div>
              <div className="w-full px-6  mt-3 text-black">
                <h1 className="font-bold text-lg  uppercase mt-3 ">Loyalty Card</h1>
                <p className="text-xs mb-5 leading-tight ">
                  The standard card cost of purchase is 500Ghc and monthly contributions is 50Ghc.
                  <br />
                  Donors can periodically check their contribution status online
                </p>
                <Link to="/register">
                  <button className="border-2 border-black hover:bg-ndcred/80 hover:text-white hover:border-transparent  px-5 py-3 font-medium flex items-center rounded-fancy text-xs capitalize mx-auto">
                    Register a loyalty Card
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full  md:w-1/4 p-3 flex flex-col flex-grow flex-shrink text-white">
          <div className="flex-1  rounded-t rounded-b-none overflow-hidden shadow-xl pb-5 bg-white">
            <div className="flex flex-wrap no-underline hover:no-underline">
              <div className="bg-ndcgreen  w-full p-3 bg-[url('/bronze_card.jpeg')]  bg-cover bg-center shadow" >
                <div className="flex justify-between"><div>
                  <h2 className="uppercase font-extrabold leading-4  italic text-center text-white">bronze</h2>
                  <h3 className="uppercase  font-medium leading-4 text-xs mt-0.5 text-center text-white">Donor</h3>
                </div>
                  <img alt="logo" width="28" height="25" src="/ndc_card_logo.png" />
                </div>
                <div className="mt-2 ml-3">
                  <div className="w-8  rounded-sm hidden">
                    <svg viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg" height="256" width="256">
                    </svg>
                  </div>
                  <div className="mt-3 mb-1">
                    <h3 className="uppercase text-[1.2rem] font-bold -ml-1 tracking-wide leading-8">NDC 000 000 0000 X</h3>
                    <div className="flex items-center flex-row w-full justify-start -ml-1">
                      <p className="text-[8px] font-light  uppercase mr-0.5">issue date</p>
                      <ChevronRight size={16} strokeWidth={1} className="text-sm mr-1" />
                      <h3 className="uppercase text-[10px] font-bold  tracking-wide ml-0.5 text-sm">05/23</h3>
                    </div>
                    <div className="h-[28px]">
                      <h2 className="uppercase text-xs -ml-1 font-extrabold tracking-widest ">Full Name Here</h2>
                    </div>
                  </div>
                  <h1 className="uppercase font-extrabold text-lg text-right font-sans  mr-1 text-black">NDC</h1>
                </div>
              </div>
              <div className="w-full px-6  mt-3 text-black">
                <h1 className="font-bold text-lg  uppercase mt-3 ">Bronze Card</h1>
                <p className="text-xs mb-5 leading-tight ">
                  The standard card cost of purchase is 500Ghc and monthly contributions is 50Ghc.
                  <br />
                  Donors can periodically check their contribution status online
                </p>
                <Link to="/register">
                  <button className="border-2 border-black hover:bg-ndcred/80 hover:text-white hover:border-transparent  px-5 py-3 font-medium flex items-center rounded-fancy text-xs capitalize mx-auto">
                    Register a bronze Card
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full  md:w-1/4 p-3 flex flex-col flex-grow flex-shrink text-white">
          <div className="flex-1  rounded-t rounded-b-none overflow-hidden shadow-xl pb-5 bg-white">
            <div className="flex flex-wrap no-underline hover:no-underline">
              <div className="bg-ndcgreen  w-full p-3 bg-[url('/silver_card.jpeg')]  bg-cover bg-center shadow" >
                <div className="flex justify-between"><div>
                  <h2 className="uppercase font-extrabold leading-4  italic text-center text-white">silver</h2>
                  <h3 className="uppercase  font-medium leading-4 text-xs mt-0.5 text-center text-white">Donor</h3>
                </div>
                  <img alt="logo" width="28" height="25" src="/ndc_card_logo.png" />
                </div>
                <div className="mt-2 ml-3">
                  <div className="w-8  rounded-sm hidden">
                    <svg viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg" height="256" width="256">
                    </svg>
                  </div>
                  <div className="mt-3 mb-1">
                    <h3 className="uppercase text-[1.2rem] font-bold -ml-1 tracking-wide leading-8">NDC 000 000 0000 X</h3>
                    <div className="flex items-center flex-row w-full justify-start -ml-1">
                      <p className="text-[8px] font-light  uppercase mr-0.5">issue date</p>
                      <ChevronRight size={16} strokeWidth={1} className="text-sm mr-1" />
                      <h3 className="uppercase text-[10px] font-bold  tracking-wide ml-0.5 text-sm">05/23</h3>
                    </div>
                    <div className="h-[28px]">
                      <h2 className="uppercase text-xs -ml-1 font-extrabold tracking-widest ">Full Name Here</h2>
                    </div>
                  </div>
                  <h1 className="uppercase font-extrabold text-lg text-right font-sans  mr-1 text-black">NDC</h1>
                </div>
              </div>
              <div className="w-full px-6  mt-3 text-black">
                <h1 className="font-bold text-lg  uppercase mt-3 ">Silver Card</h1>
                <p className="text-xs mb-5 leading-tight ">
                  The standard card cost of purchase is 500Ghc and monthly contributions is 50Ghc.
                  <br />
                  Donors can periodically check their contribution status online
                </p>
                <Link to="/register">
                  <button className="border-2 border-black hover:bg-ndcred/80 hover:text-white hover:border-transparent  px-5 py-3 font-medium flex items-center rounded-fancy text-xs capitalize mx-auto">
                    Register a silver Card
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full  md:w-1/4 p-3 flex flex-col flex-grow flex-shrink text-white">
          <div className="flex-1  rounded-t rounded-b-none overflow-hidden shadow-xl pb-5 bg-white">
            <div className="flex flex-wrap no-underline hover:no-underline">
              <div className="bg-ndcgreen  w-full p-3 bg-[url('/gold_card.jpeg')]  bg-cover bg-center shadow" >
                <div className="flex justify-between"><div>
                  <h2 className="uppercase font-extrabold leading-4  italic text-center text-white">gold</h2>
                  <h3 className="uppercase  font-medium leading-4 text-xs mt-0.5 text-center text-white">Donor</h3>
                </div>
                  <img alt="logo" width="28" height="25" src="/ndc_card_logo.png" />
                </div>
                <div className="mt-2 ml-3">
                  <div className="w-8  rounded-sm hidden">
                    <svg viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg" height="256" width="256">
                    </svg>
                  </div>
                  <div className="mt-3 mb-1">
                    <h3 className="uppercase text-[1.2rem] font-bold -ml-1 tracking-wide leading-8">NDC 000 000 0000 X</h3>
                    <div className="flex items-center flex-row w-full justify-start -ml-1">
                      <p className="text-[8px] font-light  uppercase mr-0.5">issue date</p>
                      <ChevronRight size={16} strokeWidth={1} className="text-sm mr-1" />
                      <h3 className="uppercase text-[10px] font-bold  tracking-wide ml-0.5 text-sm">05/23</h3>
                    </div>
                    <div className="h-[28px]">
                      <h2 className="uppercase text-xs -ml-1 font-extrabold tracking-widest ">Full Name Here</h2>
                    </div>
                  </div>
                  <h1 className="uppercase font-extrabold text-lg text-right font-sans  mr-1 text-black">NDC</h1>
                </div>
              </div>
              <div className="w-full px-6  mt-3 text-black">
                <h1 className="font-bold text-lg  uppercase mt-3 ">Gold Card</h1>
                <p className="text-xs mb-5 leading-tight ">
                  The standard card cost of purchase is 500Ghc and monthly contributions is 50Ghc.
                  <br />
                  Donors can periodically check their contribution status online
                </p>
                <Link to="/register">
                  <button className="border-2 border-black hover:bg-ndcred/80 hover:text-white hover:border-transparent  px-5 py-3 font-medium flex items-center rounded-fancy text-xs capitalize mx-auto">
                    Register a gold Card
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full  md:w-1/4 p-3 flex flex-col flex-grow flex-shrink text-white">
          <div className="flex-1  rounded-t rounded-b-none overflow-hidden shadow-xl pb-5 bg-white">
            <div className="flex flex-wrap no-underline hover:no-underline">
              <div className="bg-ndcgreen  w-full p-3 bg-[url('/platinum_card.jpeg')]  bg-cover bg-center shadow" >
                <div className="flex justify-between"><div>
                  <h2 className="uppercase font-extrabold leading-4  italic text-center text-white">platinum</h2>
                  <h3 className="uppercase  font-medium leading-4 text-xs mt-0.5 text-center text-white">Donor</h3>
                </div>
                  <img alt="logo" width="28" height="25" src="/ndc_card_logo.png" />
                </div>
                <div className="mt-2 ml-3">
                  <div className="w-8  rounded-sm hidden">
                    <svg viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg" height="256" width="256">
                    </svg>
                  </div>
                  <div className="mt-3 mb-1">
                    <h3 className="uppercase text-[1.2rem] font-bold -ml-1 tracking-wide leading-8">NDC 000 000 0000 X</h3>
                    <div className="flex items-center flex-row w-full justify-start -ml-1">
                      <p className="text-[8px] font-light  uppercase mr-0.5">issue date</p>
                      <ChevronRight size={16} strokeWidth={1} className="text-sm mr-1" />
                      <h3 className="uppercase text-[10px] font-bold  tracking-wide ml-0.5 text-sm">05/23</h3>
                    </div>
                    <div className="h-[28px]">
                      <h2 className="uppercase text-xs -ml-1 font-extrabold tracking-widest ">Full Name Here</h2>
                    </div>
                  </div>
                  <h1 className="uppercase font-extrabold text-lg text-right font-sans  mr-1 text-black">NDC</h1>
                </div>
              </div>
              <div className="w-full px-6  mt-3 text-black">
                <h1 className="font-bold text-lg  uppercase mt-3 ">Platinum Card</h1>
                <p className="text-xs mb-5 leading-tight ">
                  The standard card cost of purchase is 500Ghc and monthly contributions is 50Ghc.
                  <br />
                  Donors can periodically check their contribution status online
                </p>
                <Link to="/register">
                  <button className="border-2 border-black hover:bg-ndcred/80 hover:text-white hover:border-transparent  px-5 py-3 font-medium flex items-center rounded-fancy text-xs capitalize mx-auto">
                    Register a platinum Card
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full  md:w-1/4 p-3 flex flex-col flex-grow flex-shrink text-white">
          <div className="flex-1  rounded-t rounded-b-none overflow-hidden shadow-xl pb-5 bg-white">
            <div className="flex flex-wrap no-underline hover:no-underline">
              <div className="bg-ndcgreen  w-full p-3 bg-[url('/prestige_card.jpeg')]  bg-cover bg-center shadow" >
                <div className="flex justify-between"><div>
                  <h2 className="uppercase font-extrabold leading-4  italic text-center text-white">prestige</h2>
                  <h3 className="uppercase  font-medium leading-4 text-xs mt-0.5 text-center text-white">Donor</h3>
                </div>
                  <img alt="logo" width="28" height="25" src="/ndc_card_logo.png" />
                </div>
                <div className="mt-2 ml-3">
                  <div className="w-8  rounded-sm hidden">
                    <svg viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg" height="256" width="256">
                    </svg>
                  </div>
                  <div className="mt-3 mb-1">
                    <h3 className="uppercase text-[1.2rem] font-bold -ml-1 tracking-wide leading-8">NDC 000 000 0000 X</h3>
                    <div className="flex items-center flex-row w-full justify-start -ml-1">
                      <p className="text-[8px] font-light  uppercase mr-0.5">issue date</p>
                      <ChevronRight size={16} strokeWidth={1} className="text-sm mr-1" />
                      <h3 className="uppercase text-[10px] font-bold  tracking-wide ml-0.5 text-sm">05/23</h3>
                    </div>
                    <div className="h-[28px]">
                      <h2 className="uppercase text-xs -ml-1 font-extrabold tracking-widest ">Full Name Here</h2>
                    </div>
                  </div>
                  <h1 className="uppercase font-extrabold text-lg text-right font-sans  mr-1 text-black">NDC</h1>
                </div>
              </div>
              <div className="w-full px-6  mt-3 text-black">
                <h1 className="font-bold text-lg  uppercase mt-3 ">Prestige Card</h1>
                <p className="text-xs mb-5 leading-tight ">
                  The standard card cost of purchase is 500Ghc and monthly contributions is 50Ghc.
                  <br />
                  Donors can periodically check their contribution status online
                </p>
                <Link to="/register">
                  <button className="border-2 border-black hover:bg-ndcred/80 hover:text-white hover:border-transparent  px-5 py-3 font-medium flex items-center rounded-fancy text-xs capitalize mx-auto">
                    Register a prestige Card
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full  md:w-1/4 p-3 flex flex-col flex-grow flex-shrink text-white">
          <div className="flex-1  rounded-t rounded-b-none overflow-hidden shadow-xl pb-5 bg-white">
            <div className="flex flex-wrap no-underline hover:no-underline">
              <div className="bg-ndcgreen  w-full p-3 bg-[url('/prestige_plus_card.jpeg')]  bg-cover bg-center shadow" >
                <div className="flex justify-between"><div>
                  <h2 className="uppercase font-extrabold leading-4  italic text-center text-white">prestige plus</h2>
                  <h3 className="uppercase  font-medium leading-4 text-xs mt-0.5 text-center text-white">Donor</h3>
                </div>
                  <img alt="logo" width="28" height="25" src="/ndc_card_logo.png" />
                </div>
                <div className="mt-2 ml-3">
                  <div className="w-8  rounded-sm hidden">
                    <svg viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg" height="256" width="256">
                    </svg>
                  </div>
                  <div className="mt-3 mb-1">
                    <h3 className="uppercase text-[1.2rem] font-bold -ml-1 tracking-wide leading-8">NDC 000 000 0000 X</h3>
                    <div className="flex items-center flex-row w-full justify-start -ml-1">
                      <p className="text-[8px] font-light  uppercase mr-0.5">issue date</p>
                      <ChevronRight size={16} strokeWidth={1} className="text-sm mr-1" />
                      <h3 className="uppercase text-[10px] font-bold  tracking-wide ml-0.5 text-sm">05/23</h3>
                    </div>
                    <div className="h-[28px]">
                      <h2 className="uppercase text-xs -ml-1 font-extrabold tracking-widest ">Full Name Here</h2>
                    </div>
                  </div>
                  <h1 className="uppercase font-extrabold text-lg text-right font-sans  mr-1 text-black">NDC</h1>
                </div>
              </div>
              <div className="w-full px-6  mt-3 text-black">
                <h1 className="font-bold text-lg  uppercase mt-3 ">Prestige Plus Card</h1>
                <p className="text-xs mb-5 leading-tight ">
                  The standard card cost of purchase is 500Ghc and monthly contributions is 50Ghc.
                  <br />
                  Donors can periodically check their contribution status online
                </p>
                <Link to="/register">
                  <button className="border-2 border-black hover:bg-ndcred/80 hover:text-white hover:border-transparent  px-5 py-3 font-medium flex items-center rounded-fancy text-xs capitalize mx-auto">
                    Register a prestige plus Card
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}