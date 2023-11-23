import { formatId } from "@/utils/constants";
import { ChevronRight, QrCode } from "lucide-react";

export default function DonorCard({ id, issDate, donorName, card }: { id: string, issDate: string, donorName: string, card: string }) {
  return (
    <div className={`bg-ndcgreen rounded-lg w-full lg:w-4/5 h-86 mx-auto py-6 px-7 bg-[url('/${card === 'prestige plus' ? 'prestige_plus' : card}_card.jpeg')] bg-cover bg-center shadow-lg flex flex-col justify-between`}>
      <div className="flex justify-between items-start">
        <div className="flex flex-col items-start justify-start">
          <h6 className="uppercase text-xs text-gray-50">Good Governance Card</h6>
          <h2 className="uppercase font-extrabold leading-4 tracking-widest text-center text-white my-1">{card.toUpperCase()}</h2>
          <h3 className="uppercase  font-medium leading-4 text-xs mt-0.5 text-center text-white">Donor</h3>
          <div className="bg-gray-50 h-[24px] w-[24px] flex flex-col items-center justify-center mt-4">
            <QrCode />
          </div>
        </div>
        <img alt="logo" width="28" height="25" src="/ndc_card_logo.png" />
      </div>
      <div className="mt-3">
        <div className="mt-3 mb-1">
          <h3 className="uppercase text-3xl font-bold -ml-1 tracking-widest leading-8 text-white">{formatId(id)}</h3>
          <div className="mt-8 flex items-center flex-row w-full justify-start -ml-1">
            <p className="text-[11px] font-semibold  uppercase mr-0.5 text-gray-200">issue date</p>
            <ChevronRight size={16} strokeWidth={3} className="text-sm mr-1 text-gray-200" />
            <h3 className="uppercase text-[12px] font-bold  tracking-wide ml-0.5 text-sm text-gray-200">{issDate}</h3>
          </div>
          <div className="h-[28px]">
            <h2 className="uppercase text-lg -ml-1 font-bold tracking-widest text-white">{donorName}</h2>
          </div>
        </div>
      </div>
      <h1 className="uppercase font-extrabold text-lg text-right font-sans mt-0 mr-1 text-gray-50">NDC</h1>
    </div>
  )
}