import { useToast } from "@/components/ui/use-toast"
import { RegisteredUser, formatId } from "@/utils/constants"
import { getUser } from "@/utils/data"
import { ChevronLeft, RotateCw } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

export default function DonorView() {
  const {toast} = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id") ?? undefined;

  const [adminName, setAdminName] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentDonor, setCurrentDonor] = useState<RegisteredUser | undefined>(undefined)

  const getUserDetails = async (id: string) => {
    const response = await getUser(id)
    setIsLoading(true)
    if (response) {
      setIsLoading(false)
      setCurrentDonor(response)
    } else {
      setIsLoading(false);
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

  useEffect(() => {
    if(id) {
      getUserDetails(id)
    }
  }, [id])
  
  useEffect(() => {
    setAdminName(window.localStorage.getItem('adminName'))
  }, [])

  if (isLoading) {
    return (
      <div className="bg-white flex flex-col items-center bg-[url('/logo_bg.svg')] bg-center bg-no-repeat justify-center md:min-h-screen md:w-full h-screen w-screen overflow-auto">
        <RotateCw className="animate-spin" />
      </div>
    );
  }
  return (
    <div className="bg-zinc-900 w-screen h-screen min-h-full bg-[url('/logo_bg.svg')] bg-center bg-no-repeat overflow-x-hidden overflow-y-auto pb-8">
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
                {/* <h3 className="leading-tight text-xs tracking-tight uppercase font-semibold text-white/90">
                  Total Amount Raised to Date:
                </h3> */}
                <h3 className="text-3xl font-bold text-white">
                  {/* #{donorList ? donorList.length : 0} */}
                  {/* GHS {totalSum.toFixed(2)} */}
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
        {/* <div className="absolute flex flex-row items-center md:hidden -bottom-14 left-4 right-4">
          <div className="flex flex-col items-start w-full h-[91px] bg-gradient-to-b from-[#FFFFFF] to-[#D4D4D8] rounded-lg shadow-lg p-4">
            <h3 className="leading-tight tracking-tight text-sm uppercase font-bold">
              Total Amount Raised to Date:
            </h3>
            <h3 className="text-3xl sm:text-4xl font-bold text-red-600">
              GHS {totalSum.toFixed(2)}
            </h3>
          </div>
        </div> */}
      </div>

      <div className="mt-20 md:mt-8 px-4 md:px-10 w-full flex flex-col items-center justify-center">
        {/* Page Heading */}
        

        {/* Content area */}
        <div className="flex flex-row items-center justify-center md:flex-row md:space-x-3 w-full">

          <div className="flex flex-col md:w-4/5 lg:w-2/5 mx-auto w-full px-3 md:px-0 bg-white rounded-md pb-8">
            <h2 className="font-bold text-2xl capitalize px-4 pt-8">donor details</h2>
            <ul className="flex flex-col items-start justify-start px-4 pt-8">
              <li className="flex flex-row w-full justify-between items-center py-2">
                <p className="font-bold text-base">Full Name:</p>
                <p className="capitalize">{currentDonor?.fullname}</p>
              </li>
              <li className="flex flex-row w-full justify-between items-center py-2">
                <p className="font-bold text-base">ID:</p>
                <p className="capitalize">{formatId(currentDonor?.id ?? '')}</p>
              </li>
              <li className="flex flex-row w-full justify-between items-center py-2">
                <p className="font-bold text-base">Category:</p>
                <p className="capitalize">{currentDonor?.category}</p>
              </li>
              <li className="flex flex-row w-full justify-between items-center py-2">
                <p className="font-bold text-base">Phone Number:</p>
                <p className="capitalize">{currentDonor?.phonenumber}</p>
              </li>
              <li className="flex flex-row w-full justify-between items-center py-2">
                <p className="font-bold text-base">Gender:</p>
                <p className="capitalize">{currentDonor?.sex}</p>
              </li>
              <li className="flex flex-row w-full justify-between items-center py-2">
                <p className="font-bold text-base">Age Range:</p>
                <p className="capitalize">{currentDonor?.agerange}</p>
              </li>
              <li className="flex flex-row w-full justify-between items-center py-2">
                <p className="font-bold text-base">Residency:</p>
                <p className="capitalize">{currentDonor?.resident}</p>
              </li>
              <li className="flex flex-row w-full justify-between items-center py-2">
                <p className="font-bold text-base">Region:</p>
                <p className="capitalize">{currentDonor?.region}</p>
              </li>
              <li className="flex flex-row w-full justify-between items-center py-2">
                <p className="font-bold text-base">Constituency:</p>
                <p className="capitalize">{currentDonor?.constituency}</p>
              </li>
              <li className="flex flex-row w-full justify-between items-center py-2">
                <p className="font-bold text-base">Industry:</p>
                <p className="capitalize">{currentDonor?.industry}</p>
              </li>
              <li className="flex flex-row w-full justify-between items-center py-2">
                <p className="font-bold text-base">Occupation:</p>
                <p className="capitalize">{currentDonor?.occupation}</p>
              </li>
              <li className="flex flex-row w-full justify-between items-center py-2">
                <p className="font-bold text-base">Active:</p>
                <p className="capitalize">{currentDonor?.active ? 'Yes' : 'No'}</p>
              </li>
            </ul>
          </div>

          
          {/* <div className="hidden lg:flex md:flex-auto lg:w-1/5 md:w-2/5 rounded-lg bg-white flex-col shadow-lg px-2.5 pt-2.5 text-gray-500">
            <h1 className="text-sm">Filter By Card</h1>
          </div> */}
        </div>
      </div>
    </div>
  )
}