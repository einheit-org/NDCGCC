import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { formatId, generateStartEndEpochs, paymentCategories, pmtCategoryMap } from "@/utils/constants";
import { getDonorSum, showAdminDonors, showAllAgents } from "@/utils/data";
import { RotateCw } from "lucide-react";
import { format } from 'date-fns'
import { MouseEvent, useEffect, useState } from "react";
import { Link, createSearchParams, useNavigate, useSearchParams } from "react-router-dom";

export default function AdminDash() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id") ?? undefined;
  const type = searchParams.get("type") ?? undefined;
  const navigate = useNavigate()
  const [adminName, setAdminName] = useState<string | null>(null)
  const [pointHasDown, setPointHasDown] = useState(false)

  const [isLoading, setIsLoading] = useState(true);
  const [totalSum, setTotalSum] = useState(0)
  const [noDataMsg, setNoDataMsg] = useState<string | undefined>(undefined)
  // const [cardFilter, setCardFilter] = useState<string | undefined>(undefined)
  const [filterDate, setFilterDate] = useState<string | undefined>(undefined)
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined)
  const [filterCard, setFilterCard] = useState<string | undefined>(undefined)
  const [agentTotal, setAgentTotal] = useState<number>(0)
  const [selfTotal, setSelfTotal] = useState<number>(0)
  // const [dateFilter, setDateFilter] = useState<{start: EpochTimeStamp, end: EpochTimeStamp} | undefined>(undefined)
  const [agentsList, setAgentsList] = useState<Array<{
    name: string;
    id: string;
    totalraised: string;
    createdon: EpochTimeStamp
  }>
    | undefined>(undefined)
  const [donorsList, setDonorsList] = useState<Array<{
    id: string;
    name: string;
    category: string;
    pendingpayments: boolean;
    agent: string;
    active: boolean;
    createdon: EpochTimeStamp
  }> | undefined>(undefined)

  const [filteredDonors, setFilteredDonors] = useState<Array<{
    id: string;
    name: string;
    category: string;
    pendingpayments: boolean;
    agent: string;
    active: boolean;
    createdon: EpochTimeStamp
  }> | undefined>(undefined)
  const filterCardPrefix = filterCard === 'all' || !filterCard
    ? 'Filter By Card: '
    : 'Filtered By Card: '
  const filterDatePrefix = filterDate === '' || !filterDate
    ? 'Filter By Date: '
    : 'Fitered By Date: '

  const filterStatusPrefix = filterStatus === '' || !filterStatus
    ? 'Filter By Status: '
    : 'Fitered By Status: '


  const handleCardChange = (cat: string) => {
    setFilterCard(cat)
  }

  const handleDateChange = (date: string) => {
    setFilterDate(date)
  }
  const handleStatusChange = (status: string) => {
    setFilterStatus(status)
  }

  const showContent = (e: MouseEvent<HTMLButtonElement>) => {
    const term = e.currentTarget.value
    setSearchParams({
      id: id ?? '',
      type: term
    })
  }

  const listDonors = async (category?: string, start?: EpochTimeStamp, end?: EpochTimeStamp) => {
    setNoDataMsg(undefined)
    setIsLoading(true)
    const donors = await showAdminDonors(category ?? '', start ?? 0, end ?? 0)
    if (!donors) {
      setIsLoading(false)
      setNoDataMsg('No data available for selected category')
      setDonorsList(undefined)
      setFilteredDonors(undefined)
    } else {
      setIsLoading(false)
      donors.sort((a, b) => (b.createdon * 1000) - (a.createdon * 1000))
      setDonorsList(donors)
      setFilteredDonors(donors)
    }
  }

  const renderSelfDonors = async (category?: string) => {
    setNoDataMsg(undefined)
    setIsLoading(true)
    const filterCat = category === 'all' || !category ? '' : category
    const donors = await showAdminDonors(filterCat, 0, 0)
    if (donors === undefined) {
      setIsLoading(false)
      setDonorsList(undefined)
      setFilteredDonors(undefined)
      setNoDataMsg('No data available for selected category')
    } else {
      setIsLoading(false)
      const selfDonors = donors.filter((donor) => donor.agent === 'self')
      selfDonors.sort((a, b) => (b.createdon * 1000) - (a.createdon * 1000))
      sumSelfDonorsTotal(selfDonors)
      if (filterCat && filterCat !== '') {
        const catFilteredDonors = selfDonors.filter((donor) => donor.category === category)
        if (catFilteredDonors.length === 0 || !catFilteredDonors) setNoDataMsg('No data available for selected category')
        setDonorsList(catFilteredDonors)
        setFilteredDonors(catFilteredDonors)
      } else {
        setDonorsList(selfDonors)
        setFilteredDonors(selfDonors)
      }

    }
  }

  const showDetails = (id: string) => {
    const params = { id: id }
    navigate({
      pathname: '/adminagents',
      search: `?${createSearchParams(params)}`
    })
  }

  const showDonorReport = (id: string) => {
    const params = { id: id }
    navigate({
      pathname: '/report',
      search: `?${createSearchParams(params)}`
    })
  }

  const getSum = async () => {
    const sum = await getDonorSum()
    if (!sum) {
      setTotalSum(0)
    } else {
      setTotalSum(sum.total)
    }
  }

  const getFilteredStatus = async (status: boolean | string) => {
    setNoDataMsg(undefined)
    setIsLoading(true)
    const donors = await showAdminDonors()
    if (!donors) {
      setIsLoading(false)
      setNoDataMsg('No data available for selected category')
    } else {
      setIsLoading(false)
      if (typeof status === 'boolean') {
        const statusDonors = donors.filter((donor) => donor.active === status)
        statusDonors.sort((a, b) => (b.createdon * 1000) - (a.createdon * 1000))
        setDonorsList(statusDonors)
        setFilteredDonors(statusDonors)
      } else {
        donors.sort((a, b) => (b.createdon * 1000) - (a.createdon * 1000))
        setDonorsList(donors)
        setFilteredDonors(donors)
      }

    }
  }

  const listAgents = async () => {
    setNoDataMsg(undefined)
    setIsLoading(true)
    const agents = await showAllAgents()
    if (!agents) {
      setNoDataMsg('No data available for currently available')
      setIsLoading(false)
      toast({
        variant: "destructive",
        title: "Error!",
        description: "We could not retrieve your data at this time. Please try again later!"
      })
    } else {
      setIsLoading(false)
      agents.sort((a, b) => (b.createdon * 1000) - (a.createdon * 1000))
      setAgentsList(agents)
    }
  }

  const sumSelfDonorsTotal = (donors: Array<{
    id: string;
    name: string;
    category: string;
    pendingpayments: boolean;
    agent: string;
    active: boolean;
    createdon: EpochTimeStamp
  }>) => {
    let totalSelfSum = 0
    donors.forEach((item) => {
      const categoryValue = pmtCategoryMap.get(item.category.toLowerCase())
      if (categoryValue) {
        totalSelfSum += categoryValue
      }
    })
    setSelfTotal(totalSelfSum)
  }


  useEffect(() => {
    if (type === 'donors') {
      setAgentsList(undefined)
      listDonors()
    } else if (type === 'agents') {
      setDonorsList(undefined)
      setFilteredDonors(undefined)
      listAgents()
    } else if (type === 'self') {
      setAgentsList(undefined)
      setDonorsList(undefined)
      renderSelfDonors()
    } else {
      listDonors()
    }
  }, [type])

  useEffect(() => {
    if (filterCard) {
      const filter = filterCard.toLowerCase()
      if (type === 'self') {
        renderSelfDonors(filter)
      } else {
        listDonors(filter)
      }

    }

  }, [filterCard])

  useEffect(() => {
    if (filterDate) {
      const periodFilter = generateStartEndEpochs(filterDate)
      listDonors(undefined, periodFilter.start, periodFilter.end)
    }
  }, [filterDate])

  useEffect(() => {
    if (filterStatus) {
      const status = filterStatus === 'active' ? true : filterStatus === 'inactive' ? false : ''
      getFilteredStatus(status)
    }
  }, [filterStatus])


  useEffect(() => {
    setAdminName(window.localStorage.getItem('adminName'))
  }, [])

  useEffect(() => {
    getSum()
  }, [])

  useEffect(() => {
    if (agentsList) {
      const totalAgentAmountRaised: number = agentsList.reduce(
        (accumulator, currentAgent) => accumulator + parseInt(currentAgent.totalraised),
        0
      )
      setAgentTotal(totalAgentAmountRaised)
    }
  }, [agentsList])

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
                  {donorsList && type === 'donors' ? <span>GHS {totalSum.toFixed(2)}</span> : donorsList && type === 'self' ? <span>GHS {selfTotal.toFixed(2)}</span> : ''}
                  {agentsList && <span>GHS {agentTotal.toFixed(2)}</span>}
                  {/* {type === 'self' && <span>GHS {selfTotal.toFixed(2)}</span>} */}
                </h3>
              </div>
            </div>
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
              {donorsList && type === 'donors' ? <span>GHS {totalSum.toFixed(2)}</span> : donorsList && type === 'self' ? <span>GHS {selfTotal.toFixed(2)}</span> : ''}
              {agentsList && <span>GHS {agentTotal.toFixed(2)}</span>}
              {/* {type === 'self' && <span>GHS {selfTotal.toFixed(2)}</span>} */}
            </h3>
          </div>
        </div>
      </div>

      <div className="mt-20 md:mt-8 px-4 md:px-10 w-full flex flex-col">
        {/* Page Heading */}

        <div className="flex flex-row items-center justify-start space-x-2 sm:space-x-4 mb-4">
          <button
            className={
              `bg-emerald-900 ring-1 ring-emerald-400 text-white rounded-md w-auto px-6 py-2
              ${type === 'donors' ? 'bg-emerald-800 text-zinc-400' : ''}
              `
            }
            value="donors"
            type="button"
            onClick={showContent}
          >
            Donors
          </button>
          <button
            className={
              `bg-emerald-900 ring-1 ring-emerald-400 text-white rounded-md w-auto px-6 py-2
              ${type === 'agents' ? 'bg-emerald-800 text-zinc-400' : ''}
              `
            }
            value="agents"
            type="button"
            onClick={showContent}
          >
            Agents
          </button>
          <button
            className={
              `bg-emerald-900 ring-1 ring-emerald-400 text-white rounded-md w-auto px-6 py-2
              ${type === 'self' ? 'bg-emerald-800 text-zinc-400' : ''}
              `
            }
            value="self"
            type="button"
            onClick={showContent}
          >
            Self
          </button>
        </div>

        {/* Content area */}
        <div className="flex flex-col md:flex-row md:space-x-3 w-full">

          <div className="flex flex-col w-full">
            {/* Table nav and filter visible at xs and sm */}
            <div className="w-full bg-gray-800 flex lg:hidden flex-col items-center justify-center">
              {!agentsList && <>
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
                {type !== 'self' && <Select
                  onValueChange={handleDateChange}
                  defaultValue={searchParams.get('category')?.toString()}>
                  <SelectTrigger className="w-full text-white border-0 rounded-none" role="button">
                    <span className="inline-block mr-2">{filterDatePrefix}</span>
                    <SelectValue placeholder=" Select Period" aria-placeholder="Select Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem className="pl-3 py-2" value="7">7 days ago</SelectItem>
                      <SelectItem className="pl-3 py-2" value="15">15 days ago</SelectItem>
                      <SelectItem className="pl-3 py-2" value="30">30 days ago</SelectItem>
                      <SelectItem className="pl-3 py-2" value="60">60 days ago</SelectItem>
                      <SelectItem className="pl-3 py-2" value="90">90 days ago</SelectItem>
                      <SelectItem className="pl-3 py-2" value="all">Show all</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>}
              </>}

            </div>
            {/* Table Nav and Filter visible from lg up */}
            <div className="hidden w-full lg:flex lg:flex-row bg-gray-800 p-2.5 items-center justify-between">
              {!agentsList && <Select
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
              </Select>}
              <div className="flex flex-row items-center">
                {!agentsList && <Select
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
                </Select>}
                {!agentsList && type !== 'self' && <Select
                  onValueChange={handleDateChange}
                  defaultValue={filterDate}>
                  <SelectTrigger className="w-auto text-white border-0 rounded-none" role="button">
                    <span className="inline-block mr-2">{filterDatePrefix}</span>
                    <SelectValue placeholder=" Select Period" aria-placeholder="Select Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem className="pl-3 py-2" value="7">7 days ago</SelectItem>
                      <SelectItem className="pl-3 py-2" value="15">15 days ago</SelectItem>
                      <SelectItem className="pl-3 py-2" value="30">30 days ago</SelectItem>
                      <SelectItem className="pl-3 py-2" value="60">60 days ago</SelectItem>
                      <SelectItem className="pl-3 py-2" value="90">90 days ago</SelectItem>
                      <SelectItem className="pl-3 py-2" value="all">Show all</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>}
              </div>
            </div>


            <div className="w-full flex flex-col items-center">
              {isLoading && <div className="h-screen w-full flex flex-col items-center justify-center text-white">
                <RotateCw className="animate-spin" />
              </div>}
              {noDataMsg && <div className="flex flex-row items-center justify-center text-zinc-300 py-4">
                <p>{noDataMsg}</p>
              </div>}
              <ul className="flex flex-col items-start justify-start w-full px-2.5">
                {filteredDonors && filteredDonors.map((donor, idx) => (
                  <li key={idx}
                    onPointerDown={() => {
                      setPointHasDown(true)
                    }}
                    onClick={() => {
                      if (pointHasDown) {
                        setPointHasDown(false)
                        showDonorReport(donor.id)
                      }
                    }}
                    className="hover:cursor-pointer flex flex-col md:flex-row w-full md:items-center justify-between border-b border-b-gray-300 pt-5 pb-2"
                  >
                    <p className="basis-5/12 lg:basis-2/12 font-normal text-base">
                      <span className="text-white capitalize">{donor.name}</span>
                      <span className="flex lg:hidden capitalize text-xs text-white">{donor.category} Card</span>
                      <span className={
                        `flex lg:hidden text-sm uppercase font-light
                         ${donor.active ? 'text-green-600' : 'text-red-600'}
                        `}
                      >
                        {donor.active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </p>
                    <p className="hidden basis-1/12 text-zinc-400 font-light capitalize text-sm lg:flex">{donor.category} Card</p>
                    <p className={
                      `hidden basis-2/12 uppercase text-zinc-500 font-light mr-6 text-sm lg:flex
                    `}>{formatId(donor.id)}</p>
                    <p className={
                      `lg:flex hidden text-sm uppercase font-light
                      ${donor.active ? 'text-green-600' : 'text-red-600'}
                      `}
                    >
                      {donor.active ? 'ACTIVE' : 'INACTIVE'}
                    </p>
                    <p className={
                      `basis-3/12 lg:basis-2/12 font-semibold text-sm text-zinc-400
                    `
                    }>{format(new Date(donor.createdon * 1000), 'do MMM, yyyy')}</p>
                    <h2
                      className="basis-3/12 lg:basis-2/12 rounded-lg w-auto py-2 text-2xl flex flex-row justify-start items-center font-bold text-emerald-400">
                      {pmtCategoryMap.get(donor.category)}
                      {/* <ChevronRight size={16} /> */}
                    </h2>
                  </li>
                ))}

                {agentsList && agentsList.map((agent, idx) => (
                  <li key={idx}
                    onPointerDown={() => {
                      setPointHasDown(true)
                    }}
                    onClick={() => {
                      if (pointHasDown) {
                        setPointHasDown(false)
                        showDetails(agent.id)
                      }
                    }}
                    className="flex flex-col md:flex-row w-full md:items-center justify-between border-b border-b-gray-300 pt-5 pb-2"
                  >
                    <p className="basis-5/12 lg:basis-3/12 font-normal text-base">
                      <span className="text-white capitalize">{agent.name}</span>
                      <span className="flex lg:hidden capitalize text-xs text-white">{agent.id}</span>
                      {/* <span className={
                        `flex lg:hidden text-sm uppercase font-light
                         text-green-600
                        `}
                      >
                        ACTIVE
                      </span> */}
                    </p>
                    {/* <p className="hidden basis-2/12 text-zinc-400 font-light capitalize text-sm lg:flex">{donor.category} Card</p> */}
                    <p className={
                      `hidden basis-2/12 uppercase text-zinc-500 font-light mr-6 text-sm lg:flex
                    `}>{formatId(agent.id)}</p>
                    <p className={
                      `lg:flex hidden text-sm uppercase font-light
                         text-green-600
                        `}
                    >
                      { }
                    </p>
                    <p className={
                      `basis-3/12 lg:basis-2/12 font-semibold text-sm text-zinc-400
                    `
                    }>{format(new Date(agent.createdon * 1000), 'do MMM, yyyy')}</p>
                    <h2
                      className="basis-3/12 lg:basis-2/12 rounded-lg w-auto py-2 text-2xl flex flex-row justify-start items-center font-bold text-emerald-400">
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
