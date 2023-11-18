import { Currency } from "lucide-react";
import * as z from "zod";

type SelectObject = {
  value: string;
  label: string;
};
type Constituency = {
  region: string;
  constituencies: Array<string>;
};

export type DonorStatsType = {
  [key: string]: number;
};

export const apiUrl = "https://ndccc-79.localcan.dev";
export const paystackPK = "pk_live_b4b73acf8cdc1f5a1a74b1695eb92748c53a6c06"; // 'pk_test_9f1bd6cc9d40c81524b46a528409d00533b71475'
type Currency = "NGN" | "GHS" | "USD" | "ZAR" | "KES" | "XOF";

export const trxCurr: Currency = "GHS";
export type PaymentPurpose =
  | "registration"
  | "upgrade"
  | "reprint"
  | "monthly fee"
  | "outstanding";
// const phoneRegex = /^233[25]\d{8}$/;
// const phoneRegex =       /^(233[25]\d{7}|0[25]\d{8}|(\+233[25])\d{7})$/;
// const phoneNumberRegex = /^(233[25]\d{7}|0[25]\d{8}|\+233[25]\d{7})$/;

export type PaymentDTO = {
  userid: string;
  amount: number;
  transactionid: string;
  purpose: PaymentPurpose;
};

export interface PmtCategory {
  name: string;
  value: number;
}

export const ageRange: Array<SelectObject> = [
  {
    value: "18-19",
    label: "18-19",
  },
  {
    value: "20-29",
    label: "20-29",
  },
  {
    value: "30-39",
    label: "30-39",
  },
  {
    value: "40-49",
    label: "40-49",
  },
  {
    value: "50-59",
    label: "50-59",
  },
  {
    value: "60-69",
    label: "60-69",
  },
  {
    value: "70-79",
    label: "70-79",
  },
  {
    value: "80-89",
    label: "80-89",
  },
  {
    value: "90-99",
    label: "90-99",
  },
];

export type PaystackResponse = {
  reference: string;
  trans: string;
  status: string;
  message: string;
  transaction: string;
  trxref: string;
  redirecturl: string;
};

export type RegisteredUser = {
  id: string;
  fullname: string;
  phonenumber: string;
  sex: string;
  agerange: string;
  resident: string;
  region: string;
  constituency: string;
  industry: string;
  occupation: string;
  category: string;
  displaynameoncard: boolean;
  cardpickuplocation: string;
  requestcard: boolean;
  active: boolean;
  agent: string;
  createdon: EpochTimeStamp;
  updatedon: EpochTimeStamp;
};

export const regions: Array<string> = [
  "Western",
  "Central",
  "Greater Accra",
  "Volta",
  "Eastern",
  "Ashanti",
  "Western North",
  "Ahafo",
  "Bono",
  "Bono East",
  "Oti",
  "Northern",
  "Upper West",
  "North East",
  "Upper East",
  "Savannah",
];

