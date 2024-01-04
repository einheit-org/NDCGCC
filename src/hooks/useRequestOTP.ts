import { request } from "@/services/request"
import { useMutation } from "@tanstack/react-query"

const requestOTP = async (phone: string) => {
  const response = await request(`${import.meta.env.VITE_API_URL}/otp`, {
    body: { phonenumber: phone }
  })
  return response
}

const verifyOTP = async (phone: string, otp: number) => {
  const response = await request(`${import.meta.env.VITE_API_URL}/otp/verify`, {
    body: { phonenumber: phone, otp: otp }
  })
  return response
}

export const useRequestOTP = () => {
  return useMutation({
    mutationKey: ['requestOTP'],
    mutationFn: (phone: string ) => requestOTP(phone)
  })
}

export const useVerifyOTP = () => {
  return useMutation({
    mutationKey: ['verifyOTP'],
    mutationFn: (values: { phone: string, otp: number }) => verifyOTP(values.phone, values.otp)
  })
}