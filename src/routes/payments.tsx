import { useToast } from "@/components/ui/use-toast";
import { PaymentDTO, PaystackResponse, RegisteredUser, formatId, pmtCategoryMap, trxCurr } from "@/utils/constants";
import { activateUser, getUser, recordPayment } from "@/utils/data";
import { ChevronRight, QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import { PaystackButton } from 'react-paystack'
import { useSearchParams } from "react-router-dom";



export default function PaymentsPage() {
  const { toast } = useToast()
  const [searchParams] = useSearchParams()
  const [activeUser, setActiveUser] = useState<RegisteredUser | undefined>()
  const [pmtSuccess, setPmtSuccess] = useState(false)
  const [userCreated, setUserCreated] = useState(false)
  const userID = searchParams.get('id') ?? ''
  const category = searchParams.get('category') ?? ''
  const applicantName = searchParams.get('name') ?? ''
  const issDate = searchParams.get('isd') ?? ''

  const runAll = async (userid: string, amount: number, transactionid: string) => {
    const pmtPayload: PaymentDTO = {
      userid: userid,
      amount: amount,
      transactionid: transactionid,
      purpose: "registration"
    }
    const [recPmt, actUsr] = await Promise.all([
      recordPayment(pmtPayload),
      activateUser(userid)
    ])
    if (recPmt === 200) {
      setPmtSuccess(true)
    }
    if (actUsr === 200) {
      setUserCreated(true)
    }
  }

  const getActiveUser = async (id: string) => {
    const response = await getUser(id)
    setActiveUser(response)
  }

  const cost = pmtCategoryMap.get(category)
  const actualAmount = cost ? cost * 100 : 0
  const paymentDetails = {
    publicKey: import.meta.env.VITE_PAYSTACK_LIVE,
    email: `${userID}@ndcspecial.com`,
    amount: actualAmount,
    label: 'Card Registration',
    text: 'Make Payment',
    currency: trxCurr,
    onClose: function () {
      alert('Payment will not be processed if you close this view')
    },
    onSuccess: (response: PaystackResponse) => {
      // change amount for actual amount sent from form
      runAll(userID, cost ?? 0, response.trxref)
    }
  }



  useEffect(() => {
    getActiveUser(userID)
  }, [userID])

  useEffect(() => {
    if (pmtSuccess || userCreated) {
      toast({
        variant: "default",
        title: "Great! Payment successful",
        description: "Your contribution was successfully made. Your card will be printed and sent you your regional head office."
      })
    }
  }, [pmtSuccess, userCreated, toast])
  return (
    <div className="w-full mt-16 lg:mt-0 h-screen  flex flex-col items-center bg-gray-100/90 overflow-auto pb-28">

      <div className="w-full lg:container mx-auto flex flex-col lg:flex-row lg:space-x-3 space-x-0 my-auto px-4 lg:px-0">
        <div className="basis-full lg:basis-1/2 w-full flex flex-col items-center mt-7">
          <div className="w-full lg:w-4/5 mx-auto flex flex-col items-center mt-5 mb-3">
            <h3 className="text-center text-2xl font-semibold">Complete Payment</h3>
            <p className="text-center text-sm text-gray-500 mt-4">Please confirm that the details below are correct and proceed with payment</p>
          </div>
          <div className="w-full lg:w-4/5 mx-auto flex flex-col items-start bg-ndcgreen/20 rounded-md p-8">
            <div className="flex flex-row justify-start items-center w-full space-x-12 mb-4">
              <p className="w-12 text-sm font-bold uppercase text-gray-700">Name:</p>
              <p className='text-sm capitalize'>{applicantName}</p>
            </div>
            <div className="flex flex-row justify-start items-center w-full space-x-12 mb-4">
              <p className="w-12 text-sm font-bold uppercase text-gray-700">Category:</p>
              <p className="text-sm capitalize">{category}</p>
            </div>
            <div className="flex flex-row justify-start items-center w-full space-x-12">
              <p className="w-12 text-sm font-bold uppercase text-gray-700">Amount:</p>
              <p className="text-sm">GHS {cost}</p>
            </div>
          </div>
          {/* {activeUser?.active ? (
            <button></button>
          ): (
              <PaystackButton {...paymentDetails} className="p-4 text-base bg-ndcgreen rounded-sm shadow-md mt-6 w-full lg:w-4/5 mx-auto text-white" /> 
          )} */}
          {pmtSuccess && userCreated ? (
            <h3 className="mt-7 font-bold text-ndcgreen">Your account has been registered and payment recorded</h3>
          ) : (
            null
          )}
          {!pmtSuccess && !userCreated && !activeUser?.active ? (<PaystackButton {...paymentDetails} className="p-4 text-base bg-ndcgreen rounded-sm shadow-md mt-6 w-full lg:w-4/5 mx-auto text-white" />) : null}
        </div>

        {/* Virtual Card info */}
        <div className="basis-full mt-6 lg:basis-1/2 w-full flex flex-col justify-between items-center">
          <div className="w-full lg:w-4/5 mx-auto my-5 items-center flex flex-col">
            <h3 className="text-center text-2xl font-semibold">Your Virtual Card</h3>
            <p className="text-center text-sm text-gray-500 mt-4">Preview your card with the option of saving a copy using the button below</p>
          </div>
          <div className={`bg-ndcgreen rounded-lg w-full lg:w-4/5 h-86 mx-auto py-6 px-7 bg-[url('/${category === 'prestige plus' ? 'prestige_plus' : category}_card.jpeg')] bg-cover bg-center shadow-lg flex flex-col justify-between`}>
            <div className="flex justify-between items-start">
              <div className="flex flex-col items-start justify-start">
                <h6 className="uppercase text-xs text-gray-50">Good Governance Card</h6>
                <h2 className="uppercase font-extrabold leading-4 tracking-widest text-center text-white my-1">{category.toUpperCase()}</h2>
                <h3 className="uppercase  font-medium leading-4 text-xs mt-0.5 text-center text-white">Donor</h3>
                <div className="bg-gray-50 h-[24px] w-[24px] flex flex-col items-center justify-center mt-4">
                  <QrCode />
                </div>
              </div>
              <img alt="logo" width="28" height="25" src="/ndc_card_logo.png" />
            </div>
            <div className="mt-3">
              <div className="mt-3 mb-1">
                <h3 className="uppercase text-3xl font-bold -ml-1 tracking-widest leading-8 text-white">{formatId(userID)}</h3>
                <div className="mt-8 flex items-center flex-row w-full justify-start -ml-1">
                  <p className="text-[11px] font-semibold  uppercase mr-0.5 text-gray-200">issue date</p>
                  <ChevronRight size={16} strokeWidth={3} className="text-sm mr-1 text-gray-200" />
                  <h3 className="uppercase text-[12px] font-bold  tracking-wide ml-0.5 text-sm text-gray-200">{issDate}</h3>
                </div>
                <div className="h-[28px]">
                  <h2 className="uppercase text-lg -ml-1 font-bold tracking-widest text-white">{applicantName}</h2>
                </div>
              </div>
            </div>
            <h1 className="uppercase font-extrabold text-lg text-right font-sans mt-0 mr-1 text-gray-50">NDC</h1>
          </div>
          <button className="p-4 text-base bg-gray-100 hover:bg-ndcgreen hover:text-white text-ndcgreen ring-2 ring-ndcgreen rounded-sm shadow-md mt-8 w-full lg:w-4/5 mx-auto">Save To PDF</button>
        </div>
      </div>
    </div>
  )
}