import { generateRequestToken } from "@/utils/constants"
import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"

export default function DonorReports () {
  const [ searchParams ] = useSearchParams()
  const id = searchParams.get("id") ?? undefined

  const getDonorReports = async (id: string): Promise<Array<{
    userid: string;
    category: string;
    name: string;
    amount: number;
    purpose: string;
    createdon: EpochTimeStamp;
  }> | undefined> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/donor/report`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${generateRequestToken()}`
        },
        body: JSON.stringify({
          id: id
        })
      })
    } catch (error) {
      
    }
  }

  useEffect(() => {
    if (id) {
      getDonorReports(id)
    }
  }, [id])
  return (
    <div>
      reporting
    </div>
  )
}