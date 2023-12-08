import { formatId } from '@/utils/constants';
import { getDonorReports } from '@/utils/data';
import { format } from 'date-fns';
import { ChevronLeft, RotateCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

export default function DonorReports() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const donorid = searchParams.get('donorid') ?? undefined;
  const adminid = searchParams.get('adminid') ?? undefined
  const [isLoading, setIsLoading] = useState(false);
  const [donorReport, setDonorReport] = useState<
    | Array<{
      userid: string;
      category: string;
      name: string;
      amount: number;
      purpose: string;
      createdon: EpochTimeStamp;
    }>
    | undefined | null
  >(undefined);
  const [noDataMsg, setNoDataMsg] = useState<string | undefined>(undefined);
  const [adminName, setAdminName] = useState<string | null>(null);
  const [pointHasDown, setPointHasDown] = useState(false);
  const [reportTotal, setReportTotal] = useState(0);

  const showDonorDetails = (id: string) => {
    const params = { id: id };
    navigate({
      pathname: '/donordetails',
      search: `?${createSearchParams(params)}`,
    });
  };

  const listDonorReport = async (id: string) => {
    setIsLoading(true);
    const data = await getDonorReports(id);
    if (!data) {
      setIsLoading(false);
      setDonorReport(undefined);
      setNoDataMsg('No available reports for this donor');
    } else {
      setIsLoading(false);
      const donorData = data.report;
      if (donorData === null || donorData === undefined) {
        setDonorReport(null);
        const params = { id: id, adminid: adminid ?? '' };
        navigate({
          pathname: '/donordetails',
          search: `?${createSearchParams(params)}`,
        });

      } else {
        donorData.sort((a, b) => b.createdon * 1000 - a.createdon * 1000);
        setDonorReport(donorData);
        setReportTotal(data.total);
      }

    }
  };

  useEffect(() => {
    setAdminName(window.localStorage.getItem('adminName'));
  }, []);

  useEffect(() => {
    if (donorid) {
      listDonorReport(donorid);
    }
  }, [donorid]);
  return (
    <div className="h-screen min-h-full w-screen overflow-y-auto overflow-x-hidden bg-zinc-900 bg-[url('/logo_bg.svg')] bg-center bg-no-repeat">
      <div className="relative flex h-[180px] w-full flex-col justify-start bg-gradient-to-b from-[#00512E] to-[#0A6D42] px-4 py-4 md:justify-around md:px-10">
        {/* Sign out and info */}
        <div className="mb-4 flex w-full flex-col items-start justify-start md:flex-row md:items-center md:justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex flex-row items-center space-x-2 text-white"
          >
            <ChevronLeft />
            <p>Go Back</p>
          </button>
          <div className="flex flex-row items-center space-x-0 text-white md:space-x-2">
            <img src="/warning-2.svg" />
          </div>
        </div>

        {/* Profile image and summary */}
        <div className="flex w-full flex-row justify-between">
          <div className="flex flex-row items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-transparent md:h-16 md:w-16">
              <img className="h-auto w-full rounded-full" src="/logo.png" />
            </div>
            <div>
              <h3 className="text-2xl capitalize leading-tight text-white">
                {adminName}
              </h3>
            </div>
          </div>
          <div className="hidden md:flex md:space-x-3">
            <div className="flex h-[91px] w-auto flex-col items-start justify-center bg-transparent px-4">
              <div className="flex flex-col items-start justify-start">
                <h3 className="text-xs font-semibold uppercase leading-tight tracking-tight text-white/90">
                  Total Amount Raised:
                </h3>
                <h3 className="text-3xl font-bold text-white">
                  {/* #{donorList ? donorList.length : 0} */}

                  <span>GHS {reportTotal.toFixed(2)}</span>
                  {/* {type === 'self' && <span>GHS {selfTotal.toFixed(2)}</span>} */}
                </h3>
              </div>
            </div>
          </div>
          <div className="flex h-[40px] w-[40px] items-center rounded-full bg-white p-2">
            <img className="h-auto w-full" src="/logo.png" />
          </div>
        </div>
        {/* custom summary area */}
        <div className="absolute -bottom-14 left-4 right-4 flex flex-row items-center md:hidden">
          <div className="flex h-[91px] w-full flex-col items-start rounded-lg bg-gradient-to-b from-[#FFFFFF] to-[#D4D4D8] p-4 shadow-lg">
            <h3 className="text-sm font-bold uppercase leading-tight tracking-tight">
              Total Amount Raised:
            </h3>
            <h3 className="text-3xl font-bold text-red-600 sm:text-4xl">
              <span>GHS {reportTotal.toFixed(2)}</span>
              {/* {type === 'self' && <span>GHS {selfTotal.toFixed(2)}</span>} */}
            </h3>
          </div>
        </div>
      </div>

      <div className="mt-20 flex w-full flex-col px-4 md:mt-8 md:px-10">
        {/* Page Heading */}

        {/* Content area */}
        <div className="flex w-full flex-col md:flex-row md:space-x-3">
          <div className="flex w-full flex-col">
            {/* Table nav and filter visible at xs and sm */}

            <div className="flex w-full flex-col items-center">
              {isLoading && (
                <div className="flex h-screen w-full flex-col items-center justify-center text-white">
                  <RotateCw className="animate-spin" />
                </div>
              )}
              {noDataMsg && (
                <div className="flex flex-row items-center justify-center py-4 text-zinc-300">
                  <p>{noDataMsg}</p>
                </div>
              )}
              <ul className="flex w-full flex-col items-start justify-start px-2.5">
                {donorReport &&
                  donorReport.map((donor, idx) => (
                    <li
                      key={idx}
                      onPointerDown={() => {
                        setPointHasDown(true);
                      }}
                      onClick={() => {
                        if (pointHasDown) {
                          setPointHasDown(false);
                          showDonorDetails(donor.userid);
                        }
                      }}
                      className="flex w-full flex-col justify-between border-b border-b-gray-300 pb-2 pt-5 hover:cursor-pointer md:flex-row md:items-center"
                    >
                      <p className="basis-5/12 text-base font-normal lg:basis-2/12">
                        <span className="capitalize text-white">
                          {donor.name}
                        </span>
                        <span className="flex text-xs capitalize text-white lg:hidden">
                          {donor.category} Card
                        </span>
                      </p>
                      <p className="hidden basis-1/12 text-sm font-light capitalize text-zinc-400 lg:flex">
                        {donor.category} Card
                      </p>
                      <p
                        className={`mr-6 hidden basis-2/12 text-sm font-light uppercase text-zinc-500 lg:flex
                    `}
                      >
                        {formatId(donor.userid)}
                      </p>
                      <p
                        className={`hidden text-sm font-light capitalize text-zinc-400 lg:flex
                      `}
                      >
                        {donor.purpose}
                      </p>
                      <p
                        className={`basis-3/12 text-sm font-semibold text-zinc-400 lg:basis-2/12
                    `}
                      >
                        {format(
                          new Date(donor.createdon * 1000),
                          'do MMM, yyyy',
                        )}
                      </p>
                      <h2 className="flex w-auto basis-3/12 flex-row items-center justify-start rounded-lg py-2 text-2xl font-bold text-emerald-400 lg:basis-2/12">
                        {donor.amount}
                        {/* <ChevronRight size={16} /> */}
                      </h2>
                    </li>
                  ))}
                {/* {!donorsList && <p className="text-center w-full my-auto">No Data. Please register donors </p>} */}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
