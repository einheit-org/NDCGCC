import { useQuery } from '@tanstack/react-query';
import { request } from '@/services/request';

type DonorStatsType = {
  [key: string]: number;
};

export const getDonorStats = async () => {
  const response = await request<DonorStatsType>(
    `${import.meta.env.VITE_API_URL}/donorstats`,
  );
  return response;
};

export const useGetDonorStats = () => {
  return useQuery({
    queryKey: ['donorwall'],
    queryFn: () => getDonorStats(),
  });
};