export const allConstituencies: Array<Constituency> = [
  {
    region: "western",
    constituencies: [
      "Jomoro",
      "Ellembele",
      "Ajomoro Gwira",
      "Ahanta West",
      "Takoradi",
      "Sekondi",
      "Essikadu Ketan",
      "Effia",
      "Kwesimintsim",
      "Shama",
      "Wassa East",
      "Mpohor",
      "Tarkwa Nsuaem",
      "Prestea Huni Valley",
      "Wassa Amenfi East",
      "Amenfi Central",
      "Amenfi West",
    ],
  },
  {
    region: "central",
    constituencies: [
      "Komenda Edina Eguafo Abirem",
      "Cape Coast South",
      "Cape Coast North",
      "Abura Asebu Kwamankese",
      "Mfantseman",
      "Ekumfi",
      "Ajumako Enyan Esiam",
      "Gomoa West",
      "Gomoa Central",
      "Gomoa East",
      "Effutu",
      "Awutu Senya West",
      "Awutu Senya East",
      "Agona West",
      "Agona East",
      "Asikuma Odoben Brakwa",
      "Assin Central",
      "Assin North",
      "Assin South",
      "Twifo Atti Morkwa",
      "Hemang Lower Denkyira",
      "Upper Denkyira East",
      "Upper Denkyira West",
    ],
  },
  {
    region: "greater accra",
    constituencies: [
      "Bortianor NgleshieAmanfro",
      "Domeabra Obom",
      "Weija Gbawe",
      "Anyaa Sowutuom",
      "Trobu",
      "Amasaman",
      "Dome Kwabenya",
      "Madina",
      "Ayawaso East",
      "Ayawaso North",
      "Ayawaso Central",
      "Ayawaso West Wuogon",
      "Okaikwei North",
      "Ablekuma South",
      "Ododoiodio",
      "Okiakwei North",
      "Okakwei Central",
      "Ablekuma North",
      "Ablekuma Central",
      "Korle Klottey",
      "Dade Kotopon",
      "Ledzokuku",
      "Krowor",
      "Tema East",
      "Tema Central",
      "Tema West",
      "Kpone Katamanso",
      "Ashaiman",
      "Adentan",
      "Shai Osudoku",
      "Ningo Prampram",
      "Sege",
      "Ada",
    ],
  },
  {
    region: "volta",
    constituencies: [
      "Keta",
      "Anlo",
      "Ketu South",
      "Ketu North",
      "Akatsi South",
      "Akatsi North",
      "South Tongu",
      "North Tongu",
      "Adaklu",
      "AgotimeZiope",
      "Ho Central",
      "Ho West",
      "South Dayi",
      "Kpando",
      "North Dayi",
      "HoHohoe",
      "Afadjato South",
    ],
  },
  {
    region: "eastern",
    constituencies: [
      "Asuogyaman",
      "Lower Manya Krobo",
      "Upper Manya Krobo",
      "Yilo Krobo",
      "New Jauben South",
      "New Jauben North",
      "Akropong",
      "Okere",
      "Akuapem South",
      "Nsawam Adoagyiri",
      "Suhum",
      "Ayensuano",
      "Lower West Akim",
      "Upper West Akim",
      "Akim Oda",
      "Asene Manso Akroso",
      "Birim South",
      "Achiase",
      "Ofoase Ayirebi",
      "Kade",
      "Akwatia",
      "Abirem",
      "Abuakwa South",
      "Abuakwa North",
      "Atiwa West",
      "Atiwa East",
      "Fanteakwa North",
      "Fanteakwa South",
      "Nkawkaw",
      "Mpreaso",
      "Kwahu East",
      "Kwahu Afram Plains North",
      "Afram Plains South",
    ],
  },
  {
    region: "ashanti",
    constituencies: [
      "New Edubiase",
      "Akrofuom",
      "Fomena",
      "Adansi Asokwa",
      "Obuasi West",
      "Obuasi East",
      "Bekwai",
      "Bosome Freho",
      "Odotobri",
      "Manso Nkwanta",
      "Manso Adubia",
      "Atwima Nwabiagya South",
      "Atwima Nwabiagya North",
      "Atwima Mponua",
      "Bosomtwe",
      "Atwima Kwanwoma",
      "Bantama",
      "Nhyiaeso",
      "Subin",
      "Manhyia North",
      "Kwadaso",
      "OldTafo",
      "Suame",
      "Asokwa",
      "Oforikrom",
      "Asawase",
      "Kwabre East",
      "Afigya Kwabre South",
      "Afigya Kwabre North",
      "Juaben",
      "Ejisu",
      "Asante Akim South",
      "Asante Akim Central",
      "Asante Akim North",
      "Effidiase Asokore",
      "Kumawu",
      "Sekye Afram Plains",
      "Nsuta Kwamang Beposo",
      "Mampong",
      "Ejura Sekyedumase",
      "Afigya Seyere East",
      "Offinso South",
      "Offinso North",
      "Ahafo Ano South West",
      "Ahafo Ano South East",
      "Ahafo Ano North",
    ],
  },
  {
    region: "western north",
    constituencies: [
      "Aowin",
      "Suaman",
      "Bibiani Anhwiaso Bekwai",
      "Sefwi Wiawso",
      "Sefwi Akontombra",
      "Juaboso",
      "Bodi",
      "Bia West",
      "Bia East",
    ],
  },
  {
    region: "ahafo",
    constituencies: [
      "Asunafo South",
      "Asunafo North",
      "Asutifi South",
      "Asutifi North",
      "Tano South",
      "Tano North",
    ],
  },
  {
    region: "bono",
    constituencies: [
      "Sunyani East",
      "Sunyani West",
      "Dormaa West",
      "Dormaa Central",
      "Dormaa East",
      "Berekum East",
      "Berekum West",
      "Jaman South",
      "Jaman North",
      "Banda",
      "Tain",
      "Wenchi",
    ],
  },
  {
    region: "bono east",
    constituencies: [
      "Techiman South",
      "Kintampo North",
      "Kintampo South",
      "Nkronza North",
      "Nkronza South",
      "Atebubu Amantin",
      "Pru West",
      "Pru East",
      "Sene West",
      "Sene East",
      "Techiman North",
    ],
  },
  {
    region: "oti",
    constituencies: [
      "Buem",
      "Biakoye",
      "Akan",
      "Krachi East",
      "Krachi West",
      "Krachi Nchumuru",
      "Nkwanta South",
      "Nkwanta North",
      "Guan",
    ],
  },
  {
    region: "northern",
    constituencies: [
      "Kpandai",
      "Bimbilla",
      "Wulensi",
      "Zabzugu",
      "Tatale Sanguli",
      "Yendi",
      "Mion",
      "Saboba",
      "Gushegu",
      "Karaga",
      "Savelugu",
      "Nanton",
      "Tamale South",
      "Tamale Central",
      "Sagnarigu",
      "Tamale North",
      "Tolon",
      "Kumbungu",
    ],
  },
  {
    region: "savannah",
    constituencies: [
      "Bole Bamboi",
      "Sawla Tuna Kalba",
      "Damongo",
      "Daboya Mankarigu",
      "Yapei Kusawgu",
      "Salaga South",
      "Salaga Noth",
    ],
  },
  {
    region: "upper west",
    constituencies: [
      "Wa Central",
      "Wa West",
      "Wa East",
      "Nadowli Kaleo",
      "Daffiama Bussie Issa",
      "Jirapa",
      "Lambussie",
      "Lawra",
      "Nandom",
      "Sissala West",
      "Sissala East",
    ],
  },
  {
    region: "north east",
    constituencies: [
      "Walewale",
      "Yagaba Kubori",
      "Nalerigu Gambaga",
      "Bunkpurugu",
      "Yunyoo",
      "Chereponi",
    ],
  },
];

