import { queryClient } from '@/services/queryClient';
import { request } from '@/services/request';
import { getDonorSum, getDonorTotals } from '@/utils/data';
import { useQuery } from '@tanstack/react-query';

export type CardCategory =
  | 'all'
  | 'hope'
  | 'arise'
  | 'justice'
  | 'freedom'
  | 'loyalty'
  | 'standard'
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'prestige'
  | 'prestige plus';

export type SortSelf = 'self' | 'donors';

type AdminDonors = Array<{
  id: string;
  name: string;
  category: string;
  pendingpayments: boolean;
  agent: string;
  active: boolean;
  createdon: EpochTimeStamp;
}>;

const fetchAdminDonors = async (
  cat: CardCategory,
  start: EpochTimeStamp,
  end: EpochTimeStamp,
  status: string,
  self?: SortSelf,
) => {
  const response = await request<AdminDonors>(
    `${import.meta.env.VITE_API_URL}/user/filter`,
    {
      body: {
        filterbycategory:
          cat === 'prestige plus' ? 'prestigeplus' : cat === 'all' ? '' : cat,
        start: start,
        end: end,
      },
    },
  );
  const donorsList =
    self === 'self'
      ? response.filter((donor) => donor.agent === 'self')
      : response;

  if (status === 'all') {
    donorsList.sort((a, b) => b.createdon * 1000 - a.createdon * 1000);
    return donorsList;
  }
  if (status === 'active') {
    const activeDonors = donorsList?.filter((donor) => donor.active === true);
    activeDonors.sort((a, b) => b.createdon * 1000 - a.createdon * 1000);
    return activeDonors;
  }
  if (status === 'inactive') {
    const inactiveDonors = donorsList?.filter(
      (donor) => donor.active === false,
    );
    inactiveDonors.sort((a, b) => b.createdon * 1000 - a.createdon * 1000);
    return inactiveDonors;
  }
  if (self === 'self') {
    const selfDonors = response.filter((donor) => donor.agent === 'self');
    selfDonors.sort((a, b) => b.createdon * 1000 - a.createdon * 1000);
    return selfDonors;
  }
  donorsList.sort((a, b) => b.createdon * 1000 - a.createdon * 1000);
  return donorsList;
};

export const useAdminDonorsQuery = (
  cat: CardCategory,
  start: EpochTimeStamp,
  end: EpochTimeStamp,
  status: string,
  self?: SortSelf,
) => {
  return useQuery({
    queryKey: ['adminDonors', cat, start, end, status, self],
    queryFn: () => fetchAdminDonors(cat, start, end, status, self),
    initialData: () => {
      const allDonors = queryClient.getQueryData<AdminDonors>([
        'adminDonors',
        '',
      ]);

      return allDonors && allDonors.length > 0 ? allDonors : undefined;
    },
    enabled: self === 'self' || self === 'donors' ? true : false
  });
};

export const useGetDonorTotal = () => {
  return useQuery({
    queryKey: ['donorTotals'],
    queryFn: () => getDonorSum()
  })
}

export const useGetAgentSelfTotals = () => {
  return useQuery({
    queryKey: ['agentSelfTotals'],
    queryFn: () => getDonorTotals()
  })
}
