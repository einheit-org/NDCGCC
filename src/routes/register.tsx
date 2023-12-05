import { useForm } from 'react-hook-form';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, ChevronUp, RotateCw } from 'lucide-react';
import {
  ageRange,
  allConstituencies,
  gender,
  industries,
  paymentCategories,
  regions,
  registerSchema,
  residency,
} from '@/utils/constants';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectViewport,
} from '@radix-ui/react-select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import 'react-phone-number-input/style.css';
import PhoneInputWithCountry from 'react-phone-number-input/react-hook-form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useRegisterDonor } from '@/hooks/useRegisterDonor';

/**
 *  verify phone via otp before proceeding with payment
 *  useLocation() to get state value - determine if
 *  agentId is in state and submit with agent ID else
 *  submit with agent empty string
 *
 */

export default function Register() {
  const { mutate: registerMutation, isPending: registerPending } =
    useRegisterDonor();
  const { state } = useLocation();
  const initialValues = useMemo(() => {
    return {
      firstName: '',
      lastName: '',
      agerange: '',
      phonenumber: '',
      resident: '',
      sex: '',
      region: '',
      constituency: '',
      industry: '',
      occupation: '',
      category: '',
      displayNameOnCard: '',
      cardpickuplocation: '',
    };
  }, []);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [registerErrors, setRegisterErrors] = useState(false);
  const [agentId, setAgentId] = useState<string | undefined>(undefined);
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: initialValues,
  });
  const watchRegion = registerForm.watch('region');

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    const payload = {
      ...values,
      displaynameoncard: values.displayNameOnCard === 'yes' ? true : false,
      fullname: `${values.firstName} ${values.lastName}`,
      agent: agentId ?? '',
    };
    delete payload.displayNameOnCard;
    delete payload.firstName;
    delete payload.lastName;
    registerMutation(payload, {
      onSuccess: (response) => {
        const params = {
          id: response.id,
          category: payload.category,
          name: response.name,
          isd: response.issuedon,
        };
        navigate({
          pathname: '/payment',
          search: `?${createSearchParams(params)}`,
        });
      },
      onError: (error) => {
        toast({
          variant: 'destructive',
          title: 'Sorry! Something went wrong',
          description: `Message: ${error.message}`,
        });
      },
    });
  }

  useEffect(() => {
    if (registerErrors) {
      registerForm.reset(initialValues);
    }
  }, [registerForm, registerErrors, initialValues]);

  useEffect(() => {
    if (state) {
      setAgentId(state.agentId);
    }
  }, [state]);

  return (
    <div className="flex h-full w-full flex-col overflow-auto  bg-gray-100/90 pb-28">
      {/* Form area */}
      <div className="mx-auto mt-12 flex w-full flex-col items-center lg:w-4/6">
        {/* <div className="mx-auto rounded-full p-4 h-[126px] w-[126px] md:w-[140px] md:h-[140px] flex items-center justify-center">
          <img src="/logo.png" alt="NDC Good Governance" />
        </div> */}
        <div className="mt-8 flex w-full flex-col divide-y divide-solid divide-green-700 bg-black/80 px-6 py-6">
          <div className="flex flex-col items-center justify-center">
            <h4 className="text-xl font-bold text-white">
              {agentId ? `${agentId}` : ''}
            </h4>
            <h4 className="mb-1 text-xl font-bold uppercase text-ndcred/80">
              GOOD GOVERNANCE CARD REGISTRATION FORM
            </h4>
          </div>
          <div className="flex w-full flex-col">
            <Form {...registerForm}>
              <form
                onSubmit={registerForm.handleSubmit(onSubmit)}
                className="flex w-full flex-col space-y-4 py-8"
                onChange={() => setRegisterErrors(false)}
              >
                {/* Name Row */}
                <div className="flex w-full flex-col space-y-3 md:flex-row md:space-x-3 md:space-y-0">
                  <div className="basis-1/2">
                    <FormField
                      name="firstName"
                      control={registerForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-bold uppercase text-white">
                            First Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="First Name"
                              className="mt-2 h-10 w-full rounded-md bg-white px-4 py-4 text-sm placeholder:text-sm"
                            />
                          </FormControl>
                          <FormDescription className="text-sm text-red-600">
                            {registerForm.formState.errors.firstName
                              ? registerForm.formState.errors.firstName.message
                              : ''}
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="basis-1/2">
                    <FormField
                      name="lastName"
                      control={registerForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-bold uppercase text-white">
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Last Name"
                              className="mt-2 h-10 w-full rounded-md bg-white px-4 py-4 text-sm placeholder:text-sm"
                            />
                          </FormControl>
                          <FormDescription className="text-sm text-red-600">
                            {registerForm.formState.errors.lastName
                              ? registerForm.formState.errors.lastName.message
                              : ''}
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Phone & Sex Row */}
                <div className="flex w-full flex-col space-y-3 md:flex-row md:space-x-3 md:space-y-0">
                  <div className="basis-1/2">
                    <FormField
                      name="phonenumber"
                      control={registerForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-bold uppercase text-white">
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <PhoneInputWithCountry
                              {...field}
                              placeholder="Enter your phone number"
                              defaultCountry="GH"
                              className="mt-2 w-full rounded-md bg-white px-4 py-[0.8em] text-sm placeholder:text-sm"
                            />
                          </FormControl>
                          {registerForm.formState.errors.phonenumber && (
                            <FormDescription className="text-red-600">
                              {
                                registerForm.formState.errors.phonenumber
                                  .message
                              }
                            </FormDescription>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="basis-1/2">
                    <FormField
                      name="sex"
                      control={registerForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-bold uppercase text-white">
                            Gender
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue=""
                              value={field.value}
                            >
                              <SelectTrigger className="mt-2 rounded-md bg-white px-4 py-5">
                                <SelectValue placeholder="Select your sex" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectViewport>
                                  {gender.map((item, idx) => (
                                    <SelectItem
                                      className="py-2 pl-3"
                                      key={idx}
                                      value={item.value}
                                    >
                                      {item.label}
                                    </SelectItem>
                                  ))}
                                </SelectViewport>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription className="text-sm text-red-600">
                            {registerForm.formState.errors.sex
                              ? registerForm.formState.errors.sex.message
                              : ''}
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Age and Residency row */}
                <div className="flex w-full flex-col space-y-3 md:flex-row md:space-x-3 md:space-y-0">
                  <div className="basis-1/2">
                    <FormField
                      name="agerange"
                      control={registerForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-bold uppercase text-white">
                            Age Range
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue=""
                              value={field.value}
                            >
                              <SelectTrigger className="mt-2 rounded-md bg-white px-4 py-5">
                                <SelectValue placeholder="Select your age range" />
                              </SelectTrigger>
                              <SelectContent className="h-56 overflow-auto">
                                <SelectViewport>
                                  {ageRange.map((item, idx) => (
                                    <SelectItem
                                      className="py-2 pl-3"
                                      key={idx}
                                      value={item.value}
                                    >
                                      {item.label}
                                    </SelectItem>
                                  ))}
                                </SelectViewport>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription className="text-sm text-red-600">
                            {registerForm.formState.errors.agerange
                              ? registerForm.formState.errors.agerange.message
                              : ''}
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="basis-1/2">
                    <FormField
                      name="resident"
                      control={registerForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-bold uppercase text-white">
                            Residency
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue=""
                              value={field.value}
                            >
                              <SelectTrigger className="mt-2 rounded-md bg-white px-4 py-5">
                                <SelectValue placeholder="Select your residency" />
                              </SelectTrigger>
                              <SelectContent className="overflow-auto">
                                <SelectViewport>
                                  {residency.map((item, idx) => (
                                    <SelectItem
                                      className="py-2 pl-3"
                                      key={idx}
                                      value={item.value}
                                    >
                                      {item.label}
                                    </SelectItem>
                                  ))}
                                </SelectViewport>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription className="text-sm text-red-600">
                            {registerForm.formState.errors.resident
                              ? registerForm.formState.errors.resident.message
                              : ''}
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Region and Consituency Row */}
                <div className="flex w-full flex-col space-y-3 md:flex-row md:space-x-3 md:space-y-0">
                  <div className="basis-1/2">
                    <FormField
                      name="region"
                      control={registerForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-bold uppercase text-white">
                            Region
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue=""
                              value={field.value}
                            >
                              <SelectTrigger className="mt-2 rounded-md bg-white px-4 py-5">
                                <SelectValue placeholder="Select your Region" />
                              </SelectTrigger>
                              <SelectContent className="h-56 overflow-auto">
                                <SelectViewport>
                                  <SelectScrollUpButton>
                                    <ChevronUp />
                                  </SelectScrollUpButton>
                                  {regions.map((item, idx) => (
                                    <SelectItem
                                      className="py-2 pl-3"
                                      key={idx}
                                      value={item.toLowerCase()}
                                    >
                                      {item}
                                    </SelectItem>
                                  ))}
                                </SelectViewport>
                                <SelectScrollDownButton>
                                  <ChevronDown />
                                </SelectScrollDownButton>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription className="text-sm text-red-600">
                            {registerForm.formState.errors.region
                              ? registerForm.formState.errors.region.message
                              : ''}
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="basis-1/2">
                    <FormField
                      name="constituency"
                      control={registerForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-bold uppercase text-white">
                            Constituency
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue=""
                              value={field.value}
                            >
                              <SelectTrigger className="mt-2 rounded-md bg-white px-4 py-5">
                                <SelectValue placeholder="Select your Constituency" />
                              </SelectTrigger>
                              <SelectContent className="h-56 overflow-auto">
                                <SelectViewport>
                                  <SelectScrollUpButton>
                                    <ChevronUp />
                                  </SelectScrollUpButton>
                                  {watchRegion.length > 0 ? (
                                    <>
                                      {allConstituencies
                                        .filter(
                                          (reg) => reg.region === watchRegion,
                                        )[0]
                                        .constituencies.map((cst, idx) => (
                                          <SelectItem
                                            className="py-2 pl-3"
                                            value={cst.toLowerCase()}
                                            key={idx}
                                          >
                                            {cst}
                                          </SelectItem>
                                        ))}
                                    </>
                                  ) : (
                                    <>
                                      {allConstituencies.map((item, idx) => (
                                        <SelectGroup key={idx}>
                                          <SelectLabel className="bg-gray-300 py-2 pl-3">
                                            {item.region.toUpperCase()}
                                          </SelectLabel>
                                          {item.constituencies.map(
                                            (constituency, idx) => (
                                              <SelectItem
                                                className="py-2 pl-3"
                                                value={constituency.toLowerCase()}
                                                key={idx}
                                              >
                                                {constituency}
                                              </SelectItem>
                                            ),
                                          )}
                                        </SelectGroup>
                                      ))}
                                    </>
                                  )}

                                  <SelectScrollDownButton>
                                    <ChevronDown />
                                  </SelectScrollDownButton>
                                </SelectViewport>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription className="text-sm text-red-600">
                            {registerForm.formState.errors.constituency
                              ? registerForm.formState.errors.constituency
                                  .message
                              : ''}
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Industry and Occupation row */}
                <div className="flex w-full flex-col space-y-3 md:flex-row md:space-x-3 md:space-y-0">
                  <div className="basis-1/2">
                    <FormField
                      name="industry"
                      control={registerForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-bold uppercase text-white">
                            Industry
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue=""
                              value={field.value}
                            >
                              <SelectTrigger className="mt-2 rounded-md bg-white px-4 py-5">
                                <SelectValue placeholder="Select your industry" />
                              </SelectTrigger>
                              <SelectContent className="h-56 overflow-auto">
                                <SelectViewport>
                                  {industries.map((item, idx) => (
                                    <SelectItem
                                      className="py-2 pl-3"
                                      key={idx}
                                      value={item.value}
                                    >
                                      {item.label}
                                    </SelectItem>
                                  ))}
                                </SelectViewport>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription className="text-sm text-red-600">
                            {registerForm.formState.errors.industry
                              ? registerForm.formState.errors.industry.message
                              : ''}
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="basis-1/2">
                    <FormField
                      name="occupation"
                      control={registerForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-bold uppercase text-white">
                            Occupation
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Enter you occupation"
                              className="mt-2 h-10 w-full rounded-md bg-white px-4 py-4 text-sm placeholder:text-sm"
                            />
                          </FormControl>
                          <FormDescription className="text-sm text-red-600">
                            {registerForm.formState.errors.occupation
                              ? registerForm.formState.errors.occupation.message
                              : ''}
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Category and Card name display row */}
                <div className="flex w-full flex-col space-y-3 md:flex-row md:space-x-3 md:space-y-0">
                  <div className="basis-1/2">
                    <FormField
                      name="category"
                      control={registerForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-bold uppercase text-white">
                            Category
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue=""
                              value={field.value}
                            >
                              <SelectTrigger className="mt-2 rounded-md bg-white px-4 py-5">
                                <SelectValue placeholder="Select payment category" />
                              </SelectTrigger>
                              <SelectContent className="h-48 overflow-auto">
                                <SelectViewport>
                                  {paymentCategories.map((payment, idx) => (
                                    <SelectItem
                                      className="py-2 pl-3"
                                      key={idx}
                                      value={payment.value}
                                    >
                                      {payment.label}
                                    </SelectItem>
                                  ))}
                                </SelectViewport>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription className="text-sm text-red-600">
                            {registerForm.formState.errors.category
                              ? registerForm.formState.errors.category.message
                              : ''}
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="basis-1/2">
                    <FormField
                      name="displayNameOnCard"
                      control={registerForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-bold uppercase text-white">
                            Display Name on Card
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue=""
                              value={field.value}
                            >
                              <SelectTrigger className="mt-2 rounded-md bg-white px-4 py-5">
                                <SelectValue placeholder="Choose one..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectViewport>
                                  <SelectItem value="yes">Yes</SelectItem>
                                  <SelectItem value="no">No</SelectItem>
                                </SelectViewport>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription className="text-sm text-red-600">
                            {registerForm.formState.errors.displayNameOnCard
                              ? registerForm.formState.errors.displayNameOnCard
                                  .message
                              : ''}
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Card pickup row */}
                <div className="mb-4 flex w-full flex-col">
                  <FormField
                    name="cardpickuplocation"
                    control={registerForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-bold uppercase text-white">
                          Where do you want to pick your card?
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue=""
                            value={field.value}
                          >
                            <SelectTrigger className="mt-2 rounded-md bg-white px-4 py-5">
                              <SelectValue placeholder="Select a pickup point" />
                            </SelectTrigger>
                            <SelectContent className="h-56 overflow-auto">
                              <SelectViewport>
                                <SelectScrollUpButton>
                                  <ChevronUp />
                                </SelectScrollUpButton>
                                {regions.map((item, idx) => (
                                  <SelectItem
                                    className="py-2 pl-3 capitalize"
                                    key={idx}
                                    value={item.toLowerCase()}
                                  >
                                    {item} {'Head Office'}
                                  </SelectItem>
                                ))}
                              </SelectViewport>
                              <SelectScrollDownButton>
                                <ChevronDown />
                              </SelectScrollDownButton>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription className="text-sm text-red-600">
                          {registerForm.formState.errors.cardpickuplocation
                            ? registerForm.formState.errors.cardpickuplocation
                                .message
                            : ''}
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>

                {/* submit button */}
                <div className="flex w-full flex-col items-center space-y-3">
                  <button
                    className="mx-auto flex w-full flex-row items-center justify-center bg-gradient-to-r from-ndcgreen to-ndcgreen/40 px-8 py-3  font-bold uppercase text-white shadow-lg hover:from-ndcred hover:to-ndcred/30 disabled:opacity-70"
                    type="submit"
                    aria-disabled={registerPending}
                    disabled={registerPending}
                  >
                    {registerPending ? (
                      <RotateCw className="animate-spin" />
                    ) : (
                      <span>Continue to Make Payment</span>
                    )}
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
