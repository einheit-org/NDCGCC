import { queryClient } from "@/services/queryClient";
import { request } from "@/services/request"
import { useQuery } from "@tanstack/react-query";

type AdminAgents = Array<{
  name: string;
  id: string;
  totalraised: string;
  createdon: EpochTimeStamp;
}>;

const getAllAgents = async () => {
  const response = request<AdminAgents>(`${import.meta.env.VITE_API_URL}/donor/agent`)
  ;(await response).sort((a, b) => b.createdon * 1000 - a.createdon * 1000)
  return response
}

export const useGetAdminAgents = (sortType: string | undefined) => {
  return useQuery({
    queryKey: ['adminAgents', sortType],
    queryFn: () => getAllAgents(),
    initialData: () => {
      const allAgents = queryClient.getQueryData<AdminAgents>([
        'adminAgents',
        ''
      ])
      return allAgents && allAgents.length > 0 ? allAgents : undefined
    },
    enabled: sortType === 'agents' ? true : false
  })
}