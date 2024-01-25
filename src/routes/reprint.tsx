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
import { useGetActiveUserMutation } from '@/hooks/useGetActiveUser';
import { useIssueCardReprint } from '@/hooks/useIssueCardReprint';
import { useRecordPayments } from '@/hooks/useRecordPayments';
import {
  PaymentDTO,
  PaystackInit,
  PaystackResponse,
  RegisteredUser,
  pmtCategoryMap,
  reprintSchema,
  trxCurr,
} from '@/utils/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { usePaystackPayment } from 'react-paystack';
import { Link } from 'react-router-dom';
import { z } from 'zod';

/**
 * get user details via /user
 * if requestCard field is false enable button/ else disable with message
 * specify a fee for reprinting (use hardcoded- value for now)
 * trigger payment via paystack
 * record payment at /payment onSuccess
 *
 */
export default function Reprint() {
  const initConfig = useMemo(() => {
    return {
      publicKey: import.meta.env.VITE_PAYSTACK_LIVE,
      currency: trxCurr,
      amount: 0,
      email: '',
      reference: '',
    }
  }, [])
  const initialValues = useMemo(() => {
    return {
      id: '',
    };
  }, []);
  const reprintForm = useForm<z.infer<typeof reprintSchema>>({
    resolver: zodResolver(reprintSchema),
    defaultValues: initialValues,
  });
  const [config, setConfig] = useState<PaystackInit>(initConfig)
  const { toast } = useToast();
  const initializePayment = usePaystackPayment(config)
  const [currentUser, setCurrentUser] = useState<RegisteredUser | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
  const [openOtpAlert, setOpenOtpAlert] = useState(false)
  const [triggerPmt, setTriggerPmt] = useState(false)
  const [hasRequestedCard, setHasRequestedCard] = useState(false);
  const [pmtSuccess, setPmtSuccess] = useState(false);
  const [reprintFormErrors, setReprintFormErrors] = useState(false);
  const [currentCost, setCurrentCost] = useState<number>(0);

  const { mutate: getUserMutation, isPending: getUserPending } = useGetActiveUserMutation()
  const { mutate: recordPmtMutation, isPending: recordPmtPending } = useRecordPayments()
  const { mutate: issueReprintMutation, isPending: issueReprintPending } = useIssueCardReprint()

  const handleCardReprint = async (id: string, trxid: string) => {
    const pmtPayload: PaymentDTO = {
      userid: id,
      amount: currentCost * 0.2,
      transactionid: trxid,
      purpose: 'reprint',
    };
    recordPmtMutation(pmtPayload, {
      onError: (error) => {
        setErrorMessage(error.message)
      },
      onSuccess: () => {
        issueReprintMutation(id, {
          onError: (error) => {
            setErrorMessage(error.message)
          },
          onSuccess: () => {
            setPmtSuccess(true);
            setHasRequestedCard(true);
          }
        })
      }
    })
  };
  const onClose = useCallback(() => {
    alert('Payment will not be processed if you close this view');
  }, [])

  const onSuccess = useCallback((reference: PaystackResponse): void => {
    setConfig(initConfig)
    const userid = currentUser?.id ?? '';
    handleCardReprint(userid, reference.trxref);
  }, [currentUser])
  // TODO: set amount to actual amount for reprinting
  // const paymentDetails = {
  //   publicKey: import.meta.env.VITE_PAYSTACK_LIVE,
  //   email: `${currentUser?.id}@ndcspecial.com`,
  //   amount: currentCost * 0.2 * 100,
  //   label: 'Card Reprint',
  //   text: 'Make Payment',
  //   currency: trxCurr,
  //   onClose: function () {
  //     alert('Payment will not be processed if you close this view');
  //   },
  //   onSuccess: (response: PaystackResponse) => {
  //     const userid = currentUser?.id ?? '';
  //     handleCardReprint(userid, response.trxref);
  //   },
  // };

  const getUserDetails = async (values: z.infer<typeof reprintSchema>) => {
    getUserMutation(values.id, {
      onSuccess: (response) => {
        setCurrentUser(response)
        setCurrentCost(pmtCategoryMap.get(response.category) ?? 0)
      },
      onError: (error) => {
        setReprintFormErrors(true)
        setErrorMessage(error.name)
      }
    })
  };

  useEffect(() => {
    if (triggerPmt) {
      setConfig({
        ...config,
        email: `${currentUser?.id}@ndcspecial.com`,
        amount: currentCost * 0.2 * 100,
        label: 'Card Reprint',
        reference: `T${(new Date().getTime() * 1000).toString()}`
      })
    }
  }, [triggerPmt, currentUser, currentCost])

  useEffect(() => {
    if(config.amount > 0) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      initializePayment(onSuccess, onClose)
    }
  }, [config, initializePayment, onClose, onSuccess])

  useEffect(() => {
    if (reprintFormErrors) {
      reprintForm.reset(initialValues);
    }
  }, [reprintForm, initialValues, reprintFormErrors]);

  useEffect(() => {
    if (currentUser?.requestcard) {
      reprintForm.reset(initialValues);
    }
  }, [reprintForm, initialValues, currentUser]);

  useEffect(() => {
    if (pmtSuccess && hasRequestedCard) {
      reprintForm.reset(initialValues);
      toast({
        variant: 'default',
        title: 'Great! Payment successful',
        description:
          'Your payment was successfully made. Your card will be printed and sent you your regional head office.',
      });
    }
  }, [pmtSuccess, hasRequestedCard, toast, reprintForm, initialValues]);

  return (
    <div className="min-h-screen w-full bg-white/90">
      <div className="__className_061548 container mx-auto h-full px-1 py-20">
        <div className="mt-12 flex h-full content-center items-center justify-center">
          <div className="w-full px-4 lg:w-5/12 ">
            <div className="relative mb-6 flex w-full min-w-0 flex-col break-words border-0 bg-white/90 pt-5 shadow-lg rounded-lg">
              <h6 className="text-center text-xl font-bold uppercase text-ndcred/80">
                Card Reprint Request
              </h6>
              <hr className="border-b-1 mx-10 mt-2 border-green-700" />
              <div className="flex-auto px-4 py-10 pt-5 lg:px-10">
                <Form {...reprintForm}>
                  <form
                    onSubmit={reprintForm.handleSubmit(getUserDetails)}
                    onChange={() => {
                      setReprintFormErrors(false)
                      setErrorMessage(undefined)
                    }}
                  >
                    <div className="relative mb-4 w-full">
                      <FormField
                        name="id"
                        control={reprintForm.control}
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
                              {reprintForm.formState.errors.id?.message ?? ''}
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="mt-5 text-center">
                      {!currentUser && (
                        <button
                          type="submit"
                          className="mx-auto flex w-full flex-row items-center justify-center text-sm rounded-lg bg-gradient-to-r from-ndcgreen to-ndcgreen/60 px-8  py-2 font-bold uppercase text-white shadow-lg hover:from-ndcred hover:to-ndcred/50"
                        >
                          {getUserPending ? (
                            <Loader size={16} className="animate-spin" />
                          ) : (
                            <span>Get Details</span>
                          )}
                        </button>
                      )}
                      {currentUser &&
                        !currentUser.requestcard &&
                        !hasRequestedCard && (
                          <Button
                            onClick={() => setOpenOtpAlert(true)}
                            disabled={recordPmtPending || issueReprintPending}
                          className='mx-auto w-full bg-gradient-to-r from-ndcgreen to-ndcgreen/60 px-8  py-3 font-bold uppercase text-white shadow-lg hover:from-ndcred hover:to-ndcred/50 disabled:cursor-not-allowed disabled:opacity-70 disabled:pointer-events-none'
                          >
                            {recordPmtPending || issueReprintPending ? <Loader className='animate-spin' size={16} /> : <span>Make Payment</span>}
                          </Button>
                          // <PaystackButton
                          //   {...paymentDetails}
                          //   className={`
                          //     mx-auto w-full bg-gradient-to-r from-ndcgreen to-ndcgreen/60 px-8  py-3 font-bold uppercase text-white shadow-lg hover:from-ndcred hover:to-ndcred/50
                          //     ${recordPmtPending || issueReprintPending ? 'cursor-not-allowed opacity-70 pointer-events-none' : ''}
                          //   `}
                          // />
                        )}
                      {((currentUser && currentUser.requestcard) ||
                        (hasRequestedCard && pmtSuccess)) && (
                        <div>
                          <p className="mb-4 text-sm uppercase text-gray-600">
                            You have requested for a reprint. Please contact
                            your regional head office for more information.
                          </p>
                          <Link
                            to={'/'}
                            className="mx-auto flex w-full flex-row items-center justify-center bg-gradient-to-r from-ndcgreen to-ndcgreen/60 px-8  py-3 font-bold uppercase text-white shadow-lg hover:from-ndcred hover:to-ndcred/50"
                          >
                            Return to Homepage
                          </Link>
                        </div>
                      )}
                      {errorMessage && <p className='text-ndcred text-sm my-4 font-semibold'>{errorMessage}. Please re-enter your ID and try again</p>}
                    </div>
                  </form>
                </Form>
              </div>
              <OTPDialog
                open={openOtpAlert}
                setOpen={setOpenOtpAlert}
                setTriggerPmt={setTriggerPmt}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
