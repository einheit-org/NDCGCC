/* eslint-disable react-refresh/only-export-components */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MainNav from "@/components/widgets/MainNav";
import { DonorStatsType } from "@/utils/constants";
import { getDonorStats } from "@/utils/data";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/**
 * get a list of all donors, from
 * all regions /donorstats
 */



export default function DonorStats() {
  const [donorList, setDonorList] = useState<DonorStatsType | undefined>()

  async function getDonors() {
    const response = await getDonorStats()
    setDonorList(response)
  }
  useEffect(() => {
    getDonors()
  }, [])
  return (
    <div className="w-full h-full flex flex-col bg-gray-100/90 overflow-auto pb-28">
      <MainNav />
      {/* <div className="flex flex-row justify-start items-center">
        <Link
          to="/"
          className="w-12 h-12 rounded-full bg-black text-white flex flex-col items-center justify-center"
        >
          <ArrowLeft />
        </Link>
      </div> */}

      <div className="w-full h-full lg:w-4/6 mx-auto flex flex-col items-center mt-12">
        {/* <div className="lg:mx-auto rounded-full p-4 h-[126px] w-[126px] md:w-[140px] md:h-[140px] flex items-center justify-center">
          <Link to="/">
            <img src="/logo.png" alt="NDC Good Governance" />
          </Link>
        </div> */}
        <div className="flex flex-col items-center w-full h-screen lg:container mx-auto mt-8">
          {/* <h1>Current Donor List By Regions</h1> */}
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
          <Link to={'/'} className=" mt-6 mx-auto w-full flex flex-row items-center justify-center uppercase bg-gradient-to-r from-ndcgreen to-ndcgreen/60  hover:from-ndcred hover:to-ndcred/50 text-white font-bold py-3 px-8 shadow-lg">Return to Homepage</Link>
        </div>
      </div>
    </div>
  )
}