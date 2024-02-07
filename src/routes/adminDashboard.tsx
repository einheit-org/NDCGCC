import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  formatId,
  generateStartEndEpochs,
  paymentCategories,
  pmtCategoryMap,
} from '@/utils/constants';
import { getDonorSum } from '@/utils/data';
import { Loader } from 'lucide-react';
import { format } from 'date-fns';
import { MouseEvent, useEffect, useState } from 'react';
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import AdminNav from '@/components/widgets/AdminNav';
import { CardCategory, SortSelf, useAdminDonorsQuery } from '@/hooks/useListDonors';
import { useGetAdminAgents } from '../hooks/useGetAdminAgents';

export default function AdminDash() {
  const [searchParams, setSearchParams] = useSearchParams();
  const adminid = searchParams.get('id') ?? undefined;
  const type = searchParams.get('type') ?? undefined;
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState<string | null>(null);
  const [pointHasDown, setPointHasDown] = useState(false);
  const [totalSum, setTotalSum] = useState(0);
  const [agentSort, setAgentSort] = useState<string | undefined>(undefined);
  // const [cardFilter, setCardFilter] = useState<string | undefined>(undefined)
  const [filterDate, setFilterDate] = useState<string | undefined>(undefined);
  const [queryFilterDate, setQueryFilterDate] = useState<{ start: EpochTimeStamp; end: EpochTimeStamp }>({ start: 0, end: 0 })
  const [sortType, setSortType] = useState<SortSelf | undefined>('donors')
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCard, setFilterCard] = useState<CardCategory>('all');
  const [agentTotal, setAgentTotal] = useState<number>(0);
  const [selfTotal, setSelfTotal] = useState<number>(0);

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

  const handleCardChange = (cat: CardCategory) => {
    setFilterCard(cat);
  };

  const handleDateChange = (date: string) => {
    const periodFilter = generateStartEndEpochs(date);
    setFilterDate(date);
    setQueryFilterDate(periodFilter)
  };
  const handleStatusChange = (status: string) => {
    setFilterStatus(status);
  };

  const showContent = (e: MouseEvent<HTMLButtonElement>) => {
    const term = e.currentTarget.value;
    setSearchParams({
      id: adminid ?? '',
      type: term,
    });
  };

  const { data: adminDonors, isLoading: adminDonorsLoading, isError: adminDonorsIsError, error: adminDonorsError } = useAdminDonorsQuery(filterCard ?? 'all', queryFilterDate.start, queryFilterDate.end, filterStatus, sortType)
  const { data: adminAgents, isLoading: adminAgentsLoading, isError: adminAgentsIsError, error: adminAgentsError } = useGetAdminAgents(agentSort)


  const showDetails = (id: string) => {
    const params = { id: id };
    navigate({
      pathname: '/adminagents',
      search: `?${createSearchParams(params)}`,
    });
  };

  const showDonorReport = (id: string) => {
    const params = { donorid: id, adminid: adminid ?? '' };
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


  useEffect(() => {
    if (type === 'donors') {
      setSortType('donors')
      setAgentSort(undefined)
      // setAgentsList(undefined);
    } else if (type === 'agents') {
      setAgentSort('agents');
      setSortType(undefined)
      
    } else if (type === 'self') {
      setSortType('self')
      setAgentSort(undefined)
    }
  }, [type]);


  useEffect(() => {
    setAdminName(window.localStorage.getItem('adminName'));
  }, []);

  useEffect(() => {
    getSum();
  }, []);

  useEffect(() => {
    if (adminAgents) {
      const totalAgentAmountRaised: number = adminAgents.reduce(
        (accumulator, currentAgent) =>
          accumulator + parseInt(currentAgent.totalraised),
        0,
      );
      setAgentTotal(totalAgentAmountRaised);
    }
  }, [adminAgents]);

  useEffect(() => {
    if (type === 'self' && adminDonors !== undefined) {
      let totalSelfSum = 0;
      adminDonors.forEach((item) => {
        const categoryValue = pmtCategoryMap.get(item.category.toLowerCase());
        if (categoryValue && item.active) {
          totalSelfSum += categoryValue;
        }
      });
      setSelfTotal(totalSelfSum); 
    }
  }, [adminDonors, type])

  return (
    <div className="h-screen min-h-full w-screen overflow-y-auto overflow-x-hidden bg-zinc-900 bg-[url('/logo_bg.svg')] bg-center bg-no-repeat">
      <AdminNav
        userName={adminName}
        isDonors={adminDonors ? true : false}
        isAgents={adminAgents ? true : false}
        filterType={type ?? ''}
        totalSum={totalSum}
        selfTotal={selfTotal}
        agentTotal={agentTotal}
      />

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
              {!adminAgents && (
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
              {!adminAgents && (
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
                {!adminAgents && (
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
                {!adminAgents && type !== 'self' && (
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
              {adminDonorsLoading && (
                <div className="flex h-screen w-full flex-col items-center justify-center text-white">
                  <Loader className="animate-spin" />
                </div>
              )}
              {adminAgentsLoading && (
                <div className="flex h-screen w-full flex-col items-center justify-center text-white">
                  <Loader className="animate-spin" />
                </div>
              )}
              {adminDonorsIsError && (
                <div className="flex flex-row items-center justify-center py-4 text-zinc-300">
                  <p>{adminDonorsError.message}</p>
                </div>
              )}
              {adminAgentsIsError && (
                <div className="flex flex-row items-center justify-center py-4 text-zinc-300">
                  <p>{adminAgentsError.message}</p>
                </div>
              )}
              <ul className="flex w-full flex-col items-start justify-start px-2.5">
                {adminDonors &&
                  adminDonors.length > 0 ? adminDonors.map((donor, idx) => (
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
                  )) : null}

                {adminAgents &&
                  adminAgents.length > 0 ? adminAgents.map((agent, idx) => (
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
                        { }
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
                  )) : null}
                {/* {!donorsList && <p className="text-center w-full my-auto">No Data. Please register donors </p>} */}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
