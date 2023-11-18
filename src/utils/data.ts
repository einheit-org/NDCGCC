import { z } from "zod";
import {
  DonorStatsType,
  PaymentDTO,
  RegisteredUser,
  apiUrl,
  registerSchema,
} from "./constants";
import { json } from "react-router-dom";

export const recordPayment = async (payload: PaymentDTO) => {
  try {
    const response = await fetch(`${apiUrl}/payment`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (response.status !== 200) {
      throw new Response("We encountered a problem. Please try agaain", {
        status: response.status,
      });
    }
    return response.status;
  } catch (error) {
    throw new Error("We encountered an error");
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
    const response = await fetch(`${apiUrl}/upgrade`, {
      method: "POST",
      body: JSON.stringify({
        id: userid,
        category: category,
        cost: cost,
      }),
    });
    if (response.status !== 200) {
      throw new Response("We encountered a problem. Please try agaain", {
        status: response.status,
      });
    }
    return response.status;
  } catch (error) {
    throw new Error("We encountered an error");
  }
};

export const activateUser = async (userid: string) => {
  try {
    const response = await fetch(`${apiUrl}/activate`, {
      method: "POST",
      body: JSON.stringify({
        id: userid,
      }),
    });
    if (response.status !== 200) {
      throw new Response("We encountered a problem. Please try agaain", {
        status: response.status,
      });
    }
    return response.status;
  } catch (error) {
    throw new Error("We encountered an error");
  }
};

export const getUser = async (
  userid: string
): Promise<RegisteredUser | undefined> => {
  try {
    const response = await fetch(`${apiUrl}/user`, {
      method: "POST",
      body: JSON.stringify({
        id: userid,
      }),
    });
    if (response.status !== 200) {
      throw new Response("We encountered a problem. Please try agaain", {
        status: response.status,
      });
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("We encountered an error");
  }
};

export const registerNewUser = async (
  payload: z.infer<typeof registerSchema>
): Promise<{ id: string; name: string; issuedon: string } | undefined> => {
  try {
    const response = await fetch(`${apiUrl}/register`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (response.status !== 200) {
      throw json("We encountered a problem. Please try again", {
        status: response.status,
      });
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("We encountered an error");
  }
};

export const issueCardReprint = async (userid: string) => {
  try {
    const response = await fetch(`${apiUrl}/reprint`, {
      method: "POST",
      body: JSON.stringify({ id: userid }),
    });
    return response.status;
  } catch (error) {
    throw new Error("We encountered an error");
  }
};

export const getOutstandingPayments = async (
  userid: string
): Promise<{ id: string; outstanding: number } | undefined> => {
  try {
    const response = await fetch(`${apiUrl}/outstanding`, {
      method: "POST",
      body: JSON.stringify({ id: userid }),
    });
    if (response.status !== 200) {
      throw json("We encountered a problem. Please try again", {
        status: response.status,
      });
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("We encountered an error");
  }
};

export const getDonorStats = async (): Promise<DonorStatsType | undefined> => {
  try {
    const response = await fetch(`${apiUrl}/donorstats`, {
      method: "POST",
    });
    if (response.status !== 200) {
      throw json("We encountered a problem. Please try again", {
        status: response.status,
      });
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("We encountered an error");
  }
};

export const sendAgentLogin = async (payload: {
  id: string;
  password: string;
}) => {
  try {
    const response = await fetch(`${apiUrl}/agent/login`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (response.status !== 200) {
      throw new Response("We encountered a problem. Please try agaain", {
        status: response.status,
      });
    }
    return response.status;
  } catch (error) {
    throw new Error("We encountered an error");
  }
};

export const getAllDonors = async (
  userid: string,
  cat?: string
): Promise<
  | Array<{
      id: string;
      category: string;
      pendingpayments: boolean;
      active: boolean;
    }>
  | undefined
> => {
  try {
    const response = await fetch(`${apiUrl}/agent/signups/filter`, {
      method: "POST",
      body: JSON.stringify({
        id: userid,
        filterbycategory: cat ?? "",
      }),
    });
    if (response.status !== 200) {
      throw new Response("We encountered a problem. Please try agaain", {
        status: response.status,
      });
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("We encountered an error");
  }
};
