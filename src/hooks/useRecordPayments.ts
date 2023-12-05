import { request } from '@/services/request';
import { PaymentDTO } from '@/utils/constants';
import { useMutation } from '@tanstack/react-query';

const makePayments = async (payload: PaymentDTO) => {
  const response = await request(`${import.meta.env.VITE_API_URL}/payment`, {
    body: payload,
  });
  return response;
};

export const useRecordPayments = () => {
  return useMutation({
    mutationKey: ['recordPayment'],
    mutationFn: (payload: PaymentDTO) => makePayments(payload),
  });
};
