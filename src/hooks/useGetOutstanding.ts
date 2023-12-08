import { request } from '@/services/request';
import { useMutation } from '@tanstack/react-query';

export type OutstandingType = {
  id: string;
  total: number;
  registrationfees: number;
  monthlyfees: {
    fees: number;
    months: Array<string>;
  };
};

const getOutstandingPayments = async (userid: string) => {
  const response = await request<OutstandingType>(
    `${import.meta.env.VITE_API_URL}/outstanding`,
    { body: { id: userid } },
  );
  return response;
};

export const useGetOutstanding = () => {
  return useMutation({
    mutationKey: ['outstanding'],
    mutationFn: (values: { id: string }) => getOutstandingPayments(values.id),
  });
};
