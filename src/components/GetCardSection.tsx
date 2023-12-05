import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GetCardsSection() {
  return (
    <section className="py-10">
      <div className="container mx-auto flex flex-wrap pb-12 pt-4">
        <h1 className="w-full text-center text-3xl font-bold uppercase leading-tight text-white">
          Good Governance Cards
        </h1>
        <div className="mb-8 w-full">
          <div className="gradient mx-auto my-0 h-1 w-56 rounded-t py-0 opacity-60"></div>
        </div>
        <div className="flex  w-full flex-shrink flex-grow flex-col p-3 text-white md:w-1/4">
          <div className="flex-1  overflow-hidden rounded-b-none rounded-t bg-white pb-5 shadow-xl">
            <div className="flex flex-wrap no-underline hover:no-underline">
              <div className="w-full  bg-ndcgreen bg-[url('/standard_card.jpeg')] bg-cover  bg-center p-3 shadow">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-center font-extrabold uppercase  italic leading-4 text-white">
                      standard
                    </h2>
                    <h3 className="mt-0.5  text-center text-xs font-medium uppercase leading-4 text-white">
                      Donor
                    </h3>
                  </div>
                  <img
                    alt="logo"
                    width="28"
                    height="25"
                    src="/ndc_card_logo.png"
                  />
                </div>
                <div className="ml-3 mt-2">
                  <div className="hidden  w-8 rounded-sm">
                    <svg
                      viewBox="0 0 25 25"
                      xmlns="http://www.w3.org/2000/svg"
                      height="256"
                      width="256"
                    ></svg>
                  </div>
                  <div className="mb-1 mt-3">
                    <h3 className="-ml-1 text-[1.2rem] font-bold uppercase leading-8 tracking-wide">
                      NDC 000 000 0000 X
                    </h3>
                    <div className="-ml-1 flex w-full flex-row items-center justify-start">
                      <p className="mr-0.5 text-[8px]  font-light uppercase">
                        issue date
                      </p>
                      <ChevronRight
                        size={16}
                        strokeWidth={1}
                        className="mr-1 text-sm"
                      />
                      <h3 className="ml-0.5 text-[10px] text-sm  font-bold uppercase tracking-wide">
                        05/23
                      </h3>
                    </div>
                    <div className="h-[28px]">
                      <h2 className="-ml-1 text-xs font-extrabold uppercase tracking-widest ">
                        Full Name Here
                      </h2>
                    </div>
                  </div>
                  <h1 className="mr-1 text-right font-sans text-lg font-extrabold  uppercase text-black">
                    NDC
                  </h1>
                </div>
              </div>
              <div className="mt-3 w-full  px-6 text-black">
                <h1 className="mt-3 text-lg  font-bold uppercase ">
                  Standard Card
                </h1>
                <p className="mb-5 text-xs leading-tight ">
                  The standard card cost of purchase is 500Ghc and monthly
                  contributions is 50Ghc.
                  <br />
                  Donors can periodically check their contribution status online
                </p>
                <Link to="/register">
                  <button className="mx-auto flex items-center rounded-fancy border-2  border-black px-5 py-3 text-xs font-medium capitalize hover:border-transparent hover:bg-ndcred/80 hover:text-white">
                    Register a standard Card
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="flex  w-full flex-shrink flex-grow flex-col p-3 text-white md:w-1/4">
          <div className="flex-1  overflow-hidden rounded-b-none rounded-t bg-white pb-5 shadow-xl">
            <div className="flex flex-wrap no-underline hover:no-underline">
              <div className="w-full  bg-ndcgreen bg-[url('/loyalty_card.jpeg')] bg-cover  bg-center p-3 shadow">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-center font-extrabold uppercase  italic leading-4 text-white">
                      loyalty
                    </h2>
                    <h3 className="mt-0.5  text-center text-xs font-medium uppercase leading-4 text-white">
                      Donor
                    </h3>
                  </div>
                  <img
                    alt="logo"
                    width="28"
                    height="25"
                    src="/ndc_card_logo.png"
                  />
                </div>
                <div className="ml-3 mt-2">
                  <div className="hidden  w-8 rounded-sm">
                    <svg
                      viewBox="0 0 25 25"
                      xmlns="http://www.w3.org/2000/svg"
                      height="256"
                      width="256"
                    ></svg>
                  </div>
                  <div className="mb-1 mt-3">
                    <h3 className="-ml-1 text-[1.2rem] font-bold uppercase leading-8 tracking-wide">
                      NDC 000 000 0000 X
                    </h3>
                    <div className="-ml-1 flex w-full flex-row items-center justify-start">
                      <p className="mr-0.5 text-[8px]  font-light uppercase">
                        issue date
                      </p>
                      <ChevronRight
                        size={16}
                        strokeWidth={1}
                        className="mr-1 text-sm"
                      />
                      <h3 className="ml-0.5 text-[10px] text-sm  font-bold uppercase tracking-wide">
                        05/23
                      </h3>
                    </div>
                    <div className="h-[28px]">
                      <h2 className="-ml-1 text-xs font-extrabold uppercase tracking-widest ">
                        Full Name Here
                      </h2>
                    </div>
                  </div>
                  <h1 className="mr-1 text-right font-sans text-lg font-extrabold  uppercase text-black">
                    NDC
                  </h1>
                </div>
              </div>
              <div className="mt-3 w-full  px-6 text-black">
                <h1 className="mt-3 text-lg  font-bold uppercase ">
                  Loyalty Card
                </h1>
                <p className="mb-5 text-xs leading-tight ">
                  The cost of attaining this card is Ghc250. And monthly
                  contributions is 25Ghc
                  <br />
                  Donors can periodically check their contribution status online
                </p>
                <Link to="/register">
                  <button className="mx-auto flex items-center rounded-fancy border-2  border-black px-5 py-3 text-xs font-medium capitalize hover:border-transparent hover:bg-ndcred/80 hover:text-white">
                    Register a loyalty Card
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="flex  w-full flex-shrink flex-grow flex-col p-3 text-white md:w-1/4">
          <div className="flex-1  overflow-hidden rounded-b-none rounded-t bg-white pb-5 shadow-xl">
            <div className="flex flex-wrap no-underline hover:no-underline">
              <div className="w-full  bg-ndcgreen bg-[url('/bronze_card.jpeg')] bg-cover  bg-center p-3 shadow">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-center font-extrabold uppercase  italic leading-4 text-white">
                      bronze
                    </h2>
                    <h3 className="mt-0.5  text-center text-xs font-medium uppercase leading-4 text-white">
                      Donor
                    </h3>
                  </div>
                  <img
                    alt="logo"
                    width="28"
                    height="25"
                    src="/ndc_card_logo.png"
                  />
                </div>
                <div className="ml-3 mt-2">
                  <div className="hidden  w-8 rounded-sm">
                    <svg
                      viewBox="0 0 25 25"
                      xmlns="http://www.w3.org/2000/svg"
                      height="256"
                      width="256"
                    ></svg>
                  </div>
                  <div className="mb-1 mt-3">
                    <h3 className="-ml-1 text-[1.2rem] font-bold uppercase leading-8 tracking-wide">
                      NDC 000 000 0000 X
                    </h3>
                    <div className="-ml-1 flex w-full flex-row items-center justify-start">
                      <p className="mr-0.5 text-[8px]  font-light uppercase">
                        issue date
                      </p>
                      <ChevronRight
                        size={16}
                        strokeWidth={1}
                        className="mr-1 text-sm"
                      />
                      <h3 className="ml-0.5 text-[10px] text-sm  font-bold uppercase tracking-wide">
                        05/23
                      </h3>
                    </div>
                    <div className="h-[28px]">
                      <h2 className="-ml-1 text-xs font-extrabold uppercase tracking-widest ">
                        Full Name Here
                      </h2>
                    </div>
                  </div>
                  <h1 className="mr-1 text-right font-sans text-lg font-extrabold  uppercase text-black">
                    NDC
                  </h1>
                </div>
              </div>
              <div className="mt-3 w-full  px-6 text-black">
                <h1 className="mt-3 text-lg  font-bold uppercase ">
                  Bronze Card
                </h1>
                <p className="mb-5 text-xs leading-tight ">
                  The cost of purchase for the bronze is 1,000Ghc and monthly
                  contribution is 100Ghc.
                  <br />
                  Donors can periodically check their contribution status online
                </p>
                <Link to="/register">
                  <button className="mx-auto flex items-center rounded-fancy border-2  border-black px-5 py-3 text-xs font-medium capitalize hover:border-transparent hover:bg-ndcred/80 hover:text-white">
                    Register a bronze Card
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="flex  w-full flex-shrink flex-grow flex-col p-3 text-white md:w-1/4">
          <div className="flex-1  overflow-hidden rounded-b-none rounded-t bg-white pb-5 shadow-xl">
            <div className="flex flex-wrap no-underline hover:no-underline">
              <div className="w-full  bg-ndcgreen bg-[url('/silver_card.jpeg')] bg-cover  bg-center p-3 shadow">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-center font-extrabold uppercase  italic leading-4 text-white">
                      silver
                    </h2>
                    <h3 className="mt-0.5  text-center text-xs font-medium uppercase leading-4 text-white">
                      Donor
                    </h3>
                  </div>
                  <img
                    alt="logo"
                    width="28"
                    height="25"
                    src="/ndc_card_logo.png"
                  />
                </div>
                <div className="ml-3 mt-2">
                  <div className="hidden  w-8 rounded-sm">
                    <svg
                      viewBox="0 0 25 25"
                      xmlns="http://www.w3.org/2000/svg"
                      height="256"
                      width="256"
                    ></svg>
                  </div>
                  <div className="mb-1 mt-3">
                    <h3 className="-ml-1 text-[1.2rem] font-bold uppercase leading-8 tracking-wide">
                      NDC 000 000 0000 X
                    </h3>
                    <div className="-ml-1 flex w-full flex-row items-center justify-start">
                      <p className="mr-0.5 text-[8px]  font-light uppercase">
                        issue date
                      </p>
                      <ChevronRight
                        size={16}
                        strokeWidth={1}
                        className="mr-1 text-sm"
                      />
                      <h3 className="ml-0.5 text-[10px] text-sm  font-bold uppercase tracking-wide">
                        05/23
                      </h3>
                    </div>
                    <div className="h-[28px]">
                      <h2 className="-ml-1 text-xs font-extrabold uppercase tracking-widest ">
                        Full Name Here
                      </h2>
                    </div>
                  </div>
                  <h1 className="mr-1 text-right font-sans text-lg font-extrabold  uppercase text-black">
                    NDC
                  </h1>
                </div>
              </div>
              <div className="mt-3 w-full  px-6 text-black">
                <h1 className="mt-3 text-lg  font-bold uppercase ">
                  Silver Card
                </h1>
                <p className="mb-5 text-xs leading-tight ">
                  The silver card is cost of attainment os 2000Ghc and monthly
                  contributions is 200Ghc.
                  <br />
                  Donors can periodically check their contribution status online
                </p>
                <Link to="/register">
                  <button className="mx-auto flex items-center rounded-fancy border-2  border-black px-5 py-3 text-xs font-medium capitalize hover:border-transparent hover:bg-ndcred/80 hover:text-white">
                    Register a silver Card
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="flex  w-full flex-shrink flex-grow flex-col p-3 text-white md:w-1/4">
          <div className="flex-1  overflow-hidden rounded-b-none rounded-t bg-white pb-5 shadow-xl">
            <div className="flex flex-wrap no-underline hover:no-underline">
              <div className="w-full  bg-ndcgreen bg-[url('/gold_card.jpeg')] bg-cover  bg-center p-3 shadow">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-center font-extrabold uppercase  italic leading-4 text-white">
                      gold
                    </h2>
                    <h3 className="mt-0.5  text-center text-xs font-medium uppercase leading-4 text-white">
                      Donor
                    </h3>
                  </div>
                  <img
                    alt="logo"
                    width="28"
                    height="25"
                    src="/ndc_card_logo.png"
                  />
                </div>
                <div className="ml-3 mt-2">
                  <div className="hidden  w-8 rounded-sm">
                    <svg
                      viewBox="0 0 25 25"
                      xmlns="http://www.w3.org/2000/svg"
                      height="256"
                      width="256"
                    ></svg>
                  </div>
                  <div className="mb-1 mt-3">
                    <h3 className="-ml-1 text-[1.2rem] font-bold uppercase leading-8 tracking-wide">
                      NDC 000 000 0000 X
                    </h3>
                    <div className="-ml-1 flex w-full flex-row items-center justify-start">
                      <p className="mr-0.5 text-[8px]  font-light uppercase">
                        issue date
                      </p>
                      <ChevronRight
                        size={16}
                        strokeWidth={1}
                        className="mr-1 text-sm"
                      />
                      <h3 className="ml-0.5 text-[10px] text-sm  font-bold uppercase tracking-wide">
                        05/23
                      </h3>
                    </div>
                    <div className="h-[28px]">
                      <h2 className="-ml-1 text-xs font-extrabold uppercase tracking-widest ">
                        Full Name Here
                      </h2>
                    </div>
                  </div>
                  <h1 className="mr-1 text-right font-sans text-lg font-extrabold  uppercase text-black">
                    NDC
                  </h1>
                </div>
              </div>
              <div className="mt-3 w-full  px-6 text-black">
                <h1 className="mt-3 text-lg  font-bold uppercase ">
                  Gold Card
                </h1>
                <p className="mb-5 text-xs leading-tight ">
                  The Gold Donor card is the third largest And the cost of
                  attaining one is 5,000Ghc and monthly contributions is 500Ghc.
                  <br />
                  Donors can periodically check their contribution status online
                </p>
                <Link to="/register">
                  <button className="mx-auto flex items-center rounded-fancy border-2  border-black px-5 py-3 text-xs font-medium capitalize hover:border-transparent hover:bg-ndcred/80 hover:text-white">
                    Register a gold Card
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="flex  w-full flex-shrink flex-grow flex-col p-3 text-white md:w-1/4">
          <div className="flex-1  overflow-hidden rounded-b-none rounded-t bg-white pb-5 shadow-xl">
            <div className="flex flex-wrap no-underline hover:no-underline">
              <div className="w-full  bg-ndcgreen bg-[url('/platinum_card.jpeg')] bg-cover  bg-center p-3 shadow">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-center font-extrabold uppercase  italic leading-4 text-white">
                      platinum
                    </h2>
                    <h3 className="mt-0.5  text-center text-xs font-medium uppercase leading-4 text-white">
                      Donor
                    </h3>
                  </div>
                  <img
                    alt="logo"
                    width="28"
                    height="25"
                    src="/ndc_card_logo.png"
                  />
                </div>
                <div className="ml-3 mt-2">
                  <div className="hidden  w-8 rounded-sm">
                    <svg
                      viewBox="0 0 25 25"
                      xmlns="http://www.w3.org/2000/svg"
                      height="256"
                      width="256"
                    ></svg>
                  </div>
                  <div className="mb-1 mt-3">
                    <h3 className="-ml-1 text-[1.2rem] font-bold uppercase leading-8 tracking-wide">
                      NDC 000 000 0000 X
                    </h3>
                    <div className="-ml-1 flex w-full flex-row items-center justify-start">
                      <p className="mr-0.5 text-[8px]  font-light uppercase">
                        issue date
                      </p>
                      <ChevronRight
                        size={16}
                        strokeWidth={1}
                        className="mr-1 text-sm"
                      />
                      <h3 className="ml-0.5 text-[10px] text-sm  font-bold uppercase tracking-wide">
                        05/23
                      </h3>
                    </div>
                    <div className="h-[28px]">
                      <h2 className="-ml-1 text-xs font-extrabold uppercase tracking-widest ">
                        Full Name Here
                      </h2>
                    </div>
                  </div>
                  <h1 className="mr-1 text-right font-sans text-lg font-extrabold  uppercase text-black">
                    NDC
                  </h1>
                </div>
              </div>
              <div className="mt-3 w-full  px-6 text-black">
                <h1 className="mt-3 text-lg  font-bold uppercase ">
                  Platinum Card
                </h1>
                <p className="mb-5 text-xs leading-tight ">
                  This is the second highest donor card, And cost of purchase is
                  10,000.and monthly contributions is 1,000Ghc.
                  <br />
                  Donors can periodically check their contribution status online
                </p>
                <Link to="/register">
                  <button className="mx-auto flex items-center rounded-fancy border-2  border-black px-5 py-3 text-xs font-medium capitalize hover:border-transparent hover:bg-ndcred/80 hover:text-white">
                    Register a platinum Card
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="flex  w-full flex-shrink flex-grow flex-col p-3 text-white md:w-1/4">
          <div className="flex-1  overflow-hidden rounded-b-none rounded-t bg-white pb-5 shadow-xl">
            <div className="flex flex-wrap no-underline hover:no-underline">
              <div className="w-full  bg-ndcgreen bg-[url('/prestige_card.jpeg')] bg-cover  bg-center p-3 shadow">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-center font-extrabold uppercase  italic leading-4 text-white">
                      prestige
                    </h2>
                    <h3 className="mt-0.5  text-center text-xs font-medium uppercase leading-4 text-white">
                      Donor
                    </h3>
                  </div>
                  <img
                    alt="logo"
                    width="28"
                    height="25"
                    src="/ndc_card_logo.png"
                  />
                </div>
                <div className="ml-3 mt-2">
                  <div className="hidden  w-8 rounded-sm">
                    <svg
                      viewBox="0 0 25 25"
                      xmlns="http://www.w3.org/2000/svg"
                      height="256"
                      width="256"
                    ></svg>
                  </div>
                  <div className="mb-1 mt-3">
                    <h3 className="-ml-1 text-[1.2rem] font-bold uppercase leading-8 tracking-wide">
                      NDC 000 000 0000 X
                    </h3>
                    <div className="-ml-1 flex w-full flex-row items-center justify-start">
                      <p className="mr-0.5 text-[8px]  font-light uppercase">
                        issue date
                      </p>
                      <ChevronRight
                        size={16}
                        strokeWidth={1}
                        className="mr-1 text-sm"
                      />
                      <h3 className="ml-0.5 text-[10px] text-sm  font-bold uppercase tracking-wide">
                        05/23
                      </h3>
                    </div>
                    <div className="h-[28px]">
                      <h2 className="-ml-1 text-xs font-extrabold uppercase tracking-widest ">
                        Full Name Here
                      </h2>
                    </div>
                  </div>
                  <h1 className="mr-1 text-right font-sans text-lg font-extrabold  uppercase text-black">
                    NDC
                  </h1>
                </div>
              </div>
              <div className="mt-3 w-full  px-6 text-black">
                <h1 className="mt-3 text-lg  font-bold uppercase ">
                  Prestige Card
                </h1>
                <p className="mb-5 text-xs leading-tight ">
                  This is the highest donor card available for the NDC, Donor
                  card purchase is 20,000Ghc and 2000Ghc is set the monthly
                  contribution .
                  <br />
                  Donors can periodically check their contribution status online
                </p>
                <Link to="/register">
                  <button className="mx-auto flex items-center rounded-fancy border-2  border-black px-5 py-3 text-xs font-medium capitalize hover:border-transparent hover:bg-ndcred/80 hover:text-white">
                    Register a prestige Card
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="flex  w-full flex-shrink flex-grow flex-col p-3 text-white md:w-1/4">
          <div className="flex-1  overflow-hidden rounded-b-none rounded-t bg-white pb-5 shadow-xl">
            <div className="flex flex-wrap no-underline hover:no-underline">
              <div className="w-full  bg-ndcgreen bg-[url('/prestige_plus_card.jpeg')] bg-cover  bg-center p-3 shadow">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-center font-extrabold uppercase  italic leading-4 text-white">
                      prestige plus
                    </h2>
                    <h3 className="mt-0.5  text-center text-xs font-medium uppercase leading-4 text-white">
                      Donor
                    </h3>
                  </div>
                  <img
                    alt="logo"
                    width="28"
                    height="25"
                    src="/ndc_card_logo.png"
                  />
                </div>
                <div className="ml-3 mt-2">
                  <div className="hidden  w-8 rounded-sm">
                    <svg
                      viewBox="0 0 25 25"
                      xmlns="http://www.w3.org/2000/svg"
                      height="256"
                      width="256"
                    ></svg>
                  </div>
                  <div className="mb-1 mt-3">
                    <h3 className="-ml-1 text-[1.2rem] font-bold uppercase leading-8 tracking-wide">
                      NDC 000 000 0000 X
                    </h3>
                    <div className="-ml-1 flex w-full flex-row items-center justify-start">
                      <p className="mr-0.5 text-[8px]  font-light uppercase">
                        issue date
                      </p>
                      <ChevronRight
                        size={16}
                        strokeWidth={1}
                        className="mr-1 text-sm"
                      />
                      <h3 className="ml-0.5 text-[10px] text-sm  font-bold uppercase tracking-wide">
                        05/23
                      </h3>
                    </div>
                    <div className="h-[28px]">
                      <h2 className="-ml-1 text-xs font-extrabold uppercase tracking-widest ">
                        Full Name Here
                      </h2>
                    </div>
                  </div>
                  <h1 className="mr-1 text-right font-sans text-lg font-extrabold  uppercase text-black">
                    NDC
                  </h1>
                </div>
              </div>
              <div className="mt-3 w-full  px-6 text-black">
                <h1 className="mt-3 text-lg  font-bold uppercase ">
                  Prestige Plus Card
                </h1>
                <p className="mb-5 text-xs leading-tight ">
                  This is the highest donor card available for the NDC, Donor
                  card purchase is 50,000Ghc and 5000Ghc is set the monthly
                  contribution .
                  <br />
                  Donors can periodically check their contribution status online
                </p>
                <Link to="/register">
                  <button className="mx-auto flex items-center rounded-fancy border-2  border-black px-5 py-3 text-xs font-medium capitalize hover:border-transparent hover:bg-ndcred/80 hover:text-white">
                    Register a prestige plus Card
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
