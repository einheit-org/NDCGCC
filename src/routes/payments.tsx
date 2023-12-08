import { useToast } from '@/components/ui/use-toast';
import DonorCard from '@/components/widgets/DonorCard';
import PaymentInfoCard from '@/components/widgets/PaymentInfoCard';
import { useActivateDonor } from '@/hooks/useActivateDonor';
import { useGetActiveUser } from '@/hooks/useGetActiveUser';
import { useRecordPayments } from '@/hooks/useRecordPayments';
import {
  PaymentDTO,
  PaystackResponse,
  pmtCategoryMap,
  trxCurr,
} from '@/utils/constants';
import { useEffect, useState } from 'react';
import { PaystackButton } from 'react-paystack';
import { useSearchParams } from 'react-router-dom';

export default function PaymentsPage() {
  const { mutate: recordPaymentMutation, isPending: recordPaymentPending } = useRecordPayments();
  const { mutate: activateDonorMutation, isPending: activateDonorPending } = useActivateDonor();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [pmtSuccess, setPmtSuccess] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const userID = searchParams.get('id') ?? '';
  const category = searchParams.get('category') ?? '';
  const applicantName = searchParams.get('name') ?? '';
  const issDate = searchParams.get('isd') ?? '';
  const { data: activeUser } = useGetActiveUser(userID);

  const runAll = async (payload: PaymentDTO) => {
    recordPaymentMutation(payload, {
      onSuccess: (response) => {
        console.log('response', response);
        setPmtSuccess(true);
        activateDonorMutation(payload.userid, {
          onSuccess: () => {
            setUserCreated(true);
          },
        });
      },
      onError: (error) => {
        console.log('error on mutate', error.message);
        toast({
          variant: 'destructive',
          title: 'Oops! Something happened',
          description: `Message: ${error.message}`,
        });
      },
    });
  };

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
            <h3 className="mt-7 font-bold text-ndcgreen">
              Your account has been registered and payment recorded
            </h3>
          ) : null}
          {!pmtSuccess && !userCreated && !activeUser?.active ? (
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
    </div>
  );
}
