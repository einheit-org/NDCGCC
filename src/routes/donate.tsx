import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { OutstandingType, useGetOutstanding } from '@/hooks/useGetOutstanding';
import { useRecordPayments } from '@/hooks/useRecordPayments';
import {
  PaymentDTO,
  PaymentPurpose,
  PaystackResponse,
  reprintSchema,
  trxCurr,
} from '@/utils/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { RotateCw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PaystackButton } from 'react-paystack';
import { Link } from 'react-router-dom';
import { z } from 'zod';

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
  const { mutate, isPending } = useGetOutstanding();
  const { mutate: recordPmtMutate, isPending: recordPaymentPending } =
    useRecordPayments();
  const initialValues = useMemo(() => {
    return {
      id: '',
    };
  }, []);
  const { toast } = useToast();
  const [donateFormErrors, setDonateFormErrors] = useState(false);
  const [paymentPurpose, setPaymentPurpose] = useState<PaymentPurpose>('outstanding');
  const [owedMonths, setOwedMonths] = useState<string[] | undefined>(undefined)
  const donateForm = useForm<z.infer<typeof reprintSchema>>({
    resolver: zodResolver(reprintSchema),
    defaultValues: initialValues,
  });

  const [outstandingInfo, setOutstandingInfo] = useState<
    OutstandingType | undefined
  >();
  const [pmtSuccess, setPmtSuccess] = useState(false);

  const onSubmit = (values: z.infer<typeof reprintSchema>) => {
    mutate(values, {
      onSuccess: (response) => {
        setOutstandingInfo(response);
      },
    });
  };

  const runTrx = async (
    userid: string,
    amount: number,
    transactionid: string,
  ) => {
    const pmtPayload: PaymentDTO = {
      userid: userid,
      amount: amount,
      transactionid: transactionid,
      purpose: paymentPurpose,
    };
    recordPmtMutate(pmtPayload, {
      onSuccess: () => {
        setPmtSuccess(true);
      },
      onError: (error) => {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: `${error.message}`,
        });
      },
    });

    // const recordPmt = await recordPayment(pmtPayload)
    // if (recordPmt === 200) {
    //   setPmtSuccess(true)
    // }
  };

  const paymentDetails = {
    publicKey: import.meta.env.VITE_PAYSTACK_LIVE,
    email: `${outstandingInfo?.id}@ndcspecial.com`,
    amount: outstandingInfo ? outstandingInfo.total * 100 : 0,
    label: 'Outstanding Payments',
    text: recordPaymentPending ? 'Processing....' : 'Make Payment',
    currency: trxCurr,
    onClose: function () {
      toast({
        variant: 'default',
        title: 'Are you sure?',
        description: 'Closing this will stop your payment from processing',
      });
    },
    onSuccess: (response: PaystackResponse) => {
      runTrx(
        outstandingInfo?.id ?? '',
        outstandingInfo?.total ?? 0,
        response.trxref,
      );
    },
  };

  useEffect(() => {
    if (donateFormErrors) {
      donateForm.reset(initialValues);
    }
  }, [donateFormErrors, donateForm, initialValues]);

  useEffect(() => {
    if (pmtSuccess) {
      toast({
        variant: 'default',
        title: 'Great! Payment successful',
        description: 'Your contribution was successfully made.',
      });
      donateForm.reset(initialValues);
      setOutstandingInfo(undefined);
    }
  }, [pmtSuccess, toast]);

  useEffect(() => {
    if (outstandingInfo?.total === 0) {
      donateForm.reset(initialValues);
    }
  }, [donateForm, initialValues, outstandingInfo]);

  useEffect(() => {
    if (outstandingInfo) {
      if (outstandingInfo.registrationfees > 0) {
        setPaymentPurpose('outstanding')
      } else {
        setPaymentPurpose('monthly donation(s)')
      }
      if (outstandingInfo.monthlyfees.months.length > 0) {
        outstandingInfo.monthlyfees.months.sort((a, b) => {
          const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          return monthOrder.indexOf(a) - monthOrder.indexOf(b)
        })
        setOwedMonths(outstandingInfo.monthlyfees.months)
      }
    }
  }, [outstandingInfo])

  return (
    <div className="min-h-screen w-full bg-white/90">
      <div className="w-full pt-20 text-center">
        <h2 className="mt-5 text-2xl font-semibold text-ndcred">
          Check Arrears
        </h2>
      </div>
      <div className="container mx-auto flex h-full flex-col px-1 lg:flex-row">
        <div className="flex basis-full lg:basis-2/6">
          <div className="w-full px-4">
            <div className="mt-8 flex-auto rounded-lg bg-white px-4 py-10 lg:px-10">
              <p className="pb-6 text-sm text-ndcgreen/70">
                Enter your ID to retrieve information about your registration
                fees and monthly dues.
              </p>
              <Form {...donateForm}>
                <form
                  onSubmit={donateForm.handleSubmit(onSubmit)}
                  onChange={() => {
                    setDonateFormErrors(false)
                    setPmtSuccess(false)
                  }}
                >
                  <div className="mb-4 w-full">
                    <FormField
                      name="id"
                      control={donateForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="mb-2 block text-xs font-bold uppercase text-black">
                            Card ID
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Please enter your Card ID"
                              name="id"
                              className="mt-2 h-10 w-full rounded-md bg-white px-4 py-4 text-sm placeholder:text-sm"
                            />
                          </FormControl>
                          <FormDescription className="text-sm text-red-600">
                            {donateForm.formState.errors.id
                              ? donateForm.formState.errors.id.message
                              : null}
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mt-5 text-center">
                    <button
                      type="submit"
                      className="mx-auto flex w-full flex-row items-center justify-center rounded-lg bg-gradient-to-r from-ndcgreen to-ndcgreen/40 px-8 py-3  font-bold uppercase text-white shadow-lg hover:from-ndcred hover:to-ndcred/30 disabled:opacity-70"
                    >
                      {isPending ? (
                        <RotateCw className="animate-spin" />
                      ) : (
                        <span>Get Details</span>
                      )}
                    </button>
                    {outstandingInfo && outstandingInfo.total === 0 && (
                      <div>
                        <p className="mb-4 text-sm uppercase text-gray-600">
                          You do not have any outstanding payments at the
                          moment. Please return to the homepage.
                        </p>
                        <Link
                          to={'/'}
                          className="mx-auto flex w-full flex-row items-center justify-center bg-gradient-to-r from-ndcgreen to-ndcgreen/60 px-8  py-3 font-bold uppercase text-white shadow-lg hover:from-ndcred hover:to-ndcred/50"
                        >
                          Return to Homepage
                        </Link>
                      </div>
                    )}
                    {pmtSuccess && <p className='my-4 text-sm font-semibold text-ndcgreen'>Payment was successfully made. </p>}
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
        <div className="flex basis-full lg:basis-4/6">
          <div className="w-full px-4">
            {outstandingInfo && outstandingInfo.total !== 0 ? (
              <div className='rounded-lg bg-white px-4 py-10 mb-5 mt-8 flex flex-col'>
                <div className="mb-3 flex flex-col items-start space-x-0 space-y-4  lg:flex-row lg:space-x-4 lg:space-y-0 lg:px-10">
                  {/* <p className="text-ndcgreen/70 text-sm pb-6">Find below a breakdown of your outstanding payments. You can click the button below to make your payments</p> */}
                  <div className="w-full">
                    <p className="text-sm font-thin uppercase">
                      Total Outstanding
                    </p>
                    <p className="text-3xl font-semibold">
                      GHS{' '}
                      {outstandingInfo.total
                        ? outstandingInfo.total.toFixed(2)
                        : '0.00'}
                    </p>
                  </div>
                  <div className="w-full">
                    <p className="text-sm font-thin uppercase">
                      Registration Arrears
                    </p>
                    <p className="text-3xl font-semibold">
                      GHS{' '}
                      {outstandingInfo.registrationfees
                        ? outstandingInfo.registrationfees.toFixed(2)
                        : '0.00'}
                    </p>
                  </div>
                  <div className="w-full">
                    <p className="text-sm font-thin uppercase">
                      Monthly Arrears
                    </p>
                    <p className="text-3xl font-semibold">
                      GHS{' '}
                      {outstandingInfo.monthlyfees
                        ? outstandingInfo.monthlyfees.fees.toFixed(2)
                        : '0.00'}
                    </p>
                    {outstandingInfo.monthlyfees && (
                      <p className="text-xs font-thin">
                        {outstandingInfo.monthlyfees.months.length} months of
                        arrears
                      </p>
                    )}
                  </div>
                </div>
                <div className='mt-3 flex flex-col lg:px-10 w-full'>
                  <h3 className='tracking-wide leading-relaxed text-sm uppercase text-zinc-600 font-semibold'>Payment Details</h3>
                  <ul className='flex flex-col items-start justify-start w-full mb-4'>
                    <li className='flex flex-row items-center  justify-between text-sm leading-loose tracking-wide w-full lg:w-4/5'>
                      <span className='font-thin'>Registration (Outstanding): </span>
                      <span className='font-semibold'>GHS {outstandingInfo.registrationfees.toFixed(2)}</span>
                    </li>
                    <li className='flex flex-row items-center  justify-between text-sm leading-loose tracking-wide w-full lg:w-4/5'>
                      <span className='font-thin'>Monthly Donations (Outstanding): </span>
                      <span className='font-semibold'>GHS {outstandingInfo.monthlyfees.fees.toFixed(2)}</span>
                    </li>
                    <li className='flex flex-row items-center  justify-between text-sm leading-loose tracking-wide w-full lg:w-4/5'>
                      <span className='font-thin'>Months Owed: </span>
                      <span className='font-semibold'>{owedMonths && owedMonths.map((month) => <span>{month} </span>)}</span>
                    </li>
                    <li className='flex flex-row items-center  justify-between text-sm leading-loose tracking-wide w-full lg:w-4/5 border-t'>
                      <span className='uppercase font-bold'>Total Owed: </span>
                      <span className='font-bold'>GHS{outstandingInfo.total.toFixed(2)}</span>
                    </li>
                  </ul>
                </div>
                <PaystackButton
                  {...paymentDetails}
                  className={`
                  mx-auto w-full rounded-lg bg-gradient-to-r from-ndcgreen to-ndcgreen/60 px-8  py-3 font-bold uppercase text-white shadow-lg hover:from-ndcred hover:to-ndcred/50
                  ${recordPaymentPending ? 'pointer-events-none opacity-50' : ''
                    }
                  `}
                />
              </div>
            ) : (
              <div className="w-full pt-8">
                <p className="mb-4 text-sm uppercase text-gray-600">
                  To see any outstanding payments, please enter your ID in the
                  form and click the button provided
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
