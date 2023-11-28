import { formatId } from "@/utils/constants"
import { getDonorReports } from "@/utils/data"
import { format } from "date-fns"
import { ChevronLeft, RotateCw } from "lucide-react"
import { useEffect, useState } from "react"
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom"

export default function DonorReports() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const id = searchParams.get("id") ?? undefined
  const [isLoading, setIsLoading] = useState(false)
  const [donorReport, setDonorReport] = useState<Array<{
    userid: string;
    category: string;
    name: string;
    amount: number;
    purpose: string;
    createdon: EpochTimeStamp;
  }> | undefined>(undefined)
  const [noDataMsg, setNoDataMsg] = useState<string | undefined>(undefined)
  const [adminName, setAdminName] = useState<string | null>(null)
  const [pointHasDown, setPointHasDown] = useState(false)
  const [reportTotal, setReportTotal] = useState(0)

  const showDonorDetails = (id: string) => {
    const params = { id: id }
    navigate({
      pathname: '/donordetails',
      search: `?${createSearchParams(params)}`
    })
  }


  const listDonorReport = async (id: string) => {
    setIsLoading(true)
    const data = await getDonorReports(id)
    if (!data) {
      setIsLoading(false)
      setDonorReport(undefined)
      setNoDataMsg('No available reports for this donor')
    } else {
      setIsLoading(false)
      const donorData = data.report
      if (donorData === null || donorData === undefined) {
        setNoDataMsg('No available reports for this donor')
      }
      donorData.sort((a, b) => (b.createdon * 1000) - (a.createdon * 1000))
      setDonorReport(donorData)
      setReportTotal(data.total)
    }
  }

  useEffect(() => {
    setAdminName(window.localStorage.getItem('adminName'))
  }, [])

  useEffect(() => {
    if (id) {
      listDonorReport(id)
    }
  }, [id])
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
              Total Amount Raised:
            </h3>
            <h3 className="text-3xl sm:text-4xl font-bold text-red-600">

              <span>GHS {reportTotal.toFixed(2)}</span>
              {/* {type === 'self' && <span>GHS {selfTotal.toFixed(2)}</span>} */}
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


            <div className="w-full flex flex-col items-center">
              {isLoading && <div className="h-screen w-full flex flex-col items-center justify-center text-white">
                <RotateCw className="animate-spin" />
              </div>}
              {noDataMsg && <div className="flex flex-row items-center justify-center text-zinc-300 py-4">
                <p>{noDataMsg}</p>
              </div>}
              <ul className="flex flex-col items-start justify-start w-full px-2.5">
                {donorReport && donorReport.map((donor, idx) => (
                  <li key={idx}
                    onPointerDown={() => {
                      setPointHasDown(true)
                    }}
                    onClick={() => {
                      if (pointHasDown) {
                        setPointHasDown(false)
                        showDonorDetails(donor.userid)
                      }
                    }}
                    className="hover:cursor-pointer flex flex-col md:flex-row w-full md:items-center justify-between border-b border-b-gray-300 pt-5 pb-2"
                  >
                    <p className="basis-5/12 lg:basis-2/12 font-normal text-base">
                      <span className="text-white capitalize">{donor.name}</span>
                      <span className="flex lg:hidden capitalize text-xs text-white">{donor.category} Card</span>

                    </p>
                    <p className="hidden basis-1/12 text-zinc-400 font-light capitalize text-sm lg:flex">{donor.category} Card</p>
                    <p className={
                      `hidden basis-2/12 uppercase text-zinc-500 font-light mr-6 text-sm lg:flex
                    `}>{formatId(donor.userid)}</p>
                    <p className={
                      `lg:flex hidden text-sm capitalize font-light text-zinc-400
                      `}
                    >
                      {donor.purpose}
                    </p>
                    <p className={
                      `basis-3/12 lg:basis-2/12 font-semibold text-sm text-zinc-400
                    `
                    }>{format(new Date(donor.createdon * 1000), 'do MMM, yyyy')}</p>
                    <h2
                      className="basis-3/12 lg:basis-2/12 rounded-lg w-auto py-2 text-2xl flex flex-row justify-start items-center font-bold text-emerald-400">
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
  )
}