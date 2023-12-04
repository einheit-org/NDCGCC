import { useToast } from "@/components/ui/use-toast";
import DonorCard from "@/components/widgets/DonorCard";
import PaymentInfoCard from "@/components/widgets/PaymentInfoCard";
import { useActivateDonor } from "@/hooks/useActivateDonor";
import { useGetActiveUser } from "@/hooks/useGetActiveUser";
import { useRecordPayments } from "@/hooks/useRecordPayments";
import { PaymentDTO, PaystackResponse, pmtCategoryMap, trxCurr } from "@/utils/constants";
import { useEffect, useState } from "react";
import { PaystackButton } from 'react-paystack'
import { useSearchParams } from "react-router-dom";



export default function PaymentsPage() {
  const { mutate: recordPaymentMutation } = useRecordPayments()
  const { mutate: activateDonorMutation } = useActivateDonor()
  const { toast } = useToast()
  const [searchParams] = useSearchParams()
  const [pmtSuccess, setPmtSuccess] = useState(false)
  const [userCreated, setUserCreated] = useState(false)
  const userID = searchParams.get('id') ?? ''
  const category = searchParams.get('category') ?? ''
  const applicantName = searchParams.get('name') ?? ''
  const issDate = searchParams.get('isd') ?? ''
  const { data: activeUser } = useGetActiveUser(userID)

  const runAll = async (payload: PaymentDTO) => {
    recordPaymentMutation(payload, {
      onSuccess: (response) => {
        console.log('response', response)
        setPmtSuccess(true)
        activateDonorMutation(payload.userid, {
          onSuccess: () => {
            setUserCreated(true)
          }
        })
      },
      onError: (error) => {
        console.log('error on mutate', error.message)
        toast({
          variant: "destructive",
          title: "Oops! Something happened",
          description: `Message: ${error.message}`
        })
      }
    })
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
      const payload: PaymentDTO = {
        userid: userID,
        amount: cost ?? 0,
        transactionid: response.trxref,
        purpose: "registration"
      }
      runAll(payload)
    }
  }


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
          <PaymentInfoCard applicantName={applicantName} category={category} cost={cost} />
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
            <p className="text-center text-sm text-gray-500 mt-4">
              Preview your card below
              {/* with the option of saving a copy using the button below */}
            </p>
          </div>
          <DonorCard id={userID} issDate={issDate} donorName={applicantName} card={category} />
          {/* <button className="p-4 text-base bg-gray-100 hover:bg-ndcgreen hover:text-white text-ndcgreen ring-2 ring-ndcgreen rounded-sm shadow-md mt-8 w-full lg:w-4/5 mx-auto">Save To PDF</button> */}
        </div>
      </div>
    </div>
  )
}