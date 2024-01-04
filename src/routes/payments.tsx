import { AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import DonorCard from '@/components/widgets/DonorCard';
import OTPDialog from '@/components/widgets/OTPDialog';
import PaymentInfoCard from '@/components/widgets/PaymentInfoCard';
import { useActivateDonor } from '@/hooks/useActivateDonor';
import { useGetActiveUser } from '@/hooks/useGetActiveUser';
import { useRecordPayments } from '@/hooks/useRecordPayments';
import { useRequestOTP, useVerifyOTP } from '@/hooks/useRequestOTP';
import {
  PaymentDTO,
  PaystackResponse,
  pmtCategoryMap,
  stripPlusFromPhone,
  trxCurr,
  verifySchema,
} from '@/utils/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PaystackButton } from 'react-paystack';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';

export default function PaymentsPage() {
  const initialVerifyValues = useMemo(() => {
    return {
      otp: ""
    }
  }, [])
  const verifyForm = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: initialVerifyValues
  })
  const { mutate: recordPaymentMutation, isPending: recordPaymentPending } = useRecordPayments();
  const { mutate: activateDonorMutation, isPending: activateDonorPending } = useActivateDonor();
  const { mutate: otpRequestMutate, isPending: otpRequestPending } = useRequestOTP()
  const { mutate: otpVerifyMutate, isPending: otpVerifyPending } = useVerifyOTP()
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [pmtSuccess, setPmtSuccess] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const [openOTPAlert, setOpenOTPAlert] = useState(false)
  const [otpInvalid, setOtpInvalid] = useState(false);
  const [otpHasBeenVerified, setOtpHasBeenVerified] = useState(false)
  const userID = searchParams.get('id') ?? '';
  const category = searchParams.get('category') ?? '';
  const applicantName = searchParams.get('name') ?? '';
  const issDate = searchParams.get('isd') ?? '';
  const { data: activeUser } = useGetActiveUser(userID);
  const registerData = JSON.parse(localStorage.getItem('tempDonor') || '{}')

  const runAll = async (payload: PaymentDTO) => {
    recordPaymentMutation(payload, {
      onSuccess: () => {
        // console.log('response', response);
        setPmtSuccess(true);
        activateDonorMutation(payload.userid, {
          onSuccess: () => {
            setUserCreated(true);
            localStorage.removeItem('tempDonor')
            localStorage.removeItem('donorExists')
          },
        });
      },
      onError: (error) => {
        // console.log('error on mutate', error.message);
        toast({
          variant: 'destructive',
          title: 'Oops! Something happened',
          description: `Message: ${error.message}`,
        });
      },
    });
  };

  const triggerOTP = async () => {
    const formattedNumber = stripPlusFromPhone(registerData.phonenumber)
    // console.log(formattedNumber)
    otpRequestMutate(formattedNumber, {
      onSuccess: () => {
        setOpenOTPAlert(true)
      },
      onError: (error) => {
        console.log(error.message)
      }
    })
  }

  const verifyOTP = (values: z.infer<typeof verifySchema>) => {
    if (values.otp.length < 4 || values.otp.length > 4) {
      setOtpInvalid(true)
      return
    }
    const otpValue = parseInt(values.otp)
    const formattedNumber = stripPlusFromPhone(registerData.phonenumber)
    otpVerifyMutate({ phone: formattedNumber, otp: otpValue }, {
      onSuccess: () => {
        setOtpHasBeenVerified(true)
        setOpenOTPAlert(false)
      },
      onError: (error) => {
        console.error(error)
        setOpenOTPAlert(false)
        // setOtpFormError(error.message)
      }
    })
  }

  const cost = pmtCategoryMap.get(category);
  const actualAmount = cost ? cost * 100 : 0;
  const paymentDetails = {
    publicKey: import.meta.env.VITE_PAYSTACK_LIVE,
    email: `${userID}@ndcspecial.com`,
    amount: actualAmount,
    label: 'Card Registration',
    text: 'Make Payment',
    currency: trxCurr,
    onClose: function () {
      alert('Payment will not be processed if you close this view');
    },
    onSuccess: (response: PaystackResponse) => {
      // change amount for actual amount sent from form
      const payload: PaymentDTO = {
        userid: userID,
        amount: cost ?? 0,
        transactionid: response.trxref,
        purpose: 'registration',
      };
      runAll(payload);
    },
  };

  useEffect(() => {
    if (pmtSuccess || userCreated) {
      toast({
        variant: 'default',
        title: 'Great! Payment successful',
        description:
          'Your contribution was successfully made. Your card will be printed and sent you your regional head office.',
      });
    }
  }, [pmtSuccess, userCreated, toast]);
  return (
    <div className="mt-16 flex h-screen w-full  flex-col items-center overflow-auto bg-gray-100/90 pb-28 lg:mt-0">
      <div className="mx-auto my-auto flex w-full flex-col space-x-0 px-4 lg:container lg:flex-row lg:space-x-3 lg:px-0">
        <div className="mt-7 flex w-full basis-full flex-col items-center lg:basis-1/2">
          <div className="mx-auto mb-3 mt-5 flex w-full flex-col items-center lg:w-4/5">
            <h3 className="text-center text-2xl font-semibold">
              Complete Payment
            </h3>
            <p className="mt-4 text-center text-sm text-gray-500">
              Please confirm that the details below are correct and proceed with
              payment
            </p>
          </div>
          <PaymentInfoCard
            applicantName={applicantName}
            category={category}
            cost={cost}
          />
          {pmtSuccess && userCreated ? (
            <h3 className="mt-7 font-bold text-ndcgreen mx-auto w-full lg:w-4/5">
              Payment received! You're officially registered. Keep an eye on your phone for a confirmation SMS. Welcome aboard!
            </h3>
          ) : null}
          {!otpHasBeenVerified && <Button
            disabled={otpRequestPending}
            onClick={triggerOTP}
            className=' mx-auto flex w-full lg:w-4/5 mt-6 flex-row items-center justify-center rounded-lg bg-gradient-to-r from-ndcgreen to-ndcgreen/40 px-8 py-3 text-xs font-bold uppercase text-white shadow-lg hover:from-ndcred hover:to-ndcred/30'
          >
            {otpRequestPending ? (<Loader className='animate-spin' size={16} />) : (<span>Get OTP</span>)}
          </Button>}
          {!pmtSuccess && !userCreated && !activeUser?.active && otpHasBeenVerified ? (
            <PaystackButton
              {...paymentDetails}
              className={`
                mx-auto flex w-full lg:w-4/5 mt-6 flex-row items-center justify-center rounded-lg bg-gradient-to-r from-ndcgreen to-ndcgreen/40 px-8 py-3 text-xs font-bold uppercase text-white shadow-lg hover:from-ndcred hover:to-ndcred/30
                ${recordPaymentPending || activateDonorPending ? 'animate-pulse cursor-not-allowed opacity-70' : ''} 
              `}
            />
          ) : null}
        </div>

        {/* Virtual Card info */}
        <div className="mt-6 flex w-full basis-full flex-col items-center justify-between lg:basis-1/2">
          <div className="mx-auto my-5 flex w-full flex-col items-center lg:w-4/5">
            <h3 className="text-center text-2xl font-semibold">
              Your Virtual Card
            </h3>
            <p className="mt-4 text-center text-sm text-gray-500">
              Preview your card below
              {/* with the option of saving a copy using the button below */}
            </p>
          </div>
          <DonorCard
            id={userID}
            issDate={issDate}
            donorName={applicantName}
            card={category}
          />
          {/* <button className="p-4 text-base bg-gray-100 hover:bg-ndcgreen hover:text-white text-ndcgreen ring-2 ring-ndcgreen rounded-sm shadow-md mt-8 w-full lg:w-4/5 mx-auto">Save To PDF</button> */}
        </div>
      </div>
      <OTPDialog open={openOTPAlert} setOpen={setOpenOTPAlert}>
        {/* <AlertDialogTrigger asChild>
          <Button>Proceed</Button>
        </AlertDialogTrigger> */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Secure your Payment with OTP</AlertDialogTitle>
            <AlertDialogDescription>Enter the OTP you received on your phone. We will confirm this before proceeding with payment</AlertDialogDescription>
          </AlertDialogHeader>
          <div className='w-full flex flex-col'>
            <Form {...verifyForm}>
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
                  {otpVerifyPending ? <Loader size={16} className='animate-spin' /> : <span>Verify OTP</span>}
                </Button>
                {/* <AlertDialogAction type='submit' disabled={true} className='float-right mr-2'>Proceed</AlertDialogAction> */}
              </form>
            </Form>
          </div>
        </AlertDialogContent>
      </OTPDialog>
    </div>
  );
}
