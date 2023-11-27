import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { formatId, paymentCategories, pmtCategoryMap } from "@/utils/constants";
import { getAgentData, getAllDonors, getAllUsers } from "@/utils/data";
import { format } from "date-fns";
import { ChevronLeft, RotateCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
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
  const id = searchParams.get("id") ?? '';
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(true);
  const [adminName, setAdminName] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined)
  const [filterCard, setFilterCard] = useState<string | undefined>(undefined)
  const [noDataMsg, setNoDataMsg] = useState<string | undefined>(undefined)
  const [usersMap, setUsersMap] = useState<Map<string, UserMap>>(new Map())
  const [usersList, setUsersList] = useState<Array<{
    name: string;
    id: string;
    category: string;
    pendingpayments: boolean;
    active: boolean;
  }> | undefined>(undefined)
  const [totalSum, setTotalSum] = useState(0)
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
      createdon: EpochTimeStamp
    }>
    | undefined
  >(undefined);
  const filterCardPrefix = filterCard === 'all' || !filterCard
    ? 'Filter By Card: '
    : 'Filtered By Card: '

  const filterStatusPrefix = filterStatus === '' || !filterStatus
    ? 'Filter By Status: '
    : 'Fitered By Status: '


  const handleCardChange = (cat: string) => {
    setFilterCard(cat)
  }

  const handleStatusChange = (status: string) => {
    setFilterStatus(status)
  }

  const getAgentInfo = useCallback(async (id: string) => {
    const response = await getAgentData(id)
    if (response) {
      setAgentData(response)
    } else {
      toast({
        variant: "destructive",
        title: "Sorry! Error Occurred",
        description: "We could not load your data. Please try again.",
      });
    }
  }, [toast])
  const getUsersList = async () => {
   const response = await getAllUsers()
   if (response) {
      setUsersList(response)
   } else {
     if (response === null) {
       toast({
         variant: "default",
         title: "No Data",
         description: "You have not registered any donors at this time",
       });
     } else {
       toast({
         variant: "destructive",
         title: "Error Occurred",
         description: "There is no recorded data. Please try again.",
       });
     }
   }
  }

  const getFilteredStatus = async (id: string, status: boolean | string) => {
    setNoDataMsg(undefined)
    setIsLoading(true)
    const response = await getAllDonors(id)
    if (!response) {
      setIsLoading(false)
      setNoDataMsg('No data available for selected category')
    } else {
      setIsLoading(false)
      if (typeof status === 'boolean') {
        const statusDonors = response.filter((donor) => donor.active === status)
        statusDonors.sort((a, b) => (b.createdon * 1000) - (a.createdon * 1000))
        if (statusDonors.length === 0 || !statusDonors) setNoDataMsg('No data available for this category')
        setDonorList(statusDonors)
        // setFilteredDonors(statusDonors)
      } else {
        response.sort((a, b) => (b.createdon * 1000) - (a.createdon * 1000))
        setDonorList(response)
        // setFilteredDonors(donors)
      }
    }
  }

  const showDetails = (id: string) => {
    const params = { id: id }
    navigate({
      pathname: '/donordetails',
      search: `?${createSearchParams(params)}`
    })
  }
  const getAgentDonorList = useCallback(
    async (id: string, category?: string) => {
      const filterCat = category === 'all' || !category ? '' : category
      setNoDataMsg(undefined)
      setIsLoading(true);
      const response = await getAllDonors(id, filterCat);
      if (response) {
        setIsLoading(false);
        response.sort((a, b) => (b.createdon * 1000) - (a.createdon * 1000))
        setDonorList(response);
      } else {
        setIsLoading(false);
        if (response === null || response === undefined) {
          setDonorList(undefined)
          setNoDataMsg('No available donors for the selected category')
        } else {
          toast({
            variant: "destructive",
            title: "Error Occurred",
            description: "There is no recorded data. Please try again.",
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

  useEffect(() => {
    setTotalSum(0)
    if (donorList) {
      let totalSum = 0
      donorList.forEach((item) => {
        const catValue = pmtCategoryMap.get(item.category.toLowerCase())
        if (catValue) {
          totalSum += catValue
        }
      })
      setTotalSum(totalSum)
    }
  }, [donorList])
  
  useEffect(() => {
    setAdminName(window.localStorage.getItem('adminName'))
  }, [])

  useEffect(() => {
    getUsersList()
  }, [])

  useEffect(() => {
    if (usersList && donorList) {
      const userMap = new Map<string, UserMap>()
      usersList.forEach((obj) => userMap.set(obj.id, obj))
      setUsersMap(userMap)
    }
  }, [usersList, donorList])

  useEffect(() => {
    if (filterStatus) {
      const status = filterStatus === 'active' ? true : filterStatus === 'inactive' ? false : ''
      getFilteredStatus(id, status)
    }

  }, [filterStatus, id])

  useEffect(() => {
    if (filterCard) {
      const filter = filterCard.toLowerCase()
      getAgentDonorList(id, filter)
    }
  }, [filterCard, id])

  return (
    <div className="bg-zinc-900 w-screen h-screen min-h-full bg-[url('/logo_bg.svg')] bg-center bg-no-repeat overflow-x-hidden overflow-y-auto">
      <div className="relative bg-gradient-to-b from-[#00512E] to-[#0A6D42] w-full py-4 px-4 md:px-10 h-[180px] flex flex-col justify-start md:justify-around">
        {/* Sign out and info */}
        <div className="w-full flex flex-col items-start justify-start md:flex-row md:items-center md:justify-between mb-4">
          <button onClick={() => navigate(-1)} className="text-white flex flex-row items-center space-x-2">
            <ChevronLeft />
            <p>Go Back</p>
          </button>
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
                {adminName}
              </h3>
              {/* <h6 className="hidden md:flex text-sm text-white/90 leading-tight">{id ?? ''}</h6> */}
            </div>
          </div>
          <div className="hidden md:flex md:space-x-3">
            <div className="flex flex-col px-4 items-start justify-center w-auto h-[91px] bg-transparent">
              <div className="flex flex-col items-start justify-start">
                <h3 className="leading-tight text-xs tracking-tight uppercase font-normal text-white/90">
                  Amount Raised by <span className="font-bold">{agentData?.fullname}</span>:
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
            <h3 className="leading-tight tracking-tight text-sm uppercase font-normal">
              Amount Raised by <span className="font-bold">{agentData?.fullname}</span>:
            </h3>
            <h3 className="text-3xl sm:text-4xl font-bold text-red-600">
              GHS {totalSum.toFixed(2)}
            </h3>
          </div>
        </div>
      </div>

      <div className="mt-20 md:mt-8 px-4 md:px-10 w-full flex flex-col">
        {/* Page Heading */}
        

        {/* Content area */}
        <div className="flex flex-col md:flex-row md:space-x-3 w-full">

          <div className="flex flex-col w-full">
            {/* Table nav and filter visible at xs and sm */}
            <div className="w-full bg-gray-800 flex lg:hidden flex-col items-center justify-center">
              <Select
                onValueChange={handleStatusChange}
                defaultValue={filterStatus}
              >
                <SelectTrigger className="w-full text-white border-0 rounded-none" role="button">
                  <span className="inline-block mr-2">{filterStatusPrefix}</span>
                  <SelectValue placeholder=" All Status" aria-placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem className="pl-3 py-2" value="all">All</SelectItem>
                    <SelectItem className="pl-3 py-2" value="active">Active</SelectItem>
                    <SelectItem className="pl-3 py-2" value="inactive">Inactive</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select
                onValueChange={handleCardChange}
                defaultValue={filterCard}>
                <SelectTrigger className="w-full text-white border-0 rounded-none" role="button">
                  <span className="inline-block mr-2">{filterCardPrefix}</span>
                  <SelectValue placeholder=" All cards" aria-placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {paymentCategories.map((filter, idx) => (
                      <SelectItem className="pl-3 py-2 capitalize" key={idx} value={filter.value}>
                        {filter.value}
                      </SelectItem>
                    ))}
                    <SelectItem className="pl-3 py-2" value="all">All Cards</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {/* Table Nav and Filter visible from md up */}
            <div className="hidden w-full lg:flex lg:flex-row bg-gray-800 p-2.5 items-center justify-between">
              <Select
                onValueChange={handleStatusChange}
                defaultValue={filterStatus}
              >
                <SelectTrigger className="w-auto text-white border-0 rounded-none" role="button">
                  <span className="inline-block mr-2">{filterStatusPrefix}</span>
                  <SelectValue placeholder=" All Status" aria-placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem className="pl-3 py-2" value="all">All</SelectItem>
                    <SelectItem className="pl-3 py-2" value="active">Active</SelectItem>
                    <SelectItem className="pl-3 py-2" value="inactive">Inactive</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select
                onValueChange={handleCardChange}
                defaultValue={filterCard}>
                <SelectTrigger className="w-auto text-white border-0 rounded-none" role="button">
                  <span className="inline-block mr-2">{filterCardPrefix}</span>
                  <SelectValue placeholder=" All Types" aria-placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {paymentCategories.map((filter, idx) => (
                      <SelectItem className="pl-3 py-2 capitalize" key={idx} value={filter.value}>
                        {filter.value}
                      </SelectItem>
                    ))}
                    <SelectItem className="pl-3 py-2" value="all">All Cards</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full flex flex-col items-center">
              {isLoading && <div className="h-screen w-full flex flex-col items-center justify-center text-white">
                <RotateCw className="animate-spin" />
              </div>}
              {noDataMsg && <div className="flex flex-row items-center justify-center text-zinc-300 py-4">
                <p>{noDataMsg}</p>
              </div>}
              <ul className="flex flex-col items-start justify-start w-full px-2.5">
                {donorList && donorList.map((donor, idx) => (
                  <li key={idx} onClick={() => showDetails(donor.id)}  className="hover:cursor-pointer flex flex-col md:flex-row w-full md:items-center justify-between border-b border-b-gray-300 pt-5 pb-2">
                    <p className="basis-5/12 lg:basis-3/12 font-normal text-base">
                      <span className="text-white capitalize">{usersMap.get(donor.id)?.name}</span>
                      <span className="flex lg:hidden capitalize text-xs text-white">{donor.category} Card</span>
                      <span className="flex lg:hidden capitalize text-xs text-white my-1">{donor.id}</span>
                      <span className={
                        `flex lg:hidden text-sm uppercase font-light
                         ${donor.active ? 'text-green-600' : 'text-red-600'}
                        `}
                      >
                        {donor.active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </p>
                    {/* <p className="hidden basis-2/12 text-zinc-400 font-light capitalize text-sm lg:flex"></p> */}
                    <p className={
                      `hidden basis-2/12 uppercase text-zinc-500 font-light mr-6 text-sm lg:flex
                    `}>{formatId(donor.id)}</p>
                    <p className={
                      `lg:flex hidden basis-2/12 text-sm uppercase font-light
                         ${donor.active ? 'text-green-600' : 'text-red-600'}
                        `}
                    >
                      {donor.active ? 'ACTIVE' : 'INACTIVE'}
                    </p>
                    <p className={
                      `basis-3/12 lg:basis-3/12 font-semibold text-sm text-zinc-500`
                    }>
                      {format(new Date(donor.createdon * 1000), 'do MMM, yyyy')}
                    </p>
                    <h2
                      className="basis-3/12 lg:basis-2/12 rounded-lg w-auto py-2 text-2xl flex flex-row justify-start items-center font-bold text-emerald-400">
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
