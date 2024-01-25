import { useToast } from '@/components/ui/use-toast';
import { formatId, paymentCategories } from '@/utils/constants';
import { getAllDonors } from '@/utils/data';
import { Loader } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getAgentData } from '../utils/data';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AgentDashboard() {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') ?? undefined;

  const [filterStatus, setFilterStatus] = useState<string | undefined>(
    undefined,
  );
  const [filterCard, setFilterCard] = useState<string | undefined>(undefined);
  const [noDataMsg, setNoDataMsg] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [agentData, setAgentData] = useState<
    | {
        id: string;
        fullname: string;
        region: string;
        createdon: EpochTimeStamp;
        updatedon: any;
      }
    | undefined
  >(undefined);
  const [donorList, setDonorList] = useState<
    | Array<{
        id: string;
        fullname: string;
        category: string;
        pendingpayments: boolean;
        createdon: EpochTimeStamp;
        active: boolean;
      }>
    | undefined
  >(undefined);

  const filterStatusPrefix =
    filterStatus === '' || !filterStatus
      ? 'Filter By Status: '
      : 'Fitered By Status: ';

  const filterCardPrefix =
    filterCard === 'all' || !filterCard
      ? 'Filter By Card: '
      : 'Filtered By Card: ';

  const handleCardChange = (cat: string) => {
    setFilterCard(cat);
  };

  const handleStatusChange = (status: string) => {
    setFilterStatus(status);
  };

  const getAgentInfo = useCallback(
    async (id: string) => {
      const response = await getAgentData(id);
      if (response) {
        setAgentData(response);
      } else {
        toast({
          variant: 'destructive',
          title: 'Sorry! Error Occurred',
          description: 'We could not load your data. Please try again.',
        });
      }
    },
    [toast],
  );

  const getCardFilteredList = async (id: string, category: string) => {
    setNoDataMsg(undefined);
    setDonorList(undefined);
    setIsLoading(true);
    const response = await getAllDonors(id, category);
    if (!response) {
      setIsLoading(false);
      setNoDataMsg('No data present for selected category');
    } else {
      setIsLoading(false);
      response.sort((a, b) => b.createdon * 1000 - a.createdon * 1000);
      setDonorList(response);
    }
  };

  const getAgentDonorList = useCallback(
    async (id: string, category?: string, status?: boolean | string) => {
      setDonorList(undefined);
      setIsLoading(true);
      setNoDataMsg(undefined);
      const response = await getAllDonors(id, category);
      if (!response) {
        setNoDataMsg('There is no data available for this request');
      } else {
        setIsLoading(false);
        if (status === false) {
          const filterDonors = response.filter(
            (donor) => donor.active === false,
          );
          if (filterDonors.length === 0) {
            setDonorList(undefined);
            setNoDataMsg(
              'There is no available data for the selected category',
            );
          }
          filterDonors.sort((a, b) => b.createdon * 1000 - a.createdon * 1000);
          setDonorList(filterDonors);
        }
        if (status === true) {
          debugger;
          const activeDonors = response.filter(
            (donor) => donor.active === true,
          );
          if (activeDonors.length === 0) {
            setDonorList(undefined);
            setNoDataMsg(
              'There is no available data for the selected category',
            );
          } else {
            activeDonors.sort(
              (a, b) => b.createdon * 1000 - a.createdon * 1000,
            );
            setDonorList(activeDonors);
          }
        }
        if (status === 'all' || status === undefined) {
          response.sort((a, b) => b.createdon * 1000 - a.createdon * 1000);
          setDonorList(response);
        }
      }
    },
    [],
  );

  useEffect(() => {
    if (filterStatus) {
      const status =
        filterStatus === 'active'
          ? true
          : filterStatus === 'inactive'
            ? false
            : filterStatus;
      getAgentDonorList(id ?? '', undefined, status);
    }
  }, [id, filterStatus]);

  useEffect(() => {
    if (filterCard) {
      const filter = filterCard.toLowerCase();
      getCardFilteredList(id ?? '', filter === 'all' ? '' : filter);
    }
  }, [filterCard, id]);

  useEffect(() => {
    if (id) {
      getAgentInfo(id);
      getAgentDonorList(id);
    }
  }, [id, getAgentDonorList, getAgentInfo]);

  return (
    <div className="h-screen min-h-full w-screen overflow-y-auto overflow-x-hidden bg-white/95 bg-[url('/logo_bg.svg')] bg-center bg-no-repeat">
      <div className="relative flex h-[180px] w-full flex-col justify-start bg-gradient-to-b from-[#00512E] to-[#0A6D42] px-4 py-4 md:justify-around md:px-10">
        {/* Sign out and info */}
        <div className="mb-4 flex w-full flex-col items-start justify-start md:flex-row md:items-center md:justify-between">
          <Link
            to="/"
            className="flex flex-row items-center space-x-2 text-white"
          >
            <img src="/tag-cross.svg" />
            <p>Sign Out</p>
          </Link>
          <div className="flex flex-row items-center space-x-0 text-white md:space-x-2">
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
              <h3 className="text-xl capitalize leading-tight text-white">
                {agentData ? agentData.fullname : ''}
              </h3>
              <h6 className="hidden text-sm leading-tight text-white/90 md:flex">
                {id ?? ''}
              </h6>
            </div>
          </div>
          <div className="flex h-[40px] w-[40px] items-center rounded-full bg-white p-2 md:hidden">
            <img className="h-auto w-full" src="/logo.png" />
          </div>
          <div className="hidden md:flex md:space-x-3">
            <div className="flex h-[91px] w-[235px] flex-col items-start justify-center rounded-md bg-gray-200 px-4 ring-2 ring-white lg:w-[280px]">
              <div className="flex flex-row items-center justify-start space-x-4">
                <h3 className="text-xs font-semibold uppercase leading-tight tracking-tight">
                  Total Number of <br />
                  Registered Donors:
                </h3>
                <h3 className="text-3xl font-bold">
                  #{donorList ? donorList.length : 0}
                </h3>
              </div>
            </div>
            <div className="flex h-[91px] w-[140px] flex-col items-center justify-center rounded-md bg-gradient-to-b from-[#009E5A] to-[#21D486] lg:w-[180px]">
              <Link
                to="/register"
                state={{
                  agentId: id,
                }}
                className="flex flex-row items-center space-x-1 text-sm uppercase leading-tight text-white"
              >
                <span className="text-white">Register Donor</span>
                <img src="/add-circle.svg" />
              </Link>
            </div>
          </div>
        </div>
        {/* custom summary area */}
        <div className="absolute -bottom-14 left-4 right-4 flex flex-row items-center md:hidden">
          <div className="flex h-[91px] w-[253px] flex-col rounded-lg bg-gray-200 p-2 shadow-lg ring-2 ring-white">
            <h3 className="text-sm font-bold uppercase leading-tight tracking-tight">
              Total Number of <br />
              Registered Donors:
            </h3>
            <h3 className="text-2xl font-bold">
              #{donorList ? donorList.length : 0}
            </h3>
          </div>
          <div className="-ml-8 flex h-[71px] w-[160px] flex-col items-center justify-center rounded-lg bg-gradient-to-b from-[#009E5A] to-[#21D486] shadow-lg">
            <Link
              to="/register"
              state={{
                agentId: id,
              }}
              className="flex flex-row items-center space-x-1 text-xs uppercase leading-tight text-white"
            >
              <span className="text-white">Register Donor</span>
              <img src="/add-circle.svg" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-20 flex w-full flex-col px-4 md:mt-8 md:px-10">
        {/* Page Heading */}
        <h1 className="mb-2 text-3xl font-bold">Donors</h1>

        {/* Content area */}
        <div className="flex w-full flex-col md:flex-row md:space-x-3">
          <div className="w-full flex-auto md:w-3/5 lg:w-4/5">
            {/* Table nav and filter visible at xs and sm */}
            <div className="flex w-full flex-col items-center justify-between lg:hidden">
              <Select
                onValueChange={handleStatusChange}
                defaultValue={filterStatus}
              >
                <SelectTrigger
                  className="w-full rounded-none border-0 text-zinc-800"
                  role="button"
                >
                  <span className="mr-2 inline-block">
                    {filterStatusPrefix}
                  </span>
                  <SelectValue
                    placeholder=" All Status"
                    aria-placeholder="Select Type"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem className="py-2 pl-3" value="all">
                      All
                    </SelectItem>
                    <SelectItem className="py-2 pl-3" value="active">
                      Active
                    </SelectItem>
                    <SelectItem className="py-2 pl-3" value="inactive">
                      Inactive
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select
                onValueChange={handleCardChange}
                defaultValue={filterCard}
              >
                <SelectTrigger
                  className="w-full rounded-none border-0 text-zinc-800"
                  role="button"
                >
                  <span className="mr-2 inline-block">{filterCardPrefix}</span>
                  <SelectValue placeholder=" All cards" aria-placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {paymentCategories.map((filter, idx) => (
                      <SelectItem
                        className="py-2 pl-3 capitalize"
                        key={idx}
                        value={filter.value}
                      >
                        {filter.value}
                      </SelectItem>
                    ))}
                    <SelectItem className="py-2 pl-3" value="all">
                      All Cards
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {/* <button className="text-xs">Filter By Card</button> */}
            </div>
            {/* Table Nav and Filter visible from md up */}
            <div className="hidden w-full items-center justify-between py-2.5 lg:flex lg:flex-row">
              <Select
                onValueChange={handleStatusChange}
                defaultValue={filterStatus}
              >
                <SelectTrigger
                  className="w-auto rounded-none border-0 text-zinc-800"
                  role="button"
                >
                  <span className="mr-2 inline-block">
                    {filterStatusPrefix}
                  </span>
                  <SelectValue
                    placeholder=" All Status"
                    aria-placeholder="Select Type"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem className="py-2 pl-3" value="all">
                      All
                    </SelectItem>
                    <SelectItem className="py-2 pl-3" value="active">
                      Active
                    </SelectItem>
                    <SelectItem className="py-2 pl-3" value="inactive">
                      Inactive
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select
                onValueChange={handleCardChange}
                defaultValue={filterCard}
              >
                <SelectTrigger
                  className="w-auto rounded-none border-0 text-zinc-800"
                  role="button"
                >
                  <span className="mr-2 inline-block">{filterCardPrefix}</span>
                  <SelectValue placeholder=" All cards" aria-placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {paymentCategories.map((filter, idx) => (
                      <SelectItem
                        className="py-2 pl-3 capitalize"
                        key={idx}
                        value={filter.value}
                      >
                        {filter.value}
                      </SelectItem>
                    ))}
                    <SelectItem className="py-2 pl-3" value="all">
                      All Cards
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-full flex-col items-center">
              {isLoading && (
                <div className="flex h-screen w-full flex-col items-center justify-center text-zinc-800">
                  <Loader className="animate-spin" />
                </div>
              )}
              {noDataMsg && (
                <div className="flex flex-row items-center justify-center py-4 text-zinc-800">
                  <p>{noDataMsg}</p>
                </div>
              )}
              <ul className="flex w-full flex-col items-start justify-start px-2.5">
                {donorList &&
                  donorList.map((donor, idx) => (
                    <li
                      key={idx}
                      className="flex w-full flex-col justify-between border-b border-b-gray-300 pb-2 pt-5 md:flex-row md:items-center"
                    >
                      <p className="basis-6/12 text-base font-normal lg:basis-3/12">
                        <span className="flex text-xs capitalize text-gray-400 lg:hidden">
                          {donor.category} Card
                        </span>
                        <span className="capitalize">{donor.fullname}</span>
                        <span className="flex text-sm font-light capitalize text-gray-400 lg:hidden">
                          {formatId(donor.id)}
                        </span>
                        <span className="flex text-sm font-semibold capitalize text-gray-400 lg:hidden">
                          {format(
                            new Date(donor.createdon * 1000),
                            'do MMM, yyyy',
                          )}
                        </span>
                        <span
                          className={`flex text-sm font-light uppercase lg:hidden
                         ${donor.active ? 'text-green-600' : 'text-red-600'}
                        `}
                        >
                          {donor.active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </p>
                      <p className="hidden basis-2/12 text-sm font-light capitalize text-gray-400 lg:flex">
                        {donor.category} Card
                      </p>
                      <p className="hidden basis-2/12 text-sm font-light capitalize text-gray-400 lg:flex">
                        {formatId(donor.id)}
                      </p>
                      <p
                        className={`mr-6 hidden basis-2/12 text-sm font-light uppercase lg:flex
                    ${donor.active ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {donor.active ? 'ACTIVE' : 'INACTIVE'}
                      </p>
                      <p className="hidden basis-2/12 text-sm font-semibold capitalize text-gray-400 lg:flex">
                        {format(
                          new Date(donor.createdon * 1000),
                          'do MMM, yyyy',
                        )}
                      </p>
                      {/* <p className={
                      `basis-3/12 lg:basis-2/12 font-semibold text-sm
                    ${donor.pendingpayments ? 'text-red-600' : 'text-green-600'}`
                    }>{donor.pendingpayments ? 'Pending payments' : 'Payments received'}</p> */}

                      {/* <button
                      type="submit"
                      disabled={!donor.pendingpayments ? true : false}
                      className="disabled:opacity-40 disabled:pointer-events-none basis-3/12 lg:basis-2/12 rounded-lg w-auto bg-ndcgreen text-white py-2 lg:px-2 lg:w-[200px] text-xs flex flex-row justify-center items-center space-x-4">
                      <span className="capitalize">Send Reminder</span>
                      <ChevronRight size={16} />
                    </button> */}
                    </li>
                  ))}
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