export const industries: Array<SelectObject> = [
  {
    value: "legal",
    label: "Legal",
  },
  {
    value: "pharmaceutical",
    label: "Pharmaceutical",
  },
  {
    value: "ict",
    label: "ICT",
  },
  {
    value: "manufacturing",
    label: "Manufacturing",
  },
  {
    value: "mining",
    label: "Mining",
  },
  {
    value: "media",
    label: "Media",
  },
  {
    value: "agriculture",
    label: "Agriculture",
  },
  {
    value: "education",
    label: "Education",
  },
  {
    value: "finance",
    label: "Finance",
  },
  {
    value: "security",
    label: "Security",
  },
  {
    value: "healthcare",
    label: "Health Care",
  },
  {
    value: "public servant",
    label: "Public Servant",
  },
  {
    value: "petroleum",
    label: "Petroleum",
  },
  {
    value: "others",
    label: "Others",
  },
];

export const paymentCategories: Array<SelectObject> = [
  {
    value: "hope",
    label: "Hope GH₵ 50",
  },
  {
    value: "arise",
    label: "Arise GH₵ 100",
  },
  {
    value: "justice",
    label: "Justice GH₵ 150",
  },
  {
    value: "freedom",
    label: "Freedom GH₵ 200",
  },
  {
    value: "loyalty",
    label: "Loyalty GH₵ 250",
  },
  {
    value: "standard",
    label: "Standard GH₵ 500",
  },
  {
    value: "bronze",
    label: "Bronze GH₵ 1000",
  },
  {
    value: "silver",
    label: "Silver GH₵ 2000",
  },
  {
    value: "gold",
    label: "Gold GH₵ 5,000",
  },
  {
    value: "platinum",
    label: "Platinum GH₵ 10,000",
  },
  {
    value: "prestige",
    label: "Prestige GH₵ 20,000",
  },
  {
    value: "prestige plus",
    label: "Prestige Plus GH₵ 50,000",
  },
];

