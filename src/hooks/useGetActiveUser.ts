import { request } from "@/services/request"
import { RegisteredUser } from "@/utils/constants"
import { useQuery } from "@tanstack/react-query"

const getUser = async (userid: string) => {
  const response = request<RegisteredUser>(`${import.meta.env.VITE_API_URL}/user`, {
    body: { id: userid }
  })
  return response
}

export const useGetActiveUser = (userid: string) => {
  return useQuery({
    queryKey: ['getActiveUser'],
    queryFn: () => getUser(userid)
  })
}