import { SummaryPayloadType, formatId } from '@/utils/constants';
import { format } from 'date-fns';
import { PaystackInit } from '../../utils/constants';
import { Loader } from 'lucide-react';
import { useEffect } from 'react';
// import { useRequestOTP, useVerifyOTP } from '@/hooks/useRequestOTP';

export default function UpgradeSummary({
  summary,
  paymentSuccess,
  paymentError,
  failedTrxSuccess,
  clearPmt,
  pmtConfig,
  setConfig,
  recordPaymentPending,
  recordUpgPending,
  setOpenAlert,
  triggerPayment
}: {
  summary: SummaryPayloadType;
  paymentSuccess: boolean;
  paymentError: string | undefined;
  failedTrxSuccess: boolean
  clearPmt: () => void;
  pmtConfig: PaystackInit
  setConfig: (value: PaystackInit | ((prevVar: PaystackInit) => PaystackInit)) => void
  recordPaymentPending: boolean
  recordUpgPending: boolean
  setOpenAlert: (value: boolean) => void
  triggerPayment: boolean
}) {

 
  useEffect(() => {
    if (triggerPayment) {
      setConfig({
        ...pmtConfig,
        email: `${summary.id}@ndcspecial.com`,
        amount: summary.amount * 100,
        reference: `T${(new Date().getTime() * 1000).toString()}`
      })
    }
  }, [triggerPayment])
  return (
    <div className="mt-8 w-full px-8 lg:pl-0">
      <div className="flex w-full flex-col rounded-lg bg-white px-4 py-10 pt-4">
        <h2 className="text-base font-semibold uppercase text-zinc-400">
          Upgrade Summary
        </h2>
        <div className="mt-4 flex w-full flex-col divide-ndcgreen/60 lg:flex-row lg:items-start lg:divide-x lg:divide-solid">
          <div className="w-full flex-col py-4 lg:w-1/2">
            <h5 className="mb-2 text-xs font-semibold">Your Details</h5>
            <ul className="flex w-4/5 flex-col">
              <li className="flex flex-row items-center justify-between border-b border-b-gray-100 py-2">
                <span className="text-xs">Name: </span>
                <span className="text-xs font-semibold capitalize">
                  {summary.fullname}
                </span>
              </li>
              <li className="flex flex-row items-center justify-between border-b border-b-gray-100 py-2">
                <span className="text-xs">ID: </span>
                <span className="text-xs font-semibold capitalize">
                  {formatId(summary.id)}
                </span>
              </li>
              <li className="flex flex-row items-center justify-between border-b border-b-gray-100 py-2">
                <span className="text-xs">Category: </span>
                <span className="text-xs font-semibold capitalize">
                  {summary.currentCategory}
                </span>
              </li>
              <li className="flex flex-row items-center justify-between border-b border-b-gray-100 py-2">
                <span className="text-xs">Registration Date: </span>
                <span className="text-xs font-semibold capitalize">
                  {format(new Date(summary.createdon * 1000), 'do MMM, yyyy')}
                </span>
              </li>
            </ul>
          </div>
          <div className="mt-4 w-full flex-col py-4 lg:mt-0 lg:w-1/2 lg:pl-3">
            <h5 className="mb-2 text-xs font-semibold">Payment Details</h5>
            <ul className="flex w-4/5 flex-col">
              <li className="flex flex-row items-center justify-between border-b border-b-gray-100 py-2">
                <span className="text-xs">Purpose: </span>
                <span className="text-xs font-semibold capitalize">
                  {summary.purpose}
                </span>
              </li>
              <li className="flex flex-row items-center justify-between border-b border-b-gray-100 py-2">
                <span className="text-xs">New Category: </span>
                <span className="text-xs font-semibold capitalize">
                  {summary.newCategory ? summary.newCategory : 'N/A'}
                </span>
              </li>
              <li className="flex flex-row items-center justify-between border-b border-b-gray-100 py-2">
                <span className="text-xs">Amount To Be Paid: </span>
                <span className="text-xs font-semibold capitalize">
                  GHS {summary.amount.toFixed(2)}
                </span>
              </li>
            </ul>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:space-x-3">
              <button
                // disabled={isLoading}
                type="button"
                className={`
                  mx-auto mt-4 flex w-full flex-row items-center justify-center rounded-lg bg-white px-8 py-2 text-xs font-bold uppercase shadow-lg ring-2 hover:text-white disabled:pointer-events-none disabled:opacity-70 lg:w-auto
                  ${paymentSuccess ? 'text-ndcgreen ring-ndcgreen hover:bg-ndcgreen' : 'text-ndcred ring-ndcred hover:bg-ndcred'}
                `
                }
                onClick={clearPmt}
              >
                {paymentSuccess ? (
                  <span>Close</span>
                ) : (
                  <span>Cancel</span>
                )}
              </button>
              {!paymentSuccess && <button
                disabled={recordPaymentPending || recordUpgPending || paymentSuccess}
                type="button"
                className="mx-auto mt-4 flex w-full flex-row items-center justify-center rounded-lg bg-gradient-to-r from-ndcgreen to-ndcgreen/40 px-8  py-2 text-xs font-bold uppercase text-white shadow-lg hover:from-ndcred hover:to-ndcred/30 disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-70"
                onClick={() => { setOpenAlert(true)}}
              >
                {recordPaymentPending || recordUpgPending ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <span>Make Payment</span>
                )}
              </button>}
            </div>
            {paymentSuccess && (
              <p className="mt-6 text-sm font-semibold leading-relaxed tracking-normal text-ndcgreen/90">
                Payment for your upgrade was successful. Kindly contact your
                Regional office for your new card
              </p>
            )}
            {paymentError && (
              <p className='mt-6 text-sm font-semibold leading-relaxed tracking-normal text-ndcred/90'>
                The following error occurred - {paymentError} - Please refresh your browser and try again
              </p>
            )}
            {failedTrxSuccess && (
              <p className='mt-6 text-sm font-semibold leading-relaxed tracking-normal text-ndcred/90'>
                Your payment could not be completed. We have notified the team and will get back to you shortly.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