export const gender: Array<SelectObject> = [
  {
    value: "male",
    label: "Male",
  },
  {
    value: "female",
    label: "Female",
  },
];

export const residency: Array<SelectObject> = [
  {
    value: "ghana",
    label: "Ghana",
  },
  {
    value: "abroad",
    label: "Abroad",
  },
];

export const displayNameOnCardOptions: Array<SelectObject> = [
  {
    value: "yes",
    label: "Yes",
  },
  {
    value: "no",
    label: "No",
  },
];

export const pmtCategoryMap = new Map<string, number>([
  ["hope", 50.0],
  ["arise", 100.0],
  ["justice", 150.0],
  ["freedom", 200.0],
  ["loyalty", 250.0],
  ["standard", 500.0],
  ["bronze", 1000.0],
  ["silver", 2000.0],
  ["gold", 5000.0],
  ["platinum", 10000.0],
  ["prestige", 20000.0],
  ["prestige plus", 50000.0],
]);

export const registerSchema = z.object({
  firstName: z
    .string({
      required_error: "Please enter your first name",
    })
    .min(2, { message: "Please enter your first name" })
    .optional(),
  lastName: z
    .string({
      required_error: "Please enter your last name",
    })
    .min(2, { message: "Please enter your last name" })
    .optional(),
  agerange: z.string({
    required_error: "Please select an age range",
  }),
  phonenumber: z.string({
    required_error: "Please enter your phone number",
  }),
  // .regex(phoneRegex, "Please provide a valid phone number"),
  resident: z.string({
    required_error: "Please select your residency",
  }),
  sex: z.string({
    required_error: "Please select your sex",
  }),
  region: z.string({
    required_error: "Please select a region",
  }),
  constituency: z.string({
    required_error: "Please enter your constituency",
  }),
  industry: z.string({
    required_error: "Please select your industry",
  }),
  occupation: z.string({
    required_error: "Please enter your occupation",
  }),
  category: z.string({
    required_error: "Please select your category",
  }),
  displayNameOnCard: z
    .string({
      required_error: "Please choose one",
    })
    .optional(),
  cardpickuplocation: z.string({
    required_error: "Please select a pickup point",
  }),
  agent: z.string({}).optional()
});

export const reprintSchema = z.object({
  id: z
    .string({
      required_error: "Please provide your card ID",
    })
    .refine((val) => val.length === 16, {
      message: "Your ID must be 16 characters",
    }),
});

export const upgradeSchema = z.object({
  id: z
    .string({ required_error: "Please provide your card ID" })
    .refine((val) => val.length === 16, {
      message: "Your ID must be 16 characters",
    }),
  currentCategory: z.string(),
  newCategory: z.string(),
});

export const pmtCategoriesArray: PmtCategory[] = Array.from(
  pmtCategoryMap.entries()
).map(([name, value]) => ({ name, value }));

export function generateRandomString(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

export const loginSchema = z.object({
  id: z
    .string({ required_error: "Please enter your ID" })
    .refine((val) => val.length === 12, {
      message: "Your ID must me 12 characters",
    }),
  password: z
    .string({ required_error: "Please provide a password" })
    .refine((val) => val.length >= 6, {
      message: "Your password must be at least 6 characters",
    }),
});

export const formatId = (str: string): string => {
  const formattedId = str.replace(
    /(.{3})(.{4})(.{4})(.{4})(.{1})/,
    "$1 $2 $3 $4 $5"
  );
  return formattedId;
};

export const formatAgentID = (input: string): string =>{
  // Check if the input is a valid 12-digit string
  if (/^\d{12}$/.test(input)) {
    // Format the string as 'AGT XXXX XXXX X'
    const formattedString =
      "AGT " +
      input.substr(3, 4) +
      " " +
      input.substr(7, 4) +
      " " +
      input.substr(11, 1);

    return formattedString;
  } else {
    // If the input is not a valid 12-digit string, return an error message or handle it as needed
    return "Invalid input";
  }
}