import { request } from '@/services/request';
import { useMutation } from '@tanstack/react-query';

const recordFailedPayments = async (payload: {
  txid: string;
  userid: string;
  fullname: string;
  service: string;
  createdon: EpochTimeStamp;
}) => {
  const response = await request(`${import.meta.env.VITE_API_URL}/tx/failed`, {
    body: payload,
  });
  return response;
};

export const useRecordFailedTrx = () => {
  return useMutation({
    mutationKey: ['recordFailedTrx'],
    mutationFn: (payload: {
      txid: string;
      userid: string;
      fullname: string;
      service: string;
      createdon: EpochTimeStamp;
    }) => recordFailedPayments(payload),
  });
};
