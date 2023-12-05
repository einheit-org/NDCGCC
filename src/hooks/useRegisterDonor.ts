import { request } from '@/services/request';
import { registerSchema } from '@/utils/constants';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

type NewRegisteredUser = {
  id: string;
  name: string;
  issuedon: string;
};

const registerDonor = async (payload: z.infer<typeof registerSchema>) => {
  const response = await request<NewRegisteredUser>(
    `${import.meta.env.VITE_API_URL}/register`,
    {
      body: payload,
    },
  );
  return response;
};

export const useRegisterDonor = () => {
  return useMutation({
    mutationKey: ['registerDonor'],
    mutationFn: (payload: z.infer<typeof registerSchema>) =>
      registerDonor(payload),
  });
};
