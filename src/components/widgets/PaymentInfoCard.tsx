export default function PaymentInfoCard({
  applicantName,
  category,
  cost,
}: {
  applicantName: string;
  category: string;
  cost: number | undefined;
}) {
  return (
    <div className="mx-auto flex w-full flex-col items-start rounded-md bg-ndcgreen/20 p-8 lg:w-4/5">
      <div className="mb-4 flex w-full flex-row items-center justify-start space-x-12">
        <p className="w-12 text-sm font-bold uppercase text-gray-700">Name:</p>
        <p className="text-sm capitalize">{applicantName}</p>
      </div>
      <div className="mb-4 flex w-full flex-row items-center justify-start space-x-12">
        <p className="w-12 text-sm font-bold uppercase text-gray-700">
          Category:
        </p>
        <p className="text-sm capitalize">{category}</p>
      </div>
      <div className="flex w-full flex-row items-center justify-start space-x-12">
        <p className="w-12 text-sm font-bold uppercase text-gray-700">
          Amount:
        </p>
        <p className="text-sm">GHS {cost}</p>
      </div>
    </div>
  );
}
