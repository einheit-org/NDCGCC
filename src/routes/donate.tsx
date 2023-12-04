import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { OutstandingType, useGetOutstanding } from "@/hooks/useGetOutstanding";
import { useRecordPayments } from "@/hooks/useRecordPayments";
import { PaymentDTO, PaystackResponse, reprintSchema, trxCurr } from "@/utils/constants";
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
  const { mutate, isPending } = useGetOutstanding()
  const { mutate: recordPmtMutate, isPending: recordPaymentPending } = useRecordPayments()
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

  const [outstandingInfo, setOutstandingInfo] = useState<OutstandingType | undefined>()
  const [pmtSuccess, setPmtSuccess] = useState(false)

  const onSubmit = (values: z.infer<typeof reprintSchema>) => {
    mutate(values, {
      onSuccess: (response) => {
        setOutstandingInfo(response)
      }
    })
  }

  const runTrx = async (userid: string, amount: number, transactionid: string) => {
    const pmtPayload: PaymentDTO = {
      userid: userid,
      amount: amount,
      transactionid: transactionid,
      purpose: "outstanding"
    }
    recordPmtMutate(pmtPayload, {
      onSuccess: () => {
        setPmtSuccess(true)
      },
      onError: (error) => {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: `${error.message}`
        })
      }
    })

    // const recordPmt = await recordPayment(pmtPayload)
    // if (recordPmt === 200) {
    //   setPmtSuccess(true)
    // }
  }

  const paymentDetails = {
    publicKey: import.meta.env.VITE_PAYSTACK_LIVE,
    email: `${outstandingInfo?.id}@ndcspecial.com`,
    amount: outstandingInfo ? outstandingInfo.total * 100 : 0,
    label: 'Outstanding Payments',
    text: recordPaymentPending ? 'Processing....' : 'Make Payment',
    currency: trxCurr,
    onClose: function () {
      toast({
        variant: "destructive",
        title: "Are you sure?",
        description: "Closing this will stop your payment from processing"
      })
    },
    onSuccess: (response: PaystackResponse) => {
      runTrx(outstandingInfo?.id ?? '', outstandingInfo?.total ?? 0, response.trxref)
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
      donateForm.reset(initialValues)
      setOutstandingInfo(undefined)
    }
  }, [pmtSuccess, toast])

  useEffect(() => {
    if (outstandingInfo?.total === 0) {
      donateForm.reset(initialValues)
    }
  }, [donateForm, initialValues, outstandingInfo])

  return (
    <div className="bg-white/90 w-full min-h-screen">
      <div className="pt-20 text-center w-full">
        <h2 className="mt-5 text-2xl text-ndcred font-semibold">Check Arrears</h2>
      </div>
      <div className="container mx-auto px-1 h-full flex flex-col lg:flex-row">
        <div className="flex basis-full lg:basis-2/6">
          <div className="w-full px-4">
            <div className="flex-auto px-4 lg:px-10 py-10 bg-white rounded-lg mt-8">
              <p className="text-ndcgreen/70 text-sm pb-6">Enter your ID to retrieve information about your registration fees and monthly dues.</p>
              <Form {...donateForm}>
                <form onSubmit={donateForm.handleSubmit(onSubmit)} onChange={() => setDonateFormErrors(false)}>
                  <div className="w-full mb-4">
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
                    <button
                      type="submit"
                      className="rounded-lg disabled:opacity-70 mx-auto flex flex-row items-center justify-center w-full uppercase bg-gradient-to-r from-ndcgreen to-ndcgreen/40  hover:from-ndcred hover:to-ndcred/30 text-white font-bold py-3 px-8 shadow-lg"
                    >
                      {isPending ? (<RotateCw className="animate-spin" />) : (<span>Get Details</span>)}
                    </button>
                    {outstandingInfo && outstandingInfo.total === 0 && <div>
                      <p className="text-sm mb-4 uppercase text-gray-600">You do not have any outstanding payments at the moment. Please return to the homepage.</p>
                      <Link to={'/'} className="mx-auto w-full flex flex-row items-center justify-center uppercase bg-gradient-to-r from-ndcgreen to-ndcgreen/60  hover:from-ndcred hover:to-ndcred/50 text-white font-bold py-3 px-8 shadow-lg">Return to Homepage</Link>
                    </div>}
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
        <div className="flex basis-full lg:basis-4/6">
          <div className="w-full px-4">
            {outstandingInfo && outstandingInfo.total !== 0 ? (
              <>
                <div className="flex flex-col space-x-0 lg:space-x-4 space-y-4 lg:space-y-0 lg:flex-row items-start px-4 lg:px-10 py-10 bg-white rounded-lg mt-8 mb-5">
                  {/* <p className="text-ndcgreen/70 text-sm pb-6">Find below a breakdown of your outstanding payments. You can click the button below to make your payments</p> */}
                  <div className="w-full">
                    <p className="font-semibold text-sm uppercase">Total Outstanding</p>
                    <p className="text-3xl font-thin">GHS {outstandingInfo.total ? outstandingInfo.total.toFixed(2) : '0.00'}</p>
                  </div>
                  <div className="w-full">
                    <p className="font-semibold text-sm uppercase">Registration Arrears</p>
                    <p className="text-3xl font-thin">GHS {outstandingInfo.registrationfees ? outstandingInfo.registrationfees.toFixed(2) : '0.00'}</p>
                  </div>
                  <div className="w-full">
                    <p className="font-semibold text-sm uppercase">Monthly Arrears</p>
                    <p className="text-3xl font-thin">GHS {outstandingInfo.monthlyfees ? outstandingInfo.monthlyfees.fees.toFixed(2) : '0.00'}</p>
                    {outstandingInfo.monthlyfees && <p className="text-xs">{outstandingInfo.monthlyfees.months.length} months of arrears</p>}
                  </div>
                </div>
                <PaystackButton {...paymentDetails}
                  className={`
                  rounded-lg mx-auto w-full uppercase bg-gradient-to-r from-ndcgreen to-ndcgreen/60  hover:from-ndcred hover:to-ndcred/50 text-white font-bold py-3 px-8 shadow-lg
                  ${recordPaymentPending ? 'pointer-events-none opacity-50' : ''}
                  `}
                />
              </>
            ) : (
              <div className="w-full pt-8">
                <p className="text-sm mb-4 uppercase text-gray-600">To see any outstanding payments, please enter your ID in the form and click the button provided</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
