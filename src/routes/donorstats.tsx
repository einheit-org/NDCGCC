/* eslint-disable react-refresh/only-export-components */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getDonorStats, useGetDonorStats } from '@/hooks/useGetDonorStats';
import { queryClient } from '@/services/queryClient';
import { RotateCw } from 'lucide-react';

import { Link } from 'react-router-dom';

/**
 * get a list of all donors, from
 * all regions /donorstats
 */

export async function loader() {
  const response = queryClient.fetchQuery({
    queryKey: ['donorwall'],
    queryFn: () => getDonorStats(),
  });
  return response;
}

export default function DonorStats() {
  const { data: donorwall, isLoading } = useGetDonorStats();

  return (
    <div className="flex h-full w-full flex-col overflow-auto bg-gray-100/90">
      <div className="mx-auto my-12 flex h-full w-full flex-col items-center lg:w-4/6">
        <div className="mx-auto mt-8 flex h-screen w-full flex-col items-center lg:container">
          <Card className="h-auto w-full shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">Donor Wall</CardTitle>
              <CardDescription className="text-md text-gray-500">
                Total Number of Donors By Region
              </CardDescription>
            </CardHeader>
            {isLoading ? (
              <div className="min-h-auto flex w-full flex-col items-center justify-center py-28">
                <RotateCw className="animate-spin" />
              </div>
            ) : (
              <CardContent>
                <ul className="flex w-full flex-col items-start justify-center">
                  <li className="flex w-full flex-row items-center justify-between border-b border-b-gray-100 bg-gray-50 p-4 last:border-b-0">
                    <p className="font-bold capitalize">Region</p>
                    <p className="font-bold capitalize">Qty</p>
                  </li>
                  {donorwall &&
                    Object.keys(donorwall).map((key) => (
                      <li
                        key={key}
                        className="flex w-full flex-row items-center justify-between border-b border-b-gray-100 p-4 last:border-b-0 hover:bg-gray-50"
                      >
                        <p className="capitalize">{key}</p>
                        <p>{donorwall[key]}</p>
                      </li>
                    ))}
                </ul>
              </CardContent>
            )}
          </Card>
          <Link
            to={'/'}
            className="mx-auto mb-10 mt-6 flex w-full flex-row items-center justify-center bg-gradient-to-r from-ndcgreen to-ndcgreen/60 px-8  py-3 font-bold uppercase text-white shadow-lg hover:from-ndcred hover:to-ndcred/50"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
