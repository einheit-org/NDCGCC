import { request } from "@/services/request";
import { useMutation } from "@tanstack/react-query";

const pushDonorUpgrade = async (payload: {id: string;
  category: string;
  cost: number;}) => {
    const response = await request(`${import.meta.env.VITE_API_URL}/upgrade`, {
      body: payload
    })
    return response
  }

export const useRecordUpgradePayment = () => {
  return useMutation({
    mutationKey: ['recordUpgrade'],
    mutationFn: (payload: {id: string;
  category: string;
  cost: number;}) => pushDonorUpgrade(payload)
  })
}