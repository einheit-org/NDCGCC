import { request } from "@/services/request"
import { useMutation } from "@tanstack/react-query"

export type Services = 'dues' | 'ggc'

export type RequestOTP = {
  phone: string;
  service: Services;
}

export type VerifyOTP = {
  phone: string;
  service: Services;
  otp: number
}

const requestOTP = async (payload: RequestOTP) => {
  const response = await request(`${import.meta.env.VITE_OTP_URL}/otp`, {
    body: { phonenumber: payload.phone, service: payload.service }
  })
  return response
}

const verifyOTP = async (payload: VerifyOTP) => {
  const response = await request(`${import.meta.env.VITE_OTP_URL}/otp/verify`, {
    body: { phonenumber: payload.phone, service: payload.service, otp: payload.otp }
  })
  return response
}

export const useRequestOTP = () => {
  return useMutation({
    mutationKey: ['requestOTP'],
    mutationFn: (payload: RequestOTP ) => requestOTP(payload)
  })
}

export const useVerifyOTP = () => {
  return useMutation({
    mutationKey: ['verifyOTP'],
    mutationFn: (payload: VerifyOTP) => verifyOTP(payload)
  })
}