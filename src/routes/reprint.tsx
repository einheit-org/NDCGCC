import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import MainNav from "@/components/widgets/MainNav";
import { PaymentDTO, PaystackResponse, RegisteredUser, reprintSchema, trxCurr } from "@/utils/constants";
import { getUser, issueCardReprint, recordPayment } from "@/utils/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { PaystackButton } from "react-paystack";
import { Link } from "react-router-dom";
import { z } from "zod";

// payment purpose
// { purpose: 'reprint' }
/**
 * get user details via /user
 * if requestCard field is false enable button/ else disable with message
 * specify a fee for reprinting (use hardcoded- value for now)
 * trigger payment via paystack
 * record payment at /payment onSuccess
 * 
 */
export default function Reprint() {
  const initialValues = useMemo(() => {
    return {
      id: ""
    }
  }, [])
  const reprintForm = useForm<z.infer<typeof reprintSchema>>({
    resolver: zodResolver(reprintSchema),
    defaultValues: initialValues
  })
  const { toast } = useToast()
  const [currentUser, setCurrentUser] = useState<RegisteredUser | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [hasRequestedCard, setHasRequestedCard] = useState(false)
  const [pmtSuccess, setPmtSuccess] = useState(false)
  const [reprintFormErrors, setReprintFormErrors] = useState(false)


  const handleCardReprint = async (id: string, trxid: string) => {
    const pmtPayload: PaymentDTO = {
      userid: id,
      amount: 0.5,
      transactionid: trxid,
      purpose: "reprint"
    }
    const [recPmt, sendReprint] = await Promise.all([
      recordPayment(pmtPayload),
      issueCardReprint(id)
    ])

    if (recPmt === 200 && sendReprint === 200) {
      setPmtSuccess(true)
      setHasRequestedCard(true)
    }
  }
  // TODO: set amount to actual amount for reprinting
  const paymentDetails = {
    publicKey: import.meta.env.VITE_PAYSTACK_LIVE,
    email: `${currentUser?.id}@ndcspecial.com`,
    amount: 50,
    label: 'Card Reprint',
    text: 'Make Payment',
    currency: trxCurr,
    onClose: function () {
      alert('Payment will not be processed if you close this view')
    },
    onSuccess: (response: PaystackResponse) => {
      const userid = currentUser?.id ?? ''
      handleCardReprint(userid, response.trxref)
    }
  }

  const getUserDetails = async (values: z.infer<typeof reprintSchema>) => {
    setIsLoading(true)
    const response = await getUser(values.id)
    if (response) {
      setIsLoading(false)
      setCurrentUser(response)
    } else {
      setIsLoading(false)
      setReprintFormErrors(true)
      toast({
        variant: "destructive",
        title: "Sorry! Something went wrong",
        description: "There was a problem. Please try again"
      })
    }
  }

  useEffect(() => {
    if (reprintFormErrors) {
      reprintForm.reset(initialValues)
    }
  }, [reprintForm, initialValues, reprintFormErrors])

  useEffect(() => {
    if (currentUser?.requestcard) {
      reprintForm.reset(initialValues)
    }
  }, [reprintForm, initialValues, currentUser])

  useEffect(() => {
    if (pmtSuccess && hasRequestedCard) {
      reprintForm.reset(initialValues)
      toast({
        variant: "default",
        title: "Great! Payment successful",
        description:
          "Your payment was successfully made. Your card will be printed and sent you your regional head office.",
      });
    }
  }, [pmtSuccess, hasRequestedCard, toast, reprintForm, initialValues])

  return (
    <div className="bg-ndcgreen/90 w-full min-h-screen">
      <MainNav />
      {/* <div className="flex flex-row justify-start items-center">
        <Link
          to="/"
          className="w-12 h-12 rounded-full bg-black text-white flex flex-col items-center justify-center"
        >
          <ArrowLeft />
        </Link>
      </div> */}
      <div className="__className_061548 container mx-auto px-1 h-full py-20">
        {/* <div className="mx-auto bg-white/80 rounded-full mb-4   p-5 h-[96px] w-[96px] md:w-[128px] md:h-[128px] flex items-center justify-center">
          <img
            alt=""
            loading="lazy"
            width="461"
            height="541"
            decoding="async"
            data-nimg="1"
            src="/logo.png"
          />
        </div> */}
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-5/12 px-4 ">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg bg-white/90 border-0 pt-5">
              <h6 className="text-ndcred/80 text-xl font-bold uppercase text-center">
                Card Reprint Request
              </h6>
              <hr className="mt-2 border-b-1 border-green-700 mx-10" />
              <div className="flex-auto px-4 lg:px-10 py-10 pt-5">
                <Form {...reprintForm}>
                  <form onSubmit={reprintForm.handleSubmit(getUserDetails)} onChange={() => setReprintFormErrors(false)}>
                    <div className="relative w-full mb-4">
                      <FormField
                        name="id"
                        control={reprintForm.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block uppercase text-black text-xs font-bold mb-2">Card ID</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="text"
                                placeholder="Please enter your Card ID"
                                name='id'
                                className="placeholder:text-sm w-full rounded-md py-4 h-10 text-sm px-4 mt-2 bg-white"
                              />
                            </FormControl>
                            <FormDescription className="text-red-600 text-sm">{reprintForm.formState.errors.id?.message ?? ''}</FormDescription>
                          </FormItem>

                        )}
                      />
                    </div>
                    <div className="text-center mt-5">
                      {!currentUser && <button
                        type="submit"
                        className="mx-auto w-full flex flex-row items-center justify-center uppercase bg-gradient-to-r from-ndcgreen to-ndcgreen/60  hover:from-ndcred hover:to-ndcred/50 text-white font-bold py-3 px-8 shadow-lg"
                      >
                        {isLoading ? (<RotateCw className="animate-spin" />) : (<span>Get Details</span>)}
                      </button>}
                      {((currentUser && !currentUser.requestcard) && !hasRequestedCard) && <PaystackButton {...paymentDetails} className="mx-auto w-full uppercase bg-gradient-to-r from-ndcgreen to-ndcgreen/60  hover:from-ndcred hover:to-ndcred/50 text-white font-bold py-3 px-8 shadow-lg" />}
                      {((currentUser && currentUser.requestcard) || (hasRequestedCard && pmtSuccess)) && (
                        <div>
                          <p className="text-sm mb-4 uppercase text-gray-600">You have requested for a reprint. Please contact your regional head office for more information.</p>
                          <Link to={'/'} className="mx-auto w-full flex flex-row items-center justify-center uppercase bg-gradient-to-r from-ndcgreen to-ndcgreen/60  hover:from-ndcred hover:to-ndcred/50 text-white font-bold py-3 px-8 shadow-lg">Return to Homepage</Link>
                        </div>
                      )}

                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}