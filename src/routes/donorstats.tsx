/* eslint-disable react-refresh/only-export-components */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDonorStats, useGetDonorStats } from "@/hooks/useGetDonorStats";
import { queryClient } from "@/services/queryClient";
import { RotateCw } from "lucide-react";

import { Link } from "react-router-dom";

/**
 * get a list of all donors, from
 * all regions /donorstats
 */

export async function loader () {
  const response = queryClient.fetchQuery({
    queryKey: ['donorwall'],
    queryFn: () => getDonorStats()
  })
  return response
}



export default function DonorStats() {
  const { data: donorwall, isLoading } = useGetDonorStats()

  return (
    <div className="w-full h-full flex flex-col bg-gray-100/90 overflow-auto">
      <div className="w-full h-full lg:w-4/6 mx-auto flex flex-col items-center my-12">
        <div className="flex flex-col items-center w-full h-screen lg:container mx-auto mt-8">
          <Card className="w-full h-auto shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">Donor Wall</CardTitle>
              <CardDescription className="text-md text-gray-500">Total Number of Donors By Region</CardDescription>
            </CardHeader>
            {isLoading ? (
              <div className="w-full flex flex-col items-center justify-center min-h-auto py-28">
                <RotateCw className="animate-spin" />
              </div>
            ) : (
              <CardContent>
                <ul className="flex flex-col items-start justify-center w-full">
                  <li className="flex flex-row w-full items-center justify-between p-4 bg-gray-50 border-b border-b-gray-100 last:border-b-0">
                    <p className="capitalize font-bold">Region</p>
                    <p className="font-bold capitalize">Qty</p>
                  </li>
                  {donorwall && Object.keys(donorwall).map((key) => (
                    <li key={key} className="flex flex-row w-full items-center justify-between p-4 hover:bg-gray-50 border-b border-b-gray-100 last:border-b-0">
                      <p className="capitalize">{key}</p>
                      <p>{donorwall[key]}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            )}
          </Card>
          <Link to={'/'} className="mb-10 mt-6 mx-auto w-full flex flex-row items-center justify-center uppercase bg-gradient-to-r from-ndcgreen to-ndcgreen/60  hover:from-ndcred hover:to-ndcred/50 text-white font-bold py-3 px-8 shadow-lg">Return to Homepage</Link>
        </div>
      </div>
    </div>
  )
}