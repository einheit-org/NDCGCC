import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import MainNav from "@/components/widgets/MainNav";
import {
  PaymentDTO,
  PaystackResponse,
  PmtCategory,
  RegisteredUser,
  generateRandomString,
  pmtCategoriesArray,
  pmtCategoryMap,
  trxCurr,
  upgradeSchema,
} from "@/utils/constants";
import { getUser, recordPayment, submitUpgrade } from "@/utils/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectViewport } from "@radix-ui/react-select";
import { RotateCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { usePaystackPayment } from "react-paystack";
import { z } from "zod";

// payment purpose
// { purpose: 'upgrade' }
// todo
/**
 *  make /user call -> get details by id
 *  show categories above current user category
 *  make payment via paystack
 *  onSuccess -> register payment at /payment
 *  reset form on completion
 * **/
export default function Upgrade() {
  const didMount = useRef(false);
  const initConfig = useMemo(() => {
    return {
      publicKey: import.meta.env.VITE_PAYSTACK_LIVE,
      currency: trxCurr,
      amount: 0,
      email: `${generateRandomString(7)}@ndcspecial.com`,
      reference: "",
    };
  }, []);
  const initialValues = useMemo(() => {
    return {
      id: "",
      currentCategory: "",
      newCategory: "",
    };
  }, []);
  const upgradeForm = useForm<z.infer<typeof upgradeSchema>>({
    resolver: zodResolver(upgradeSchema),
    defaultValues: initialValues,
  });
  const { toast } = useToast();
  const [config, setConfig] = useState(initConfig);
  const [isLoading, setIsLoading] = useState(false);
  const [upgFormErrors, setUpgFormErrors] = useState(false);
  const [pmtSuccess, setPmtSuccess] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);
  const [upgradeCategory, setUpgradeCategory] = useState("");
  const [proposedAmount, setProposedAmount] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<RegisteredUser | undefined>();
  const [updatedCategoryList, setUpdatedCategoryList] =
    useState<Array<PmtCategory>>();
  const watchCategory = upgradeForm.watch("currentCategory");
  const watchNewCategory = upgradeForm.watch("newCategory");
  const initializePayment = usePaystackPayment(config);

  // const processedAmt = pmtCategoryMap.get('justice')
  const runTrx = useCallback(
    async (userid: string, transactionid: string) => {
      const pmtPayload: PaymentDTO = {
        userid: userid,
        amount: proposedAmount ?? 0,
        transactionid: transactionid,
        purpose: "upgrade",
      };

      const upgPayload = {
        userid: userid,
        category: upgradeCategory,
        cost: proposedAmount,
      };

      const [recordPmt, recordUpgrade] = await Promise.all([
        recordPayment(pmtPayload),
        submitUpgrade(upgPayload),
      ]);

      if (recordPmt === 200 && recordUpgrade === 200) {
        setPmtSuccess(true);
        setUpgradeSuccess(true);
      }
    },
    [proposedAmount, upgradeCategory]
  );

  const onClose = useCallback(() => {
    setCurrentUser(undefined);
    setConfig(initConfig);
    upgradeForm.reset(initialValues);
    toast({
      variant: "destructive",
      title: "Are you sure?",
      description: "Closing this will stop your payment from processing",
    });
  }, [toast, initConfig, initialValues, upgradeForm]);

  const onSuccess = useCallback(
    (reference: PaystackResponse): void => {
      setConfig(initConfig);
      runTrx(currentUser?.id ?? "", reference.trxref);
    },
    [runTrx, currentUser, initConfig]
  );

  const preparePayment = () => {
    const formValues = upgradeForm.getValues();
    const newAmt = pmtCategoryMap.get(formValues.newCategory.toLowerCase() ?? "");
    const oldAmt = pmtCategoryMap.get(formValues.currentCategory.toLowerCase() ?? "")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const actualAmt = oldAmt && newAmt ? newAmt - oldAmt : 0
    setProposedAmount(actualAmt)
    setUpgradeCategory(formValues.newCategory);
    setConfig({
      ...config,
      // amount: actualAmt * 100 || 0,
      amount: 50,
      reference: new Date().getTime().toString(),
    });
  };

  const getUserDetails = async (values: z.infer<typeof upgradeSchema>) => {
    setIsLoading(true);
    const response = await getUser(values.id);
    if (response) {
      setIsLoading(false);
      setCurrentUser(response);
    } else {
      setIsLoading(false);
      setUpgFormErrors(true);
      toast({
        variant: "destructive",
        title: "Sorry! Something went wrong",
        description: "There was a problem. Please try again",
      });
    }
  };

  useEffect(() => {
    if (currentUser) {
      upgradeForm.reset({
        id: currentUser.id,
        currentCategory: currentUser.category.toUpperCase(),
      });
    } else {
      upgradeForm.reset(initialValues)
    }
  }, [currentUser, upgradeForm, initialValues]);

  useEffect(() => {
    if (currentUser && watchCategory) {
      const copyCategories = pmtCategoriesArray.slice();
      const catIndex = copyCategories.findIndex(
        (item) => item.name === currentUser.category
      );
      if (catIndex !== -1) {
        setUpdatedCategoryList(
          copyCategories.splice(catIndex + 1, copyCategories.length)
        );
      }
    }
  }, [currentUser, watchCategory]);

  useEffect(() => {
    if (upgradeSuccess && pmtSuccess) {
      toast({
        variant: "default",
        title: "Great! Payment successful",
        description:
          "Your contribution was successfully made. Your card will be printed and sent you your regional head office.",
      });
    }
    setCurrentUser(undefined)
  }, [pmtSuccess, upgradeSuccess, toast]);

  useEffect(() => {
    if (upgFormErrors) {
      upgradeForm.reset(initialValues);
    }
  }, [upgradeForm, upgFormErrors, initialValues]);


  useEffect(() => {
    if (didMount.current) {
      didMount.current = false;
      return;
    }
    if (config.amount > 0) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      initializePayment(onSuccess, onClose);
    }
  }, [config, initializePayment, onClose, onSuccess]);

  return (
    <div className="bg-ndcgreen/90 w-full min-h-screen">
      <MainNav />
      {/* <div className="flex flex-row justify-start items-center">
        <Link
          to="/"
          className="w-12 h-12 rounded-full bg-black text-white flex flex-col items-center justify-center"
        >
          <ArrowLeft />
        </Link>
      </div> */}
      <div className="container mx-auto px-1 h-full  py-20">
        {/* <div className="mx-auto bg-white/80 rounded-full mb-4   p-5 h-[96px] w-[96px] md:w-[128px] md:h-[128px] flex items-center justify-center">
          <img
            alt=""
            loading="lazy"
            width="461"
            height="541"
            decoding="async"
            data-nimg="1"
            src="/logo.png"
          />
        </div> */}
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-5/12 px-4 ">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg bg-white/90 border-0 pt-5">
              <h6 className="text-ndcred/80 text-lg font-bold uppercase text-center">
                Good Governance Card Upgrade
              </h6>
              <hr className="mt-2 border-b-1 border-green-700 mx-10" />
              <div className="flex-auto px-4 lg:px-10 py-10 pt-5">
                <Form {...upgradeForm}>
                  <form onSubmit={upgradeForm.handleSubmit(getUserDetails)}>
                    <div className="relative w-full mb-4">
                      <FormField
                        control={upgradeForm.control}
                        name="id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block uppercase text-black text-xs font-bold mb-2">
                              Card ID
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="text"
                                placeholder="Please enter your Card ID"
                                name="id"
                                className="placeholder:text-sm w-full rounded-md py-4 h-10 text-sm px-4 mt-2 bg-white capitalize"
                              />
                            </FormControl>
                            <FormDescription className="text-red-600 text-sm">
                              {upgradeForm.formState.errors.id?.message ?? ""}
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="relative w-full mb-5">
                      <FormField
                        control={upgradeForm.control}
                        name="currentCategory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block uppercase text-black text-xs font-bold mb-2">
                              Current Category
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled
                                type="text"
                                placeholder="Your current category"
                                name="id"
                                className="placeholder:text-sm w-full rounded-md py-4 h-10 text-sm px-4 mt-2 bg-white"
                              />
                            </FormControl>
                            <FormDescription className="text-red-600 text-sm">
                              {upgradeForm.formState.errors.currentCategory
                                ?.message ?? ""}
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="relative w-full mb-5">
                      <FormField
                        control={upgradeForm.control}
                        name="newCategory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block uppercase text-black text-xs font-bold mb-2">
                              Upgrade Category
                            </FormLabel>
                            <FormControl>
                              <Select
                                disabled={
                                  watchCategory && watchCategory.length > 0
                                    ? false
                                    : true
                                }
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="bg-white rounded-md py-5 px-4 mt-2 capitalize">
                                  <SelectValue placeholder="Select your new category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectViewport>
                                    {updatedCategoryList &&
                                      updatedCategoryList.map((item, idx) => (
                                        <SelectItem
                                          className="pl-3 py-2 capitalize"
                                          key={idx}
                                          value={item.name}
                                        >{`${item.name} GHS ${item.value}`}</SelectItem>
                                      ))}
                                    {/* <SelectItem className="pl-3 py-2" value="100">New Category</SelectItem> */}
                                  </SelectViewport>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="text-center mt-5">
                      {!currentUser && (
                        <button
                          className="disabled:opacity-70 mx-auto flex flex-row items-center justify-center w-full uppercase bg-gradient-to-r from-ndcgreen to-ndcgreen/40  hover:from-ndcred hover:to-ndcred/30 text-white font-bold py-3 px-8 shadow-lg"
                          type="submit"
                          aria-disabled={isLoading}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <RotateCw className="animate-spin" />
                          ) : (
                            <span>Get Details</span>
                          )}
                        </button>
                      )}
                      {currentUser && watchNewCategory ? (
                        <button
                          type="button"
                          className="disabled:opacity-70 mx-auto flex flex-row items-center justify-center w-full uppercase bg-gradient-to-r from-ndcgreen to-ndcgreen/40  hover:from-ndcred hover:to-ndcred/30 text-white font-bold py-3 px-8 shadow-lg"
                          onClick={preparePayment}
                        >
                          {isLoading ? (
                            <RotateCw className="animate-spin" />
                          ) : (
                            <span>Make Payment</span>
                          )}
                        </button>
                      ) : null}
                      {currentUser && !watchNewCategory ? (
                        <p>
                          Please select a new category to proceed with payment
                        </p>
                      ) : null}
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
