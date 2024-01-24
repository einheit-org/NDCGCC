import { AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
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
import OTPDialog from '@/components/widgets/OTPDialog';
import { OutstandingType, useGetOutstanding } from '@/hooks/useGetOutstanding';
import { useRecordPayments } from '@/hooks/useRecordPayments';
import {
  PaymentDTO,
  PaymentPurpose,
  PaystackResponse,
  otpSchema,
  reprintSchema,
  stripPlusFromPhone,
  trxCurr,
  verifySchema,
} from '@/utils/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { RotateCw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PaystackButton } from 'react-paystack';
import { isPossiblePhoneNumber } from 'react-phone-number-input';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import PhoneInputWithCountry from 'react-phone-number-input/react-hook-form';
import { useRequestOTP, useVerifyOTP } from '@/hooks/useRequestOTP';

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
  const { mutate: otpRequestMutate, isPending: otpRequestPending } = useRequestOTP()
  const { mutate: otpVerifyMutate, isPending: otpVerifyPending } = useVerifyOTP()
  const initialValues = useMemo(() => {
    return {
      id: '',
    };
  }, []);
  const initialOTPValues = useMemo(() => {
    return {
      phonenumber: ''
    }
  }, [])
  const initialVerifyValues = useMemo(() => {
    return {
      otp: ""
    }
  }, [])
  const donateForm = useForm<z.infer<typeof reprintSchema>>({
    resolver: zodResolver(reprintSchema),
    defaultValues: initialValues,
  });
  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: initialOTPValues
  })
  const verifyForm = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: initialVerifyValues
  })

  const { toast } = useToast();
  const [donateFormErrors, setDonateFormErrors] = useState(false);
  const [paymentPurpose, setPaymentPurpose] = useState<PaymentPurpose>('outstanding');
  const [showVerifyForm, setShowVerifyForm] = useState(false)
  const [phoneInvalid, setPhoneInvalid] = useState(false)
  const [otpHasBeenVerified, setOtpHasBeenVerified] = useState(false)
  const [otpInvalid, setOtpInvalid] = useState(false)
  const [currentPhone, setCurrentPhone] = useState<string>('')
  const [otpFormError, setOtpFormError] = useState<string | undefined>(undefined)
  const [owedMonths, setOwedMonths] = useState<string[] | undefined>(undefined)
  const [missingError, setMissingError] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)



  const [outstandingInfo, setOutstandingInfo] = useState<
    OutstandingType | undefined
  >();
  const [pmtSuccess, setPmtSuccess] = useState(false);

  const onSubmit = (values: z.infer<typeof reprintSchema>) => {
    mutate(values, {
      onSuccess: (response) => {
        setOutstandingInfo(response);
      },
      onError: () => {
        setMissingError(true)
      }
    });
  };


  const getOTP = (values: z.infer<typeof otpSchema>) => {
    if (!isPossiblePhoneNumber(values.phonenumber)) {
      // console.log('number is false; reset form')
      otpForm.reset(initialOTPValues)
      setPhoneInvalid(true)
      return
    }
    const formattedNumber = stripPlusFromPhone(values.phonenumber)
    otpRequestMutate({phone: formattedNumber, service: 'ggc'}, {
      onSuccess: () => {
        setShowVerifyForm(true)
        setCurrentPhone(formattedNumber)
      },
      onError: (error) => {
        setOpenAlert(false)
        setOtpFormError(error.message)
      }
    })
  }

  const verifyOTP = (values: z.infer<typeof verifySchema>) => {
    if (values.otp.length < 6 || values.otp.length > 6) {
      setOtpInvalid(true)
      return
    }
    const otpValue = parseInt(values.otp)
    // console.log('current Phone', currentPhone)
    otpVerifyMutate({phone: currentPhone, service: 'ggc', otp: otpValue}, {
      onSuccess: () => {
        setOtpHasBeenVerified(true)
      },
      onError: (error) => {
        setOpenAlert(false)
        setOtpFormError(error.message)
      }
    })
  }

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
    if (otpHasBeenVerified) {
      setOpenAlert(false)
    }
  }, [otpHasBeenVerified])

  useEffect(() => {
    if (pmtSuccess) {
      toast({
        variant: 'default',
        title: 'Great! Payment successful',
        description: 'Your contribution was successfully made.',
      });
      donateForm.reset(initialValues);
      setOutstandingInfo(undefined);
      setOtpHasBeenVerified(false)
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
                    setMissingError(false)
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
                  {missingError && <p className='text-sm text-ndcred'>Oops! We encountered an issue retrieving your data. Please double-check your information and try again</p>}
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
                      <span className='font-semibold'>{owedMonths && owedMonths.length > 0 ? owedMonths.map((month) => <span>{month} </span>) : 'N/A'}</span>
                    </li>
                    <li className='flex flex-row items-center  justify-between text-sm leading-loose tracking-wide w-full lg:w-4/5 border-t'>
                      <span className='uppercase font-bold'>Total Owed: </span>
                      <span className='font-bold'>GHS{outstandingInfo.total.toFixed(2)}</span>
                    </li>
                  </ul>
                </div>
                {!otpHasBeenVerified && <OTPDialog open={openAlert} setOpen={setOpenAlert}>
                  <AlertDialogTrigger asChild>
                    <Button className='mt-2 bg-white ring-2 text-ndcgreen shadow-lg ring-ndcgreen hover:bg-ndcgreen hover:text-white'>Verify Your Number</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Secure Your Payment with OTP</AlertDialogTitle>
                      <AlertDialogDescription>
                        {showVerifyForm ? 'Enter the OTP you received on your phone. We will confirm this before proceeding with payment.' : "Enter your phone number to receive an OTP via SMS. This adds an extra layer of protection for your payment. Don't worry, we won't share your number!"}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className='w-full flex flex-col'>
                      {!showVerifyForm && <Form {...otpForm}>
                        <form
                          onSubmit={otpForm.handleSubmit(getOTP)}
                          onChange={() => setPhoneInvalid(false)}
                        >
                          <FormField
                            name="phonenumber"
                            control={otpForm.control}
                            render={({ field }) => (
                              <FormItem className='w-full mb-4'>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <PhoneInputWithCountry
                                    {...field}
                                    placeholder="Enter your phone number"
                                    defaultCountry='GH'
                                    className='mt-2 w-full rounded-md border px-4 py-[0.8em] text-sm mb-4 placeholder:text-sm'
                                  />
                                </FormControl>
                                <FormDescription className='text-xs text-ndcred'>
                                  {otpForm.formState.errors.phonenumber && <span>{otpForm.formState.errors.phonenumber.message}</span>}
                                  {phoneInvalid && <span>Your phone number is invalid. Please enter a correct number</span>}
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                          <Button
                            disabled={otpRequestPending}
                            type='submit'
                            className='float-right bg-ndcgreen hover:bg-white hover:ring hover:ring-ndcgreen hover:text-ndcgreen disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60'
                          >
                            {otpRequestPending ? <RotateCw size={16} className='animate-spin' /> : <span>Get OTP</span>}
                          </Button>
                          {/* <AlertDialogAction type='submit' disabled={true} className='float-right mr-2'>Proceed</AlertDialogAction> */}
                        </form>
                      </Form>}

                      {showVerifyForm && <Form {...verifyForm}>
                        <form
                          onSubmit={verifyForm.handleSubmit(verifyOTP)}
                        onChange={() => setOtpInvalid(false)}
                        >
                          <FormField
                            name="otp"
                            control={verifyForm.control}
                            render={({ field }) => (
                              <FormItem className='w-full mb-4'>
                                <FormLabel>OTP</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Enter the OTP you received"
                                    className='mt-2 w-full rounded-md border px-4 py-[0.8em] text-sm mb-4 placeholder:text-sm'
                                  />
                                </FormControl>
                                <FormDescription className='text-xs text-ndcred'>
                                  {verifyForm.formState.errors.otp && <span>{verifyForm.formState.errors.otp.message}</span>}
                                  {otpInvalid && <span>Please enter a valid OTP</span>}
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                          <Button
                           disabled={otpVerifyPending}
                           type='submit'
                            className='float-right bg-ndcgreen hover:bg-white hover:ring hover:ring-ndcgreen hover:text-ndcgreen disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60'
                          >
                            {otpVerifyPending ? <RotateCw size={16} className='animate-spin' /> : <span>Verify OTP</span>}
                          </Button>
                          {/* <AlertDialogAction type='submit' disabled={true} className='float-right mr-2'>Proceed</AlertDialogAction> */}
                        </form>
                      </Form>}
                    </div>
                  </AlertDialogContent>
                </OTPDialog>}
                {otpHasBeenVerified && <p className='pl-2 py-2 text-ndcgreen/70 text-xs'>Your phone number was verified. Please click the button below to make payment</p>}
                {otpHasBeenVerified && <PaystackButton
                  {...paymentDetails}
                  className={`
                  mx-auto w-full rounded-lg bg-gradient-to-r from-ndcgreen to-ndcgreen/60 px-8  py-3 font-bold uppercase text-white shadow-lg hover:from-ndcred hover:to-ndcred/50
                  ${recordPaymentPending ? 'pointer-events-none opacity-50' : ''
                    }
                  `}
                />}
                {otpFormError && <span className='text-ndcred my-2 text-center text-sm'>We could not process your OTP request. Please try again</span>}
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
