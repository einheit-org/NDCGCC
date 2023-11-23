export default function PaymentInfoCard({applicantName, category, cost}: { applicantName: string, category: string, cost: number | undefined }) {
  return (
    <div className="w-full lg:w-4/5 mx-auto flex flex-col items-start bg-ndcgreen/20 rounded-md p-8">
      <div className="flex flex-row justify-start items-center w-full space-x-12 mb-4">
        <p className="w-12 text-sm font-bold uppercase text-gray-700">Name:</p>
        <p className='text-sm capitalize'>{applicantName}</p>
      </div>
      <div className="flex flex-row justify-start items-center w-full space-x-12 mb-4">
        <p className="w-12 text-sm font-bold uppercase text-gray-700">Category:</p>
        <p className="text-sm capitalize">{category}</p>
      </div>
      <div className="flex flex-row justify-start items-center w-full space-x-12">
        <p className="w-12 text-sm font-bold uppercase text-gray-700">Amount:</p>
        <p className="text-sm">GHS {cost}</p>
      </div>
    </div>
  )
}