import { request } from "@/services/request"
import { useMutation } from "@tanstack/react-query"

const issueCardReprint = async (id: string) => {
  const response = request(`${import.meta.env.VITE_API_URL}/reprint`, {
    body: { id: id }
  })
  return response
}

export const useIssueCardReprint = () => {
  return useMutation({
    mutationKey: ['issueCardReprint'],
    mutationFn: (id: string) => issueCardReprint(id)
  })
}