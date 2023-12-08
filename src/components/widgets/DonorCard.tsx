import { formatId } from '@/utils/constants';
import { ChevronRight, QrCode } from 'lucide-react';

export default function DonorCard({
  id,
  issDate,
  donorName,
  card,
}: {
  id: string;
  issDate: string;
  donorName: string;
  card: string;
}) {
  return (
    <div
      className={`h-86 mx-auto w-full rounded-lg bg-ndcgreen px-7 py-6 lg:w-4/5 bg-[url('/${
        card === 'prestige plus' ? 'prestige_plus' : card
      }_card.jpeg')] flex flex-col justify-between bg-cover bg-center shadow-lg`}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col items-start justify-start">
          <h6 className="text-xs uppercase text-gray-50">
            Good Governance Card
          </h6>
          <h2 className="my-1 text-center font-extrabold uppercase leading-4 tracking-widest text-white">
            {card.toUpperCase()}
          </h2>
          <h3 className="mt-0.5  text-center text-xs font-medium uppercase leading-4 text-white">
            Donor
          </h3>
          <div className="mt-4 flex h-[24px] w-[24px] flex-col items-center justify-center bg-gray-50">
            <QrCode />
          </div>
        </div>
        <img alt="logo" width="28" height="25" src="/ndc_card_logo.png" />
      </div>
      <div className="mt-3">
        <div className="mb-1 mt-3">
          <h3 className="-ml-1 text-3xl font-bold uppercase leading-8 tracking-widest text-white">
            {formatId(id)}
          </h3>
          <div className="-ml-1 mt-8 flex w-full flex-row items-center justify-start">
            <p className="mr-0.5 text-[11px]  font-semibold uppercase text-gray-200">
              issue date
            </p>
            <ChevronRight
              size={16}
              strokeWidth={3}
              className="mr-1 text-sm text-gray-200"
            />
            <h3 className="ml-0.5 text-[12px] text-sm  font-bold uppercase tracking-wide text-gray-200">
              {issDate}
            </h3>
          </div>
          <div className="h-[28px]">
            <h2 className="-ml-1 text-lg font-bold uppercase tracking-widest text-white">
              {donorName}
            </h2>
          </div>
        </div>
      </div>
      <h1 className="mr-1 mt-0 text-right font-sans text-lg font-extrabold uppercase text-gray-50">
        NDC
      </h1>
    </div>
  );
}
