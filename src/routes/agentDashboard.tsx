import { useToast } from "@/components/ui/use-toast";
import { formatId } from "@/utils/constants";
import { getAllDonors } from "@/utils/data";
import { ChevronRight, RotateCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getAgentData } from '../utils/data';

export default function AgentDashboard() {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id") ?? undefined;

  const [isLoading, setIsLoading] = useState(true);
  const [agentData, setAgentData] = useState<{
    id: string;
    fullname: string;
    region: string;
    createdon: any;
    updatedon: any;
} | undefined>(undefined)
  const [donorList, setDonorList] = useState<
    | Array<{
      id: string;
      category: string;
      pendingpayments: boolean;
      active: boolean;
    }>
    | undefined
  >(undefined);


  const getAgentInfo = useCallback(async (id: string) => {
    const response = await getAgentData(id)
    if (response) {
      setAgentData(response)
    } else {
      console.log(response)
      toast({
        variant: "destructive",
        title: "Sorry! Error Occurred",
        description: "We could not load your data. Please try again.",
      });
    }
  }, [toast])
  const getAgentDonorList = useCallback(
    async (id: string, category?: string) => {
      setIsLoading(true);
      const response = await getAllDonors(id, category);
      // console.log('response', response)
      if (response) {
        setIsLoading(false);
        setDonorList(response);
      } else {
        setIsLoading(false);
        if (response === null) {
          toast({
            variant: "default",
            title: "No Data",
            description: "You have not registered any donors at this time",
          });
        } else {

          console.log("nothing", response);
          toast({
            variant: "destructive",
            title: "Sorry! Error Occurred",
            description: "We could not load your data. Please try again.",
          });
        }
      }
    },
    [toast]
  );

  useEffect(() => {
    if (id) {
      getAgentInfo(id)
      getAgentDonorList(id);
    }
  }, [id, getAgentDonorList, getAgentInfo]);

  if (isLoading) {
    return (
      <div className="bg-white flex flex-col items-center bg-[url('/logo_bg.svg')] bg-center bg-no-repeat justify-center md:min-h-screen md:w-full h-screen w-screen overflow-auto">
        <RotateCw className="animate-spin" />
      </div>
    );
  }
  return (
    <div className="bg-white/95 w-screen h-screen min-h-full bg-[url('/logo_bg.svg')] bg-center bg-no-repeat overflow-x-hidden overflow-y-auto">
      <div className="relative bg-gradient-to-b from-[#00512E] to-[#0A6D42] w-full py-4 px-10 h-[180px] flex flex-col justify-start md:justify-around">
        {/* Sign out and info */}
        <div className="w-full flex flex-col items-start justify-start md:flex-row md:items-center md:justify-between mb-4">
          <Link to="/" className="text-white flex flex-row items-center space-x-2">
            <img
              src="/tag-cross.svg"
            />
            <p>Sign Out</p>
          </Link>
          <div className="text-white flex flex-row items-center space-x-0 md:space-x-2">
            <p className="hidden md:flex">
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
            </p>
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
              <h3 className="text-white text-xl leading-tight capitalize">{agentData ? agentData.fullname : ''}</h3>
              <h6 className="hidden md:flex text-sm text-white/90 leading-tight">{id ?? ''}</h6>
            </div>
          </div>
          <div className="flex md:hidden bg-white rounded-full w-[40px] h-[40px] items-center p-2">
            <img
              className="w-full h-auto"
              src="/logo.png"
            />
          </div>
          <div className="hidden md:flex md:space-x-3">
            <div className="flex flex-col px-4 items-start justify-center w-[235px] lg:w-[280px] h-[91px] bg-gray-200 ring-2 ring-white rounded-md">
              <div className="flex flex-row items-center justify-start space-x-4">
                <h3 className="leading-tight text-xs tracking-tight uppercase font-semibold">
                  Total Number of <br />
                  Registered Donors:
                </h3>
                <h3 className="text-3xl font-bold">
                  #{donorList ? donorList.length : 0}
                </h3>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center w-[140px] lg:w-[180px] h-[91px] bg-gradient-to-b from-[#009E5A] to-[#21D486] rounded-md">
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
            </div>
          </div>
        </div>
        {/* custom summary area */}
        <div className="absolute flex flex-row items-center md:hidden -bottom-14 left-10 right-10">
          <div className="flex flex-col w-[253px] h-[91px] bg-gray-200 ring-2 ring-white rounded-lg shadow-lg p-2">
            <h3 className="leading-tight tracking-tight text-sm uppercase font-bold">
              Total Number of <br />
              Registered Donors:
            </h3>
            <h3 className="text-2xl font-bold">
              #{donorList ? donorList.length : 0}
            </h3>
          </div>
          <div className="w-[140px] h-[71px] bg-gradient-to-b from-[#009E5A] to-[#21D486] rounded-lg -ml-8 shadow-lg flex flex-col items-center justify-center">
            <Link
              to="/register"
              state={{
                agentId: id
              }}
              className="text-xs leading-tight uppercase text-white flex flex-row items-center space-x-1">
              <span className="text-white">Sign A Donor</span>
              <img
                src="/add-circle.svg"
              />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-20 md:mt-8 px-10 w-full flex flex-col">
        {/* Page Heading */}
        <h1 className="text-3xl font-bold mb-2">Donors</h1>

        {/* Content area */}
        <div className="flex flex-col md:flex-row md:space-x-3 w-full">

          <div className="flex-auto w-full lg:w-4/5 md:w-3/5">
            {/* Table nav and filter visible at xs and sm */}
            <div className="w-full flex lg:hidden flex-row items-center justify-between">
              <ul className="flex flex-row items-center">
                <li className="text-xs px-2 text-red-400 font-light">All</li>
                {'|'}
                <li className="text-xs px-2 font-light">Active</li>
                {'|'}
                <li className="text-xs px-2 font-light">Inactive</li>
              </ul>
              {/* <button className="text-xs">Filter By Card</button> */}
            </div>
            {/* Table Nav and Filter visible from md up */}
            <ul className="hidden bg-gray-200 w-full p-2.5 lg:flex flex-row items-center justify-start">
              <li className="text-sm px-2 text-red-400 font-light">All Donors</li>
              {'|'}
              <li className="text-sm px-2 font-light">Active Donors</li>
              {'|'}
              <li className="text-sm px-2 font-light">Inactive Donors</li>
            </ul>
            <div>
              <ul className="flex flex-col items-start justify-start w-full px-2.5">
                {donorList && donorList.map((donor, idx) => (
                  <li key={idx} className="flex flex-row w-full items-center justify-between border-b border-b-gray-300 pt-5 pb-2">
                    <p className="basis-6/12 lg:basis-3/12 font-normal text-base">
                      <span className="flex lg:hidden capitalize text-xs text-gray-400">{donor.category} Card</span>
                      <span>{formatId(donor.id)}</span>
                      <span className={
                        `flex lg:hidden text-sm uppercase font-light
                         ${donor.active ? 'text-green-600' : 'text-red-600'}
                        `}
                      >
                        {donor.active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </p>
                    <p className="hidden basis-2/12 text-gray-400 font-light capitalize text-sm lg:flex">{donor.category} Card</p>
                    <p className={
                      `hidden basis-2/12 uppercase font-light mr-6 text-sm lg:flex
                    ${donor.active ? 'text-green-600' : 'text-red-600'}`}>{donor.active ? 'ACTIVE' : 'INACTIVE'}</p>
                    <p className={
                      `basis-3/12 lg:basis-2/12 font-semibold text-sm
                    ${donor.pendingpayments ? 'text-red-600' : 'text-green-600'}`
                    }>{donor.pendingpayments ? 'Pending payments' : 'Payments received'}</p>
                    <button
                      type="submit"
                      disabled={!donor.pendingpayments ? true : false}
                      className="disabled:opacity-40 disabled:pointer-events-none basis-3/12 lg:basis-2/12 rounded-lg w-auto bg-ndcgreen text-white py-2 lg:px-2 lg:w-[200px] text-xs flex flex-row justify-center items-center space-x-4">
                      <span className="capitalize">Send Reminder</span>
                      <ChevronRight size={16} />
                    </button>
                  </li>
                ))}
                {!donorList && <p className="text-center w-full my-auto">No Data. Please register donors </p>}
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
