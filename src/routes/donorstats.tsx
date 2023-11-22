/* eslint-disable react-refresh/only-export-components */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { DonorStatsType } from "@/utils/constants";
import { getDonorStats } from "@/utils/data";
import { RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/**
 * get a list of all donors, from
 * all regions /donorstats
 */



export default function DonorStats() {
  const {toast} = useToast()
  const [donorList, setDonorList] = useState<DonorStatsType | undefined>()
  const [isLoading, setIsLoading] = useState(false)

  async function getDonors() {
    setIsLoading(true)
    const response = await getDonorStats()
    if (response) {
      setDonorList(response)
      setIsLoading(false)
    } else {
      setIsLoading(false)
      if (response === null) {
        toast({
          variant: "default",
          title: "No Data",
          description: "You have not registered any donors at this time",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Sorry! Error Occurred",
          description: "We could not load your data. Please try again.",
        });
      }
    }
  }
  
  useEffect(() => {
    getDonors()
  }, [])

  if (isLoading) {
    return (
      <div className="bg-white flex flex-col items-center bg-[url('/logo_bg.svg')] bg-center bg-no-repeat justify-center md:min-h-screen md:w-full h-screen w-screen overflow-auto">
        <RotateCw className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-100/90 overflow-auto">
      <div className="w-full h-full lg:w-4/6 mx-auto flex flex-col items-center my-12">
        <div className="flex flex-col items-center w-full h-screen lg:container mx-auto mt-8">
          <Card className="w-full h-auto shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">Donor Wall</CardTitle>
              <CardDescription className="text-md text-gray-500">Total Number of Donors By Region</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col items-start justify-center w-full">
                <li className="flex flex-row w-full items-center justify-between p-4 bg-gray-50 border-b border-b-gray-100 last:border-b-0">
                  <p className="capitalize font-bold">Region</p>
                  <p className="font-bold capitalize">Qty</p>
                </li>
                {donorList && Object.keys(donorList).map((key) => (
                  <li key={key} className="flex flex-row w-full items-center justify-between p-4 hover:bg-gray-50 border-b border-b-gray-100 last:border-b-0">
                    <p className="capitalize">{key}</p>
                    <p>{donorList[key]}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Link to={'/'} className="mb-10 mt-6 mx-auto w-full flex flex-row items-center justify-center uppercase bg-gradient-to-r from-ndcgreen to-ndcgreen/60  hover:from-ndcred hover:to-ndcred/50 text-white font-bold py-3 px-8 shadow-lg">Return to Homepage</Link>
        </div>
      </div>
    </div>
  )
}