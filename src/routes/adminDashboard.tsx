// import { useToast } from "@/components/ui/use-toast";
import { donorsListDummy, formatId, pmtCategoryMap } from "@/utils/constants";
// import { getAllDonors } from "@/utils/data";
// import { ChevronRight, RotateCw } from "lucide-react";
// import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { getAgentData } from '../utils/data';

export default function AdminDash() {
  // const { toast } = useToast();
  // const [searchParams] = useSearchParams();
  // const id = searchParams.get("id") ?? undefined;
  // const testDonorList = donorsListDummy.slice(0, 10)
  let totalSum = 0
  donorsListDummy.forEach((item) => {
    const catValue = pmtCategoryMap.get(item.category.toLowerCase())
    if (catValue) {
      totalSum += catValue
    }
  })

  // const [isLoading, setIsLoading] = useState(true);
  // const [agentData, setAgentData] = useState<{
  //   id: string;
  //   fullname: string;
  //   region: string;
  //   createdon: any;
  //   updatedon: any;
  // } | undefined>(undefined)
  // const [donorList, setDonorList] = useState<
  //   | Array<{
  //     id: string;
  //     category: string;
  //     pendingpayments: boolean;
  //     active: boolean;
  //   }>
  //   | undefined
  // >(undefined);


  // const getAgentInfo = useCallback(async (id: string) => {
  //   const response = await getAgentData(id)
  //   if (response) {
  //     setAgentData(response)
  //   } else {
  //     console.log(response)
  //     toast({
  //       variant: "destructive",
  //       title: "Sorry! Error Occurred",
  //       description: "We could not load your data. Please try again.",
  //     });
  //   }
  // }, [toast])
  // const getAgentDonorList = useCallback(
  //   async (id: string, category?: string) => {
  //     setIsLoading(true);
  //     const response = await getAllDonors(id, category);
  //     // console.log('response', response)
  //     if (response) {
  //       setIsLoading(false);
  //       setDonorList(response);
  //     } else {
  //       setIsLoading(false);
  //       if (response === null) {
  //         toast({
  //           variant: "default",
  //           title: "No Data",
  //           description: "You have not registered any donors at this time",
  //         });
  //       } else {

  //         console.log("nothing", response);
  //         toast({
  //           variant: "destructive",
  //           title: "Sorry! Error Occurred",
  //           description: "We could not load your data. Please try again.",
  //         });
  //       }
  //     }
  //   },
  //   [toast]
  // );

  // useEffect(() => {
  //   if (id) {
  //     getAgentInfo(id)
  //     getAgentDonorList(id);
  //   } else {

  //   }
  // }, [id, getAgentDonorList, getAgentInfo]);

  // if (isLoading) {
  //   return (
  //     <div className="bg-white flex flex-col items-center bg-[url('/logo_bg.svg')] bg-center bg-no-repeat justify-center md:min-h-screen md:w-full h-screen w-screen overflow-auto">
  //       <RotateCw className="animate-spin" />
  //     </div>
  //   );
  // }
  return (
    <div className="bg-zinc-900 w-screen h-screen min-h-full bg-[url('/logo_bg.svg')] bg-center bg-no-repeat overflow-x-hidden overflow-y-auto">
      <div className="relative bg-gradient-to-b from-[#00512E] to-[#0A6D42] w-full py-4 px-4 md:px-10 h-[180px] flex flex-col justify-start md:justify-around">
        {/* Sign out and info */}
        <div className="w-full flex flex-col items-start justify-start md:flex-row md:items-center md:justify-between mb-4">
          <Link to="/" className="text-white flex flex-row items-center space-x-2">
            <img
              src="/tag-cross.svg"
            />
            <p>Sign Out</p>
          </Link>
          <div className="text-white flex flex-row items-center space-x-0 md:space-x-2">
            {/* <p className="hidden md:flex">
              You have
              {'  '}
              ({donorList ? donorList.filter((val) => val.active === false).length : 0})
              {'  '}
              <u> Inactive Donors </u>
              {'  '}
              and
              {'  '}
              ({donorList ? donorList.filter((val) => val.pendingpayments === true).length : 0})
              {'  '}
              <u> Pending Payments </u>
            </p> */}
            <img
              src="/warning-2.svg"
            />
          </div>
        </div>

        {/* Profile image and summary */}
        <div className="w-full flex flex-row justify-between">
          <div className="flex flex-row items-center space-x-2">
            <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-transparent">
              <img
                className="rounded-full w-full h-auto"
                src="/logo.png"
              />
            </div>
            <div>
              <h3 className="text-white text-2xl leading-tight capitalize">
                Adminstrator
              </h3>
              {/* <h6 className="hidden md:flex text-sm text-white/90 leading-tight">{id ?? ''}</h6> */}
            </div>
          </div>
          <div className="hidden md:flex md:space-x-3">
            <div className="flex flex-col px-4 items-start justify-center w-auto h-[91px] bg-transparent">
              <div className="flex flex-col items-start justify-start">
                <h3 className="leading-tight text-xs tracking-tight uppercase font-semibold text-white/90">
                  Total Amount Raised to Date:
                </h3>
                <h3 className="text-3xl font-bold text-white">
                  {/* #{donorList ? donorList.length : 0} */}
                  GHS {totalSum.toFixed(2)}
                </h3>
              </div>
            </div>
            {/* <div className="flex flex-col items-center justify-center w-[140px] lg:w-[180px] h-[91px] bg-gradient-to-b from-[#009E5A] to-[#21D486] rounded-md">
              <Link
                to="/register"
                state={{
                  agentId: id
                }}
                className="text-sm leading-tight uppercase text-white flex flex-row items-center space-x-1">
                <span className="text-white">Sign A Donor</span>
                <img
                  src="/add-circle.svg"
                />
              </Link>
            </div> */}
          </div>
          <div className="flex bg-white rounded-full w-[40px] h-[40px] items-center p-2">
            <img
              className="w-full h-auto"
              src="/logo.png"
            />
          </div>
        </div>
        {/* custom summary area */}
        <div className="absolute flex flex-row items-center md:hidden -bottom-14 left-4 right-4">
          <div className="flex flex-col items-start w-full h-[91px] bg-gradient-to-b from-[#FFFFFF] to-[#D4D4D8] rounded-lg shadow-lg p-4">
            <h3 className="leading-tight tracking-tight text-sm uppercase font-bold">
              Total Amount Raised to Date:
            </h3>
            <h3 className="text-3xl sm:text-4xl font-bold text-red-600">
              GHS {totalSum.toFixed(2)}
            </h3>
          </div>
        </div>
      </div>

      <div className="mt-20 md:mt-8 px-4 md:px-10 w-full flex flex-col">
        {/* Page Heading */}
        <div className="Flex flex-row items-center justify-start space-x-4 mb-4">
          <button className="bg-emerald-800 ring-1 ring-emerald-400 text-white rounded-md w-auto px-6 py-2">Donors</button>
          <button className="bg-emerald-800 ring-1 ring-emerald-400 text-white rounded-md w-auto px-6 py-2">Agents</button>
        </div>

        {/* Content area */}
        <div className="flex flex-col md:flex-row md:space-x-3 w-full">

          <div className="flex-auto w-full lg:w-4/5 md:w-3/5">
            {/* Table nav and filter visible at xs and sm */}
            <div className="w-full bg-gray-800 flex lg:hidden flex-row items-center justify-between">
              <ul className="flex flex-row items-center">
                <li className="text-xs px-2 text-white font-light">All</li>
                {'|'}
                <li className="text-xs px-2 font-light text-zinc-500">Active</li>
                {'|'}
                <li className="text-xs px-2 font-light text-zinc-500">Inactive</li>
              </ul>
              {/* <button className="text-xs">Filter By Card</button> */}
            </div>
            {/* Table Nav and Filter visible from md up */}
            <ul className="hidden bg-gray-800 w-full p-2.5 lg:flex flex-row items-center justify-start">
              <li className="text-sm px-2 text-white font-light">All Donors</li>
              {'|'}
              <li className="text-sm px-2 font-light text-zinc-500">Active Donors</li>
              {'|'}
              <li className="text-sm px-2 font-light text-zinc-500">Inactive Donors</li>
            </ul>
            <div>
              <ul className="flex flex-col items-start justify-start w-full px-2.5">
                {donorsListDummy.map((donor, idx) => (
                  <li key={idx} className="flex flex-col md:flex-row w-full md:items-center justify-between border-b border-b-gray-300 pt-5 pb-2">
                    <p className="basis-5/12 lg:basis-3/12 font-normal text-base">
                      <span className="flex lg:hidden capitalize text-xs text-white">{donor.category} Card</span>
                      <span className="text-white capitalize">{donor.fullname}</span>
                      <span className={
                        `flex lg:hidden text-sm uppercase font-light
                         text-green-600
                        `}
                      >
                        ACTIVE
                      </span>
                    </p>
                    <p className="hidden basis-2/12 text-zinc-400 font-light capitalize text-sm lg:flex">{donor.category} Card</p>
                    <p className={
                      `hidden basis-2/12 uppercase text-zinc-500 font-light mr-6 text-sm lg:flex
                    `}>{formatId(donor.id)}</p>
                    <p className={
                      `lg:flex hidden text-sm uppercase font-light
                         text-green-600
                        `}
                    >
                      {}
                    </p>
                    <p className={
                      `basis-3/12 lg:basis-2/12 font-semibold text-sm
                    `
                    }></p>
                    <h2
                      className="basis-3/12 lg:basis-2/12 rounded-lg w-auto py-2 text-2xl flex flex-row justify-start items-center font-bold text-emerald-400">
                      {pmtCategoryMap.get(donor.category)}
                      {/* <ChevronRight size={16} /> */}
                    </h2>
                  </li>
                ))}
                {!donorsListDummy && <p className="text-center w-full my-auto">No Data. Please register donors </p>}
              </ul>
            </div>
          </div>
          {/* <div className="hidden lg:flex md:flex-auto lg:w-1/5 md:w-2/5 rounded-lg bg-white flex-col shadow-lg px-2.5 pt-2.5 text-gray-500">
            <h1 className="text-sm">Filter By Card</h1>
          </div> */}
        </div>
      </div>
    </div>
  );
}
