import 'react-phone-number-input/style.css';

import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '../ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { otpSchema, stripPlusFromPhone, verifySchema } from '@/utils/constants';
import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import PhoneInputWithCountry from 'react-phone-number-input/react-hook-form';
import { Button } from '../ui/button';
import { Loader } from 'lucide-react';
import { useRequestOTP, useVerifyOTP } from '@/hooks/useRequestOTP';
import { Input } from '../ui/input';
import { isPossiblePhoneNumber } from 'react-phone-number-input';


export default function OTPDialog({
  open,
  setOpen,
  setTriggerPmt
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  setTriggerPmt: (value: boolean) => void
}) {
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
  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: initialOTPValues
  })
  const verifyForm = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: initialVerifyValues
  })
  const [phoneInvalid, setPhoneInvalid] = useState(false)
  const [showVerifyForm, setShowVerifyForm] = useState(false)
  const [showError, setShowError] = useState(false)
  const [otpInvalid, setOtpInvalid] = useState(false)
  const [currentPhone, setCurrentPhone] = useState<string>('')
  const { mutate: otpRequestMutation, isPending: otpRequestPending } = useRequestOTP()
  const { mutate: otpVerifyMutation, isPending: otpVerifyPending } = useVerifyOTP()

  const getOtp = (values: z.infer<typeof otpSchema>) => {
    if (!isPossiblePhoneNumber(values.phonenumber)) {
      otpForm.reset(initialOTPValues)
      setPhoneInvalid(true)
      return
    }
    otpRequestMutation({ phone: stripPlusFromPhone(values.phonenumber), service: 'ggc' }, {
      onSuccess: () => {
        setShowVerifyForm(true)
        setCurrentPhone(stripPlusFromPhone(values.phonenumber))
      },
      onError: () => {
        setShowError(true)
      }
    })
  }

  const verifyOtp = (values: z.infer<typeof verifySchema>) => {
    if (values.otp.length < 6 || values.otp.length > 6) {
      setOtpInvalid(true)
      return
    }
    if (currentPhone.length === 0) {
      setPhoneInvalid(true)
      return
    }
    const otpValue = parseInt(values.otp)
    otpVerifyMutation({
      phone: currentPhone, 
      service: 'ggc',
      otp: otpValue
    }, {
      onSuccess: () => {
        setTriggerPmt(true)
        setOpen(false)
      },
      onError: () => {
        setShowVerifyForm(false)
      },
      onSettled: () => {
        setShowVerifyForm(false)
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Secure your payment with OTP</AlertDialogTitle>
          <AlertDialogDescription>
            {showVerifyForm ? 'Enter the OTP you received on your phone. We will confirm this before proceeding with payment'
              : `Enter your phone number to receive an OTP via SMS. This adds an extra layer of protection for your payment. Don't worry, we won't share your number`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className='w-full flex flex-col'>
          {!showVerifyForm && <Form {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit(getOtp)}
              onChange={() => {
                setPhoneInvalid(false)
                setShowError(false)
              }}
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
                      {showError && <span>An error occurred while sending your code. Please try again</span>}
                    </FormDescription>
                  </FormItem>
                )}
              />
              <Button
                disabled={otpRequestPending}
                type='submit'
                className='float-right bg-ndcgreen hover:bg-white hover:ring hover:ring-ndcgreen hover:text-ndcgreen disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60'
              >
                {otpRequestPending ? <Loader size={16} className='animate-spin' /> : <span>Get OTP</span>}
              </Button>
            </form>
          </Form>}

          {showVerifyForm && <Form {...verifyForm}>
            <form
              onSubmit={verifyForm.handleSubmit(verifyOtp)}
              onChange={() => {
                setOtpInvalid(false)
              }}
            >
              <FormField
                control={verifyForm.control}
                name="otp"
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
            </form>
          </Form>}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
