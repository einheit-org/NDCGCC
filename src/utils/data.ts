import { PaymentDTO, RegisteredUser } from './constants';

export const recordPayment = async (payload: PaymentDTO) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/payment`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (response.status !== 200) {
      throw new Response('We encountered a problem. Please try agaain', {
        status: response.status,
      });
    }
    return response.status;
  } catch (error) {
    throw new Error('We encountered an error');
  }
};

export const submitUpgrade = async ({
  userid,
  category,
  cost,
}: {
  userid: string;
  category: string;
  cost: number;
}) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/upgrade`, {
      method: 'POST',
      body: JSON.stringify({
        id: userid,
        category: category,
        cost: cost,
      }),
    });
    if (response.status !== 200) {
      throw new Response('We encountered a problem. Please try again', {
        status: response.status,
      });
    }
    return response.status;
  } catch (error) {
    throw new Error('We encountered an error');
  }
};

export const activateUser = async (userid: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/activate`, {
      method: 'POST',
      body: JSON.stringify({
        id: userid,
      }),
    });
    if (response.status !== 200) {
      throw new Response('We encountered a problem. Please try agaain', {
        status: response.status,
      });
    }
    return response.status;
  } catch (error) {
    throw new Error('We encountered an error');
  }
};

export const getUser = async (
  userid: string,
): Promise<RegisteredUser | undefined> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
      method: 'POST',
      body: JSON.stringify({
        id: userid,
      }),
    });
    if (response.status !== 200) {
      throw new Response('We encountered a problem. Please try agaain', {
        status: response.status,
      });
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('We encountered an error');
  }
};

// export const registerNewUser = async (
//   payload: z.infer<typeof registerSchema>
// ): Promise<{ id: string; name: string; issuedon: string } | undefined> => {
//   try {
//     const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
//       method: "POST",
//       body: JSON.stringify(payload),
//     });
//     if (response.status !== 200) {
//       throw json("We encountered a problem. Please try again", {
//         status: response.status,
//       });
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     throw new Error("We encountered an error");
//   }
// };

export const issueCardReprint = async (userid: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/reprint`, {
      method: 'POST',
      body: JSON.stringify({ id: userid }),
    });
    return response.status;
  } catch (error) {
    throw new Error('We encountered an error');
  }
};

// export const getOutstandingPayments = async (
//   userid: string
// ): Promise<{ id: string; outstanding: number } | undefined> => {
//   try {
//     const response = await fetch(
//       `${import.meta.env.VITE_API_URL}/outstanding`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${generateRequestToken()}`,
//         },
//         body: JSON.stringify({ id: userid }),
//       }
//     );
//     if (response.status !== 200) {
//       throw json("We encountered a problem. Please try again", {
//         status: response.status,
//       });
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     throw new Error("We encountered an error");
//   }
// };

// export const getDonorStats = async (): Promise<DonorStatsType | undefined> => {
//   try {
//     const response = await fetch(`${import.meta.env.VITE_API_URL}/donorstats`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${generateRequestToken()}`,
//       },
//     });
//     if (response.status !== 200) {
//       throw json("We encountered a problem. Please try again", {
//         status: response.status,
//       });
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     throw new Error("We encountered an error");
//   }
// };

export const sendAgentLogin = async (payload: {
  id: string;
  password: string;
}) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/agent/login`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    );
    // if (response.status !== 200) {
    //   throw new Response("We encountered a problem. Please try agaain", {
    //     status: response.status,
    //   });
    // }
    return response.status;
  } catch (error) {
    // return error
    throw new Response('We encountered a problem. Please try agaain', {
      status: 400,
    });
  }
};

export const getAgentData = async (
  userid: string,
): Promise<
  | {
      id: string;
      fullname: string;
      region: string;
      createdon: any;
      updatedon: any;
    }
  | undefined
> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/agent`, {
      method: 'POST',
      body: JSON.stringify({
        id: userid,
      }),
    });
    if (response.status !== 200) {
      throw new Response('We encountered a problem. Please try again', {
        status: response.status,
      });
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('We encountered an error');
  }
};

export const getAllDonors = async (
  userid: string,
  cat?: string,
): Promise<
  | Array<{
      id: string;
      category: string;
      fullname: string;
      pendingpayments: boolean;
      active: boolean;
      createdon: EpochTimeStamp;
    }>
  | undefined
> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/agent/signups/filter`,
      {
        method: 'POST',
        body: JSON.stringify({
          id: userid,
          filterbycategory: cat ?? '',
        }),
      },
    );
    if (response.status !== 200) {
      throw new Response('We encountered a problem. Please try agaain', {
        status: response.status,
      });
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return;
    // console.error(error)
    // return error
    // throw new Error("We encountered an error");
  }
};
export const getDonorReports = async (
  id: string,
): Promise<
  | {
      report: Array<{
        userid: string;
        category: string;
        name: string;
        amount: number;
        purpose: string;
        createdon: EpochTimeStamp;
      }>;
      total: number;
    }
  | undefined
> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/donor/report`,
      {
        method: 'POST',
        body: JSON.stringify({
          id: id,
        }),
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    return;
  }
};

export const showAdminDonors = async (
  cat?: string,
  start?: EpochTimeStamp,
  end?: EpochTimeStamp,
): Promise<
  | Array<{
      id: string;
      name: string;
      category: string;
      pendingpayments: boolean;
      agent: string;
      active: boolean;
      createdon: EpochTimeStamp;
    }>
  | undefined
> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/user/filter`,
      {
        method: 'POST',
        body: JSON.stringify({
          filterbycategory:
            cat === 'prestige plus' ? 'prestigeplus' : cat === 'all' ? '' : cat,
          start: start ?? 0,
          end: end ?? 0,
        }),
      },
    );
    if (response.status !== 200) {
      throw new Response('We encountered a problem. Please try again', {
        status: response.status,
      });
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return;
  }
};

export const showAllAgents = async (): Promise<
  | Array<{
      name: string;
      id: string;
      totalraised: string;
      createdon: EpochTimeStamp;
    }>
  | undefined
> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/donor/agent`,
      {
        method: 'POST',
      },
    );
    if (response.status !== 200) {
      throw new Response('We encountered a problem. Please try again', {
        status: response.status,
      });
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return;
  }
};

export const getAllUsers = async (): Promise<
  | Array<{
      name: string;
      id: string;
      category: string;
      pendingpayments: boolean;
      active: boolean;
    }>
  | undefined
> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/user/filter`,
      {
        method: 'POST',
        body: JSON.stringify({
          filterbycategory: '',
          start: 0,
          end: 0,
        }),
      },
    );
    if (response.status !== 200) {
      throw new Response('We encountered a problem. Please try agaain', {
        status: response.status,
      });
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return;
  }
};

export const getDonorSum = async (): Promise<{ total: number } | undefined> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/donor/sum`, {
      method: 'POST',
    });
    if (response.status !== 200) {
      throw new Response('We encountered a problem. Please try agaain', {
        status: response.status,
      });
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return;
  }
};

export const getDonorTotals = async (): Promise<
  { self: number; agent: number } | undefined
> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/donor/totals`,
      {
        method: 'POST',
      },
    );
    if (response.status !== 200) {
      throw new Response('We encountered a problem. Please try agaain', {
        status: response.status,
      });
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return;
  }
};
