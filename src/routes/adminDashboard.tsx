import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import {
  formatId,
  generateStartEndEpochs,
  paymentCategories,
  pmtCategoryMap,
} from '@/utils/constants';
import { getDonorSum, showAdminDonors, showAllAgents } from '@/utils/data';
import { RotateCw } from 'lucide-react';
import { format } from 'date-fns';
import { MouseEvent, useEffect, useState } from 'react';
import {
  Link,
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

export default function AdminDash() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get('id') ?? undefined;
  const type = searchParams.get('type') ?? undefined;
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState<string | null>(null);
  const [pointHasDown, setPointHasDown] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [totalSum, setTotalSum] = useState(0);
  const [noDataMsg, setNoDataMsg] = useState<string | undefined>(undefined);
  // const [cardFilter, setCardFilter] = useState<string | undefined>(undefined)
  const [filterDate, setFilterDate] = useState<string | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(
    undefined,
  );
  const [filterCard, setFilterCard] = useState<string | undefined>(undefined);
  const [agentTotal, setAgentTotal] = useState<number>(0);
  const [selfTotal, setSelfTotal] = useState<number>(0);
  const [agentsList, setAgentsList] = useState<
    | Array<{
        name: string;
        id: string;
        totalraised: string;
        createdon: EpochTimeStamp;
      }>
    | undefined
  >(undefined);
  const [donorsList, setDonorsList] = useState<
    | Array<{
        id: string;
        name: string;
        category: string;
        pendingpayments: boolean;
        agent: string;
        active: boolean;
        createdon: EpochTimeStamp;
      }>
    | undefined
  >(undefined);

  const [filteredDonors, setFilteredDonors] = useState<
    | Array<{
        id: string;
        name: string;
        category: string;
        pendingpayments: boolean;
        agent: string;
        active: boolean;
        createdon: EpochTimeStamp;
      }>
    | undefined
  >(undefined);
  const filterCardPrefix =
    filterCard === 'all' || !filterCard
      ? 'Filter By Card: '
      : 'Filtered By Card: ';
  const filterDatePrefix =
    filterDate === '' || !filterDate ? 'Filter By Date: ' : 'Fitered By Date: ';

  const filterStatusPrefix =
    filterStatus === '' || !filterStatus
      ? 'Filter By Status: '
      : 'Fitered By Status: ';

  const handleCardChange = (cat: string) => {
    setFilterCard(cat);
  };

  const handleDateChange = (date: string) => {
    setFilterDate(date);
  };
  const handleStatusChange = (status: string) => {
    setFilterStatus(status);
  };

  const showContent = (e: MouseEvent<HTMLButtonElement>) => {
    const term = e.currentTarget.value;
    setSearchParams({
      id: id ?? '',
      type: term,
    });
  };

  const listDonors = async (
    category?: string,
    start?: EpochTimeStamp,
    end?: EpochTimeStamp,
  ) => {
    setNoDataMsg(undefined);
    setIsLoading(true);
    const donors = await showAdminDonors(category ?? '', start ?? 0, end ?? 0);
    if (!donors) {
      setIsLoading(false);
      setNoDataMsg('No data available for selected category');
      setDonorsList(undefined);
      setFilteredDonors(undefined);
    } else {
      setIsLoading(false);
      donors.sort((a, b) => b.createdon * 1000 - a.createdon * 1000);
      setDonorsList(donors);
      setFilteredDonors(donors);
    }
  };

  const renderSelfDonors = async (category?: string) => {
    setNoDataMsg(undefined);
    setIsLoading(true);
    const filterCat = category === 'all' || !category ? '' : category;
    const donors = await showAdminDonors(filterCat, 0, 0);
    if (donors === undefined) {
      setIsLoading(false);
      setDonorsList(undefined);
      setFilteredDonors(undefined);
      setNoDataMsg('No data available for selected category');
    } else {
      setIsLoading(false);
      const selfDonors = donors.filter((donor) => donor.agent === 'self');
      selfDonors.sort((a, b) => b.createdon * 1000 - a.createdon * 1000);
      sumSelfDonorsTotal(selfDonors);
      if (filterCat && filterCat !== '') {
        const catFilteredDonors = selfDonors.filter(
          (donor) => donor.category === category,
        );
        if (catFilteredDonors.length === 0 || !catFilteredDonors)
          setNoDataMsg('No data available for selected category');
        setDonorsList(catFilteredDonors);
        setFilteredDonors(catFilteredDonors);
      } else {
        setDonorsList(selfDonors);
        setFilteredDonors(selfDonors);
      }
    }
  };

  const showDetails = (id: string) => {
    const params = { id: id };
    navigate({
      pathname: '/adminagents',
      search: `?${createSearchParams(params)}`,
    });
  };

  const showDonorReport = (id: string) => {
    const params = { id: id };
    navigate({
      pathname: '/report',
      search: `?${createSearchParams(params)}`,
    });
  };

  const getSum = async () => {
    const sum = await getDonorSum();
    if (!sum) {
      setTotalSum(0);
    } else {
      setTotalSum(sum.total);
    }
  };

  const getFilteredStatus = async (status: boolean | string) => {
    setNoDataMsg(undefined);
    setIsLoading(true);
    const donors = await showAdminDonors();
    if (!donors) {
      setIsLoading(false);
      setNoDataMsg('No data available for selected category');
    } else {
      setIsLoading(false);
      if (typeof status === 'boolean') {
        const statusDonors = donors.filter((donor) => donor.active === status);
        statusDonors.sort((a, b) => b.createdon * 1000 - a.createdon * 1000);
        setDonorsList(statusDonors);
        setFilteredDonors(statusDonors);
      } else {
        donors.sort((a, b) => b.createdon * 1000 - a.createdon * 1000);
        setDonorsList(donors);
        setFilteredDonors(donors);
      }
    }
  };

  const listAgents = async () => {
    setNoDataMsg(undefined);
    setIsLoading(true);
    const agents = await showAllAgents();
    if (!agents) {
      setNoDataMsg('No data available for currently available');
      setIsLoading(false);
      toast({
        variant: 'destructive',
        title: 'Error!',
        description:
          'We could not retrieve your data at this time. Please try again later!',
      });
    } else {
      setIsLoading(false);
      agents.sort((a, b) => b.createdon * 1000 - a.createdon * 1000);
      setAgentsList(agents);
    }
  };

  const sumSelfDonorsTotal = (
    donors: Array<{
      id: string;
      name: string;
      category: string;
      pendingpayments: boolean;
      agent: string;
      active: boolean;
      createdon: EpochTimeStamp;
    }>,
  ) => {
    let totalSelfSum = 0;
    donors.forEach((item) => {
      const categoryValue = pmtCategoryMap.get(item.category.toLowerCase());
      if (categoryValue) {
        totalSelfSum += categoryValue;
      }
    });
    setSelfTotal(totalSelfSum);
  };

  useEffect(() => {
    if (type === 'donors') {
      setAgentsList(undefined);
      listDonors();
    } else if (type === 'agents') {
      setDonorsList(undefined);
      setFilteredDonors(undefined);
      listAgents();
    } else if (type === 'self') {
      setAgentsList(undefined);
      setDonorsList(undefined);
      renderSelfDonors();
    } else {
      listDonors();
    }
  }, [type]);

  useEffect(() => {
    if (filterCard) {
      const filter = filterCard.toLowerCase();
      if (type === 'self') {
        renderSelfDonors(filter);
      } else {
        listDonors(filter);
      }
    }
  }, [filterCard]);

  useEffect(() => {
    if (filterDate) {
      const periodFilter = generateStartEndEpochs(filterDate);
      listDonors(undefined, periodFilter.start, periodFilter.end);
    }
  }, [filterDate]);

  useEffect(() => {
    if (filterStatus) {
      const status =
        filterStatus === 'active'
          ? true
          : filterStatus === 'inactive'
            ? false
            : '';
      getFilteredStatus(status);
    }
  }, [filterStatus]);

  useEffect(() => {
    setAdminName(window.localStorage.getItem('adminName'));
  }, []);

  useEffect(() => {
    getSum();
  }, []);

  useEffect(() => {
    if (agentsList) {
      const totalAgentAmountRaised: number = agentsList.reduce(
        (accumulator, currentAgent) =>
          accumulator + parseInt(currentAgent.totalraised),
        0,
      );
      setAgentTotal(totalAgentAmountRaised);
    }
  }, [agentsList]);

  return (
    <div className="h-screen min-h-full w-screen overflow-y-auto overflow-x-hidden bg-zinc-900 bg-[url('/logo_bg.svg')] bg-center bg-no-repeat">
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
                  Total Amount Raised to Date:
                </h3>
                <h3 className="text-3xl font-bold text-white">
                  {/* #{donorList ? donorList.length : 0} */}
                  {donorsList && type === 'donors' ? (
                    <span>GHS {totalSum.toFixed(2)}</span>
                  ) : donorsList && type === 'self' ? (
                    <span>GHS {selfTotal.toFixed(2)}</span>
                  ) : (
                    ''
                  )}
                  {agentsList && <span>GHS {agentTotal.toFixed(2)}</span>}
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
              Total Amount Raised to Date:
            </h3>
            <h3 className="text-3xl font-bold text-red-600 sm:text-4xl">
              {donorsList && type === 'donors' ? (
                <span>GHS {totalSum.toFixed(2)}</span>
              ) : donorsList && type === 'self' ? (
                <span>GHS {selfTotal.toFixed(2)}</span>
              ) : (
                ''
              )}
              {agentsList && <span>GHS {agentTotal.toFixed(2)}</span>}
              {/* {type === 'self' && <span>GHS {selfTotal.toFixed(2)}</span>} */}
            </h3>
          </div>
        </div>
      </div>

      <div className="mt-20 flex w-full flex-col px-4 md:mt-8 md:px-10">
        {/* Page Heading */}

        <div className="mb-4 flex flex-row items-center justify-start space-x-2 sm:space-x-4">
          <button
            className={`w-auto rounded-md bg-emerald-900 px-6 py-2 text-white ring-1 ring-emerald-400
              ${type === 'donors' ? 'bg-emerald-800 text-zinc-400' : ''}
              `}
            value="donors"
            type="button"
            onClick={showContent}
          >
            Donors
          </button>
          <button
            className={`w-auto rounded-md bg-emerald-900 px-6 py-2 text-white ring-1 ring-emerald-400
              ${type === 'agents' ? 'bg-emerald-800 text-zinc-400' : ''}
              `}
            value="agents"
            type="button"
            onClick={showContent}
          >
            Agents
          </button>
          <button
            className={`w-auto rounded-md bg-emerald-900 px-6 py-2 text-white ring-1 ring-emerald-400
              ${type === 'self' ? 'bg-emerald-800 text-zinc-400' : ''}
              `}
            value="self"
            type="button"
            onClick={showContent}
          >
            Self
          </button>
        </div>

        {/* Content area */}
        <div className="flex w-full flex-col md:flex-row md:space-x-3">
          <div className="flex w-full flex-col">
            {/* Table nav and filter visible at xs and sm */}
            <div className="flex w-full flex-col items-center justify-center bg-gray-800 lg:hidden">
              {!agentsList && (
                <>
                  <Select
                    onValueChange={handleStatusChange}
                    defaultValue={filterStatus}
                  >
                    <SelectTrigger
                      className="w-full rounded-none border-0 text-white"
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
                      className="w-full rounded-none border-0 text-white"
                      role="button"
                    >
                      <span className="mr-2 inline-block">
                        {filterCardPrefix}
                      </span>
                      <SelectValue
                        placeholder=" All cards"
                        aria-placeholder=""
                      />
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
                  {type !== 'self' && (
                    <Select
                      onValueChange={handleDateChange}
                      defaultValue={searchParams.get('category')?.toString()}
                    >
                      <SelectTrigger
                        className="w-full rounded-none border-0 text-white"
                        role="button"
                      >
                        <span className="mr-2 inline-block">
                          {filterDatePrefix}
                        </span>
                        <SelectValue
                          placeholder=" Select Period"
                          aria-placeholder="Select Period"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem className="py-2 pl-3" value="7">
                            7 days ago
                          </SelectItem>
                          <SelectItem className="py-2 pl-3" value="15">
                            15 days ago
                          </SelectItem>
                          <SelectItem className="py-2 pl-3" value="30">
                            30 days ago
                          </SelectItem>
                          <SelectItem className="py-2 pl-3" value="60">
                            60 days ago
                          </SelectItem>
                          <SelectItem className="py-2 pl-3" value="90">
                            90 days ago
                          </SelectItem>
                          <SelectItem className="py-2 pl-3" value="all">
                            Show all
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                </>
              )}
            </div>
            {/* Table Nav and Filter visible from lg up */}
            <div className="hidden w-full items-center justify-between bg-gray-800 p-2.5 lg:flex lg:flex-row">
              {!agentsList && (
                <Select
                  onValueChange={handleStatusChange}
                  defaultValue={filterStatus}
                >
                  <SelectTrigger
                    className="w-auto rounded-none border-0 text-white"
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
              )}
              <div className="flex flex-row items-center">
                {!agentsList && (
                  <Select
                    onValueChange={handleCardChange}
                    defaultValue={filterCard}
                  >
                    <SelectTrigger
                      className="w-auto rounded-none border-0 text-white"
                      role="button"
                    >
                      <span className="mr-2 inline-block">
                        {filterCardPrefix}
                      </span>
                      <SelectValue
                        placeholder=" All Types"
                        aria-placeholder="Select Type"
                      />
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
                )}
                {!agentsList && type !== 'self' && (
                  <Select
                    onValueChange={handleDateChange}
                    defaultValue={filterDate}
                  >
                    <SelectTrigger
                      className="w-auto rounded-none border-0 text-white"
                      role="button"
                    >
                      <span className="mr-2 inline-block">
                        {filterDatePrefix}
                      </span>
                      <SelectValue
                        placeholder=" Select Period"
                        aria-placeholder="Select Period"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem className="py-2 pl-3" value="7">
                          7 days ago
                        </SelectItem>
                        <SelectItem className="py-2 pl-3" value="15">
                          15 days ago
                        </SelectItem>
                        <SelectItem className="py-2 pl-3" value="30">
                          30 days ago
                        </SelectItem>
                        <SelectItem className="py-2 pl-3" value="60">
                          60 days ago
                        </SelectItem>
                        <SelectItem className="py-2 pl-3" value="90">
                          90 days ago
                        </SelectItem>
                        <SelectItem className="py-2 pl-3" value="all">
                          Show all
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

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
                {filteredDonors &&
                  filteredDonors.map((donor, idx) => (
                    <li
                      key={idx}
                      onPointerDown={() => {
                        setPointHasDown(true);
                      }}
                      onClick={() => {
                        if (pointHasDown) {
                          setPointHasDown(false);
                          showDonorReport(donor.id);
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
                        <span
                          className={`flex text-sm font-light uppercase lg:hidden
                         ${donor.active ? 'text-green-600' : 'text-red-600'}
                        `}
                        >
                          {donor.active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </p>
                      <p className="hidden basis-1/12 text-sm font-light capitalize text-zinc-400 lg:flex">
                        {donor.category} Card
                      </p>
                      <p
                        className={`mr-6 hidden basis-2/12 text-sm font-light uppercase text-zinc-500 lg:flex
                    `}
                      >
                        {formatId(donor.id)}
                      </p>
                      <p
                        className={`hidden text-sm font-light uppercase lg:flex
                      ${donor.active ? 'text-green-600' : 'text-red-600'}
                      `}
                      >
                        {donor.active ? 'ACTIVE' : 'INACTIVE'}
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
                        {pmtCategoryMap.get(donor.category)}
                        {/* <ChevronRight size={16} /> */}
                      </h2>
                    </li>
                  ))}

                {agentsList &&
                  agentsList.map((agent, idx) => (
                    <li
                      key={idx}
                      onPointerDown={() => {
                        setPointHasDown(true);
                      }}
                      onClick={() => {
                        if (pointHasDown) {
                          setPointHasDown(false);
                          showDetails(agent.id);
                        }
                      }}
                      className="flex w-full flex-col justify-between border-b border-b-gray-300 pb-2 pt-5 md:flex-row md:items-center"
                    >
                      <p className="basis-5/12 text-base font-normal lg:basis-3/12">
                        <span className="capitalize text-white">
                          {agent.name}
                        </span>
                        <span className="flex text-xs capitalize text-white lg:hidden">
                          {agent.id}
                        </span>
                        {/* <span className={
                        `flex lg:hidden text-sm uppercase font-light
                         text-green-600
                        `}
                      >
                        ACTIVE
                      </span> */}
                      </p>
                      {/* <p className="hidden basis-2/12 text-zinc-400 font-light capitalize text-sm lg:flex">{donor.category} Card</p> */}
                      <p
                        className={`mr-6 hidden basis-2/12 text-sm font-light uppercase text-zinc-500 lg:flex
                    `}
                      >
                        {formatId(agent.id)}
                      </p>
                      <p
                        className={`hidden text-sm font-light uppercase text-green-600
                         lg:flex
                        `}
                      >
                        {}
                      </p>
                      <p
                        className={`basis-3/12 text-sm font-semibold text-zinc-400 lg:basis-2/12
                    `}
                      >
                        {format(
                          new Date(agent.createdon * 1000),
                          'do MMM, yyyy',
                        )}
                      </p>
                      <h2 className="flex w-auto basis-3/12 flex-row items-center justify-start rounded-lg py-2 text-2xl font-bold text-emerald-400 lg:basis-2/12">
                        {agent.totalraised}
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
