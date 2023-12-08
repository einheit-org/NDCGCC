import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { formatId, paymentCategories, pmtCategoryMap } from '@/utils/constants';
import { getAgentData, getAllDonors, getAllUsers } from '@/utils/data';
import { format } from 'date-fns';
import { ChevronLeft, RotateCw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
// import { getAgentData } from '../utils/data';
interface UserMap {
  name: string;
  id: string;
  category: string;
  pendingpayments: boolean;
  active: boolean;
}
export default function AdminAgents() {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') ?? '';
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [adminName, setAdminName] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(
    undefined,
  );
  const [filterCard, setFilterCard] = useState<string | undefined>(undefined);
  const [noDataMsg, setNoDataMsg] = useState<string | undefined>(undefined);
  const [usersMap, setUsersMap] = useState<Map<string, UserMap>>(new Map());
  const [usersList, setUsersList] = useState<
    | Array<{
        name: string;
        id: string;
        category: string;
        pendingpayments: boolean;
        active: boolean;
      }>
    | undefined
  >(undefined);
  const [totalSum, setTotalSum] = useState(0);
  const [agentData, setAgentData] = useState<
    | {
        id: string;
        fullname: string;
        region: string;
        createdon: any;
        updatedon: any;
      }
    | undefined
  >(undefined);
  const [donorList, setDonorList] = useState<
    | Array<{
        id: string;
        category: string;
        pendingpayments: boolean;
        active: boolean;
        createdon: EpochTimeStamp;
      }>
    | undefined
  >(undefined);
  const filterCardPrefix =
    filterCard === 'all' || !filterCard
      ? 'Filter By Card: '
      : 'Filtered By Card: ';

  const filterStatusPrefix =
    filterStatus === '' || !filterStatus
      ? 'Filter By Status: '
      : 'Fitered By Status: ';

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
  const getUsersList = async () => {
    const response = await getAllUsers();
    if (response) {
      setUsersList(response);
    } else {
      if (response === null) {
        toast({
          variant: 'default',
          title: 'No Data',
          description: 'You have not registered any donors at this time',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error Occurred',
          description: 'There is no recorded data. Please try again.',
        });
      }
    }
  };

  const getFilteredStatus = async (id: string, status: boolean | string) => {
    setNoDataMsg(undefined);
    setIsLoading(true);
    const response = await getAllDonors(id);
    if (!response) {
      setIsLoading(false);
      setNoDataMsg('No data available for selected category');
    } else {
      setIsLoading(false);
      if (typeof status === 'boolean') {
        const statusDonors = response.filter(
          (donor) => donor.active === status,
        );
        statusDonors.sort((a, b) => b.createdon * 1000 - a.createdon * 1000);
        if (statusDonors.length === 0 || !statusDonors)
          setNoDataMsg('No data available for this category');
        setDonorList(statusDonors);
        // setFilteredDonors(statusDonors)
      } else {
        response.sort((a, b) => b.createdon * 1000 - a.createdon * 1000);
        setDonorList(response);
        // setFilteredDonors(donors)
      }
    }
  };

  const showDetails = (id: string) => {
    const params = { id: id };
    navigate({
      pathname: '/donordetails',
      search: `?${createSearchParams(params)}`,
    });
  };
  const getAgentDonorList = useCallback(
    async (id: string, category?: string) => {
      const filterCat = category === 'all' || !category ? '' : category;
      setNoDataMsg(undefined);
      setIsLoading(true);
      const response = await getAllDonors(id, filterCat);
      if (response) {
        setIsLoading(false);
        response.sort((a, b) => b.createdon * 1000 - a.createdon * 1000);
        setDonorList(response);
      } else {
        setIsLoading(false);
        if (response === null || response === undefined) {
          setDonorList(undefined);
          setNoDataMsg('No available donors for the selected category');
        } else {
          toast({
            variant: 'destructive',
            title: 'Error Occurred',
            description: 'There is no recorded data. Please try again.',
          });
        }
      }
    },
    [toast],
  );

  useEffect(() => {
    if (id) {
      getAgentInfo(id);
      getAgentDonorList(id);
    }
  }, [id, getAgentDonorList, getAgentInfo]);

  useEffect(() => {
    setTotalSum(0);
    if (donorList) {
      let totalSum = 0;
      donorList.forEach((item) => {
        const catValue = pmtCategoryMap.get(item.category.toLowerCase());
        if (catValue) {
          totalSum += catValue;
        }
      });
      setTotalSum(totalSum);
    }
  }, [donorList]);

  useEffect(() => {
    setAdminName(window.localStorage.getItem('adminName'));
  }, []);

  useEffect(() => {
    getUsersList();
  }, []);

  useEffect(() => {
    if (usersList && donorList) {
      const userMap = new Map<string, UserMap>();
      usersList.forEach((obj) => userMap.set(obj.id, obj));
      setUsersMap(userMap);
    }
  }, [usersList, donorList]);

  useEffect(() => {
    if (filterStatus) {
      const status =
        filterStatus === 'active'
          ? true
          : filterStatus === 'inactive'
            ? false
            : '';
      getFilteredStatus(id, status);
    }
  }, [filterStatus, id]);

  useEffect(() => {
    if (filterCard) {
      const filter = filterCard.toLowerCase();
      getAgentDonorList(id, filter);
    }
  }, [filterCard, id]);

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
              <h3 className="text-2xl capitalize leading-tight text-white">
                {adminName}
              </h3>
              {/* <h6 className="hidden md:flex text-sm text-white/90 leading-tight">{id ?? ''}</h6> */}
            </div>
          </div>
          <div className="hidden md:flex md:space-x-3">
            <div className="flex h-[91px] w-auto flex-col items-start justify-center bg-transparent px-4">
              <div className="flex flex-col items-start justify-start">
                <h3 className="text-xs font-normal uppercase leading-tight tracking-tight text-white/90">
                  Amount Raised by{' '}
                  <span className="font-bold">{agentData?.fullname}</span>:
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
          <div className="flex h-[40px] w-[40px] items-center rounded-full bg-white p-2">
            <img className="h-auto w-full" src="/logo.png" />
          </div>
        </div>
        {/* custom summary area */}
        <div className="absolute -bottom-14 left-4 right-4 flex flex-row items-center md:hidden">
          <div className="flex h-[91px] w-full flex-col items-start rounded-lg bg-gradient-to-b from-[#FFFFFF] to-[#D4D4D8] p-4 shadow-lg">
            <h3 className="text-sm font-normal uppercase leading-tight tracking-tight">
              Amount Raised by{' '}
              <span className="font-bold">{agentData?.fullname}</span>:
            </h3>
            <h3 className="text-3xl font-bold text-red-600 sm:text-4xl">
              GHS {totalSum.toFixed(2)}
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
            <div className="flex w-full flex-col items-center justify-center bg-gray-800 lg:hidden">
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
            {/* Table Nav and Filter visible from md up */}
            <div className="hidden w-full items-center justify-between bg-gray-800 p-2.5 lg:flex lg:flex-row">
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
              <Select
                onValueChange={handleCardChange}
                defaultValue={filterCard}
              >
                <SelectTrigger
                  className="w-auto rounded-none border-0 text-white"
                  role="button"
                >
                  <span className="mr-2 inline-block">{filterCardPrefix}</span>
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
                {donorList &&
                  donorList.map((donor, idx) => (
                    <li
                      key={idx}
                      onClick={() => showDetails(donor.id)}
                      className="flex w-full flex-col justify-between border-b border-b-gray-300 pb-2 pt-5 hover:cursor-pointer md:flex-row md:items-center"
                    >
                      <p className="basis-5/12 text-base font-normal lg:basis-3/12">
                        <span className="capitalize text-white">
                          {usersMap.get(donor.id)?.name}
                        </span>
                        <span className="flex text-xs capitalize text-white lg:hidden">
                          {donor.category} Card
                        </span>
                        <span className="my-1 flex text-xs capitalize text-white lg:hidden">
                          {donor.id}
                        </span>
                        <span
                          className={`flex text-sm font-light uppercase lg:hidden
                         ${donor.active ? 'text-green-600' : 'text-red-600'}
                        `}
                        >
                          {donor.active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </p>
                      {/* <p className="hidden basis-2/12 text-zinc-400 font-light capitalize text-sm lg:flex"></p> */}
                      <p
                        className={`mr-6 hidden basis-2/12 text-sm font-light uppercase text-zinc-500 lg:flex
                    `}
                      >
                        {formatId(donor.id)}
                      </p>
                      <p
                        className={`hidden basis-2/12 text-sm font-light uppercase lg:flex
                         ${donor.active ? 'text-green-600' : 'text-red-600'}
                        `}
                      >
                        {donor.active ? 'ACTIVE' : 'INACTIVE'}
                      </p>
                      <p
                        className={`basis-3/12 text-sm font-semibold text-zinc-500 lg:basis-3/12`}
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
