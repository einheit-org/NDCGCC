import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import UpgradeSummary from '@/components/widgets/UpgradeSummary';
import {
  PaymentDTO,
  PaystackResponse,
  PmtCategory,
  RegisteredUser,
  UpgradeSummaryType,
  formatId,
  pmtCategoriesArray,
  pmtCategoryMap,
  trxCurr,
  upgradeSchema,
} from '@/utils/constants';
import { getUser, recordPayment, submitUpgrade } from '@/utils/data';
import { zodResolver } from '@hookform/resolvers/zod';
import { SelectViewport } from '@radix-ui/react-select';
import { useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { RotateCw } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { usePaystackPayment } from 'react-paystack';
import { Link } from 'react-router-dom';
import { z } from 'zod';

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
      email: '',
      reference: '',
    };
  }, []);
  const initialValues = useMemo(() => {
    return {
      id: '',
      currentCategory: '',
      newCategory: '',
    };
  }, []);
  const upgradeForm = useForm<z.infer<typeof upgradeSchema>>({
    resolver: zodResolver(upgradeSchema),
    defaultValues: initialValues,
  });
  const { toast } = useToast();
  const [config, setConfig] = useState(initConfig);
  const initializePayment = usePaystackPayment(config);
  const [proposedAmount, setProposedAmount] = useState<number>(0);
  const [pmtSuccessful, setPmtSuccessful] = useState<boolean>(false);
  const [summaryData, setSummaryData] = useState<UpgradeSummaryType>();
  const [currentDonor, setCurrentDonor] = useState<
    RegisteredUser | undefined
  >();
  const [updatedCategoryList, setUpdatedCategoryList] =
    useState<Array<PmtCategory>>();
  const watchCategory = upgradeForm.watch('currentCategory');
  const watchNewCategory = upgradeForm.watch('newCategory');

  const { mutate: getDonorMutation, isPending: donorMutationPending } =
    useMutation({
      mutationKey: ['getCurrentDonor'],
      mutationFn: (values: z.infer<typeof upgradeSchema>) => getUser(values.id),
    });

  const getDonorDetails = async (values: z.infer<typeof upgradeSchema>) => {
    getDonorMutation(values, {
      onSuccess: (response) => {
        setCurrentDonor(response);
      },
      onError: (error) => {
        console.log(error.message);
      },
    });
  };

  const cancelPayment = () => {
    upgradeForm.reset(initialValues);
    setCurrentDonor(undefined);
    setSummaryData(undefined);
  };

  const prepareUpgradeSummary = (
    details: RegisteredUser | undefined,
    currentCategory: string,
    newCategory?: string,
  ) => {
    const isActive = details ? details.active : false;
    const amountToPay = calculateAmountToPay(isActive);
    const summaryPayload = {
      purpose: details?.active ? 'Upgrade' : 'Registration',
      fullname: details ? details.fullname : '',
      currentCategory: currentCategory.toLowerCase(),
      newCategory: newCategory?.toLowerCase() ?? 'N/A',
      amount: amountToPay,
      id: details ? details.id : '',
      createdon: details ? details.createdon : new Date().getTime() * 1000,
    };
    setSummaryData(summaryPayload);
  };

  const calculateAmountToPay = (active: boolean): number => {
    const currentCategory = upgradeForm
      .getValues('currentCategory')
      .toLowerCase();
    const newCategory =
      upgradeForm.getValues('newCategory')?.toLowerCase() ?? '';
    if (active) {
      const currentAmount = pmtCategoryMap.get(currentCategory) ?? 0;
      const newCategoryAmount = pmtCategoryMap.get(newCategory) ?? 0;
      setProposedAmount(newCategoryAmount - currentAmount);
      return newCategory ? newCategoryAmount - currentAmount : 0;
    } else {
      const amountToBePaid = pmtCategoryMap.get(currentCategory) ?? 0;
      setProposedAmount(amountToBePaid);
      return amountToBePaid;
    }
  };

  useEffect(() => {
    if (currentDonor) {
      upgradeForm.reset({
        id: currentDonor.id,
        currentCategory: currentDonor.category.toUpperCase(),
      });
    } else {
      upgradeForm.reset(initialValues);
    }
  }, [currentDonor, upgradeForm, initialValues]);

  useEffect(() => {
    if (currentDonor && watchCategory) {
      prepareUpgradeSummary(currentDonor, watchCategory);
      const copyCategories = pmtCategoriesArray.slice();
      const catIndex = copyCategories.findIndex(
        (item) => item.name === currentDonor.category,
      );
      if (catIndex !== -1) {
        setUpdatedCategoryList(
          copyCategories.splice(catIndex + 1, copyCategories.length),
        );
      }
    }
  }, [currentDonor, watchCategory]);

  useEffect(() => {
    if (watchNewCategory) {
      prepareUpgradeSummary(currentDonor, watchCategory, watchNewCategory);
    }
  }, [watchNewCategory]);

  // useEffect(() => {
  //   if (upgFormErrors) {
  //     upgradeForm.reset(initialValues);
  //   }
  // }, [upgradeForm, upgFormErrors, initialValues]);

  // useEffect(() => {
  //   if (didMount.current) {
  //     didMount.current = false;
  //     return;
  //   }
  //   if (config.amount > 0) {
  //     setIsLoading(true);
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //     initializePayment(onSuccess, onClose);
  //   }
  // }, [config, initializePayment, onClose, onSuccess]);

  return (
    <div className="min-h-screen w-full bg-white/90">
      <div className="w-full pt-20 text-center">
        <h2 className="mt-5 px-8 text-2xl font-semibold text-ndcred">
          Good Governance Card Upgrade
        </h2>
      </div>
      <div className="container mx-auto flex h-full flex-col space-x-0 px-1 lg:flex-row lg:items-start lg:space-x-2">
        <div className="flex basis-full lg:basis-2/5">
          <div className="mt-8 w-full px-8">
            <p className="pb-4 text-sm leading-normal tracking-normal">
              <span className="font-light text-ndcgreen">
                To begin, enter your ID in the form below to retrieve for
                current card detatils. We will show you what your current
                category is and provide you with a list of categories you can
                upgrade to. <br />
              </span>
              <span className="font-semibold uppercase text-zinc-600">
                Please note that you can only upgrade. No downgrades are
                possible
              </span>
            </p>
            <div className="flex-auto rounded-lg bg-white px-4 py-10 pt-5 lg:px-10">
              <Form {...upgradeForm}>
                <form
                  onSubmit={upgradeForm.handleSubmit(getDonorDetails)}
                  // onChange={() => setPmtSuccessful(false)}
                >
                  <div className="mb-4 w-full">
                    <FormField
                      control={upgradeForm.control}
                      name="id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="mb-2 block text-xs font-bold uppercase text-black">
                            Card ID
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Please enter your Card ID"
                              name="id"
                              className="mt-2 h-10 w-full rounded-md bg-white px-4 py-4 text-sm capitalize placeholder:text-sm"
                            />
                          </FormControl>
                          <FormDescription className="text-sm text-red-600">
                            {upgradeForm.formState.errors.id?.message ?? ''}
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mb-5 w-full">
                    <FormField
                      control={upgradeForm.control}
                      name="currentCategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="mb-2 block text-xs font-bold uppercase text-black">
                            Current Category
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled
                              type="text"
                              placeholder="Your current category"
                              name="id"
                              className="mt-2 h-10 w-full rounded-md bg-white px-4 py-4 text-sm placeholder:text-sm"
                            />
                          </FormControl>
                          <FormDescription className="text-sm text-red-600">
                            {upgradeForm.formState.errors.currentCategory
                              ?.message ?? ''}
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mb-5 w-full">
                    <FormField
                      control={upgradeForm.control}
                      name="newCategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="mb-2 block text-xs font-bold uppercase text-black">
                            Upgrade Category
                          </FormLabel>
                          <FormControl>
                            <Select
                              disabled={
                                currentDonor &&
                                currentDonor.active &&
                                watchCategory &&
                                watchCategory.length > 0
                                  ? false
                                  : true
                              }
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="mt-2 rounded-md bg-white px-4 py-5 capitalize">
                                <SelectValue placeholder="Select your new category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectViewport>
                                  {updatedCategoryList &&
                                    updatedCategoryList.map((item, idx) => (
                                      <SelectItem
                                        className="py-2 pl-3 capitalize"
                                        key={idx}
                                        value={item.name}
                                      >{`${item.name} GHS ${item.value}`}</SelectItem>
                                    ))}
                                </SelectViewport>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mt-5 text-center">
                    {!currentDonor && (
                      <button
                        className="mx-auto flex w-full flex-row items-center justify-center rounded-lg bg-gradient-to-r from-ndcgreen to-ndcgreen/40 px-8 py-2  text-xs font-bold uppercase text-white shadow-lg hover:from-ndcred hover:to-ndcred/30 disabled:pointer-events-none disabled:opacity-70"
                        type="submit"
                        aria-disabled={donorMutationPending}
                        disabled={donorMutationPending}
                      >
                        {donorMutationPending ? (
                          <RotateCw className="animate-spin" />
                        ) : (
                          <span>Get Details</span>
                        )}
                      </button>
                    )}

                    {currentDonor &&
                    currentDonor.active &&
                    !watchNewCategory ? (
                      <p className="text-sm leading-relaxed tracking-normal text-ndcred/70">
                        Please select a new category to proceed with payment
                      </p>
                    ) : null}
                    {currentDonor && currentDonor.active === false ? (
                      <p className="text-sm leading-relaxed tracking-normal text-ndcgreen/90">
                        It appears you did not complete your registration
                        payment. Please look at the summary section for more
                        information
                      </p>
                    ) : null}
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
        {currentDonor && summaryData && (
          <div className="flex basis-full lg:basis-3/5">
            <UpgradeSummary
              summary={summaryData}
              paymentSuccess={pmtSuccessful}
              clearPmt={cancelPayment}
            />
          </div>
        )}
      </div>
    </div>
  );
}
