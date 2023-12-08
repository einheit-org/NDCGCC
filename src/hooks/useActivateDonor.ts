import { request } from '@/services/request';
import { useMutation } from '@tanstack/react-query';

const activateUser = async (userid: string) => {
  const response = request(`${import.meta.env.VITE_API_URL}/activate`, {
    body: { id: userid },
  });
  return response;
};

export const useActivateDonor = () => {
  return useMutation({
    mutationKey: ['activateDonor'],
    mutationFn: (userid: string) => activateUser(userid),
  });
};
