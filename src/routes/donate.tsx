import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import MainNav from "@/components/widgets/MainNav";
import { PaymentDTO, PaystackResponse, paystackPK, reprintSchema, trxCurr } from "@/utils/constants";
import { getOutstandingPayments, recordPayment } from "@/utils/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { PaystackButton } from "react-paystack";
import { Link } from "react-router-dom";
import { z } from "zod";

/**
 * get outstanding details via /outstanding
 * if outstanding is zero, nothing doing
 * else trigger payment based outstanding
 * trigger payment via paystack
 * record payment at /payment onSuccess
 * add purpose: outstanding to above call
 * reset on complete
 */
export default function Donate() {
  const initialValues = useMemo(() => {
    return {
      id: ""
    }
  }, [])
  const { toast } = useToast()
  const [donateFormErrors, setDonateFormErrors] = useState(false)
  const donateForm = useForm<z.infer<typeof reprintSchema>>({
    resolver: zodResolver(reprintSchema),
    defaultValues: initialValues
  })
  const [outstandingInfo, setOutstandingInfo] = useState<{ id: string, outstanding: number }>()
  const [isLoading, setIsLoading] = useState(false)
  const [pmtSuccess, setPmtSuccess] = useState(false)

  const getUserOutstanding = async (values: z.infer<typeof reprintSchema>) => {
    setIsLoading(true)
    const response = await getOutstandingPayments(values.id)
    if (response) {
      setIsLoading(false)
      setOutstandingInfo(response)
    } else {
      setIsLoading(false)
      setDonateFormErrors(true)
      toast({
        variant: "destructive",
        title: "Sorry! Something went wrong",
        description: "There was a problem. Please try again"
      })
    }
  }

  const runTrx = async (userid: string, amount: number, transactionid: string) => {
    const pmtPayload: PaymentDTO = {
      userid: userid,
      amount: amount,
      transactionid: transactionid,
      purpose: "outstanding"
    }

    const recordPmt = await recordPayment(pmtPayload)
    if (recordPmt === 200) {
      setPmtSuccess(true)
    }
  }

  const paymentDetails = {
    publicKey: paystackPK,
    email: `${outstandingInfo?.id}@ndcspecial.com`,
    amount: outstandingInfo ? outstandingInfo.outstanding * 100 : 0,
    label: 'Outstanding Payments',
    text: 'Make Payment',
    currency: trxCurr,
    onClose: function () {
      toast({
        variant: "destructive",
        title: "Are you sure?",
        description: "Closing this will stop your payment from processing"
      })
    },
    onSuccess: (response: PaystackResponse) => {
      runTrx(outstandingInfo?.id ?? '', outstandingInfo?.outstanding ?? 0, response.trxref)
    }
  }

  useEffect(() => {
    if (donateFormErrors) {
      donateForm.reset(initialValues)
    }
  }, [donateFormErrors, donateForm, initialValues])

  useEffect(() => {
    if (pmtSuccess) {
      toast({
        variant: "default",
        title: "Great! Payment successful",
        description: "Your contribution was successfully made."
      })
    }
  }, [pmtSuccess, toast])

  useEffect(() => {
    if (outstandingInfo?.outstanding === 0) {
      donateForm.reset(initialValues)
    }
  }, [donateForm, initialValues, outstandingInfo])

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
      <div className="__className_061548 container mx-auto px-1 h-full  py-20">
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
                Good Governance Card Donation
              </h6>
              <hr className="mt-2 border-b-1 border-green-700 mx-10" />
              <div className="flex-auto px-4 lg:px-10 py-10 pt-5">
                <Form {...donateForm}>
                  <form onSubmit={donateForm.handleSubmit(getUserOutstanding)} onChange={() => setDonateFormErrors(false)}>
                    <div className="relative w-full mb-4">
                      <FormField
                        name="id"
                        control={donateForm.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block uppercase text-black text-xs font-bold mb-2">Card ID</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="text"
                                placeholder="Please enter your Card ID"
                                name="id"
                                className="placeholder:text-sm w-full rounded-md py-4 h-10 text-sm px-4 mt-2 bg-white"
                              />
                            </FormControl>
                            <FormDescription className="text-red-600 text-sm">{donateForm.formState.errors.id ? donateForm.formState.errors.id.message : null}</FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="text-center mt-5">
                      {outstandingInfo && outstandingInfo.outstanding > 0 && <PaystackButton {...paymentDetails} className="mx-auto w-full uppercase bg-gradient-to-r from-ndcgreen to-ndcgreen/60  hover:from-ndcred hover:to-ndcred/50 text-white font-bold py-3 px-8 shadow-lg" />}
                      {!outstandingInfo && <button
                        type="submit"
                        className="disabled:opacity-70 mx-auto flex flex-row items-center justify-center w-full uppercase bg-gradient-to-r from-ndcgreen to-ndcgreen/40  hover:from-ndcred hover:to-ndcred/30 text-white font-bold py-3 px-8 shadow-lg"
                      >
                        {isLoading ? (<RotateCw className="animate-spin" />) : (<span>Get Details</span>)}
                      </button>}
                      {outstandingInfo && outstandingInfo.outstanding === 0 && <div>
                        <p className="text-sm mb-4 uppercase text-gray-600">You do not have any outstanding payments at the moment. Please return to the homepage.</p>
                        <Link to={'/'} className="mx-auto w-full flex flex-row items-center justify-center uppercase bg-gradient-to-r from-ndcgreen to-ndcgreen/60  hover:from-ndcred hover:to-ndcred/50 text-white font-bold py-3 px-8 shadow-lg">Return to Homepage</Link>
                      </div>}
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
