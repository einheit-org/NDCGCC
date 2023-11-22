import { useForm } from "react-hook-form";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronUp, RotateCw } from "lucide-react";
import { ageRange, allConstituencies, gender, industries, paymentCategories, regions, registerSchema, residency } from "@/utils/constants";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectScrollDownButton, SelectScrollUpButton, SelectViewport } from "@radix-ui/react-select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { registerNewUser } from "@/utils/data";
import 'react-phone-number-input/style.css'
import PhoneInputWithCountry from 'react-phone-number-input/react-hook-form'
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

/**
 *  verify phone via otp before proceeding with payment
 *  useLocation() to get state value - determine if
 *  agentId is in state and submit with agent ID else
 *  submit with agent empty string
 * @returns 
 */


export default function Register() {
  const {state} = useLocation()
  const initialValues = useMemo(() => {
    return {
      firstName: "",
      lastName: "",
      agerange: "",
      phonenumber: "",
      resident: "",
      sex: "",
      region: "",
      constituency: "",
      industry: "",
      occupation: "",
      category: "",
      displayNameOnCard: "",
      cardpickuplocation: "",
    }
  }, [])
  const { toast } = useToast()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [registerErrors, setRegisterErrors] = useState(false)
  const [agentId, setAgentId] = useState<string | undefined>(undefined)
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: initialValues
  })
  const watchRegion = registerForm.watch('region')

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true)
    const payload = {
      ...values,
      displaynameoncard: values.displayNameOnCard === 'yes' ? true : false,
      fullname: `${values.firstName} ${values.lastName}`,
      agent: agentId ?? ''
    }
    delete payload.displayNameOnCard
    delete payload.firstName
    delete payload.lastName

    const response = await registerNewUser(payload)
    if (response) {
      setIsLoading(false)
      const params = { id: response.id, category: payload.category, name: response.name, isd: response.issuedon }
      navigate({
        pathname: '/payment',
        search: `?${createSearchParams(params)}`
      })
    } else {
      setIsLoading(false)
      setRegisterErrors(true)
      toast({
        variant: "destructive",
        title: "Sorry! Something went wrong",
        description: "There was a problem submitting the form. Please try again"
      })
    }
  }

  useEffect(() => {
    if (registerErrors) {
      registerForm.reset(initialValues)
    }
  }, [registerForm, registerErrors, initialValues])

  useEffect(() => {
    if (state) {
      setAgentId(state)
    }
  }, [state])


  return (
    <div className="w-full h-full flex flex-col bg-gray-100/90  overflow-auto pb-28">

      {/* Form area */}
      <div className="w-full lg:w-4/6 mx-auto flex flex-col items-center mt-12">
        {/* <div className="mx-auto rounded-full p-4 h-[126px] w-[126px] md:w-[140px] md:h-[140px] flex items-center justify-center">
          <img src="/logo.png" alt="NDC Good Governance" />
        </div> */}
        <div className="flex flex-col w-full bg-black/80 divide-y divide-solid divide-green-700 px-6 py-6 mt-8">
          <div className="flex items-center justify-center">
            <h4 className="text-ndcred/80 text-xl font-bold uppercase mb-1">
              GOOD GOVERNANCE CARD REGISTRATION FORM
            </h4>
          </div>
          <div className="flex flex-col w-full">
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onSubmit)} className="w-full flex flex-col py-8 space-y-4" onChange={() => setRegisterErrors(false)}>
                {/* Name Row */}
                <div className="flex flex-col space-y-3 md:flex-row w-full md:space-x-3 md:space-y-0">
                  <div className="basis-1/2">
                    <FormField
                      name="firstName"
                      control={registerForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-sm uppercase font-bold">First Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="First Name" className="placeholder:text-sm w-full rounded-md py-4 h-10 text-sm px-4 mt-2 bg-white" />
                          </FormControl>
                          <FormDescription className="text-sm text-red-600">{registerForm.formState.errors.firstName ? registerForm.formState.errors.firstName.message : ''}</FormDescription>
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
                          <FormLabel className="text-white text-sm uppercase font-bold">Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Last Name" className="placeholder:text-sm w-full rounded-md py-4 h-10 text-sm px-4 mt-2 bg-white" />
                          </FormControl>
                          <FormDescription className="text-sm text-red-600">{registerForm.formState.errors.lastName ? registerForm.formState.errors.lastName.message : ''}</FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Phone & Sex Row */}
                <div className="flex flex-col space-y-3 md:flex-row w-full md:space-x-3 md:space-y-0">
                  <div className="basis-1/2">
                    <FormField
                      name="phonenumber"
                      control={registerForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-sm uppercase font-bold">Phone Number</FormLabel>
                          <FormControl>
                            <PhoneInputWithCountry
                              {...field}
                              placeholder="Enter your phone number"
                              defaultCountry="GH"
                              className="placeholder:text-sm w-full rounded-md py-[0.8em] text-sm px-4 mt-2 bg-white"
                            />
                          </FormControl>
                          {registerForm.formState.errors.phonenumber && <FormDescription className="text-red-600">
                            {registerForm.formState.errors.phonenumber.message}
                          </FormDescription>}
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
                          <FormLabel className="text-white text-sm uppercase font-bold">Gender</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue=""
                              value={field.value}
                            >
                              <SelectTrigger className="bg-white rounded-md py-5 px-4 mt-2">
                                <SelectValue placeholder="Select your sex" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectViewport>
                                  {gender.map((item, idx) => (
                                    <SelectItem className="pl-3 py-2" key={idx} value={item.value}>{item.label}</SelectItem>
                                  ))}
                                </SelectViewport>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription className="text-sm text-red-600">{registerForm.formState.errors.sex ? registerForm.formState.errors.sex.message : ''}</FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Age and Residency row */}
                <div className="flex flex-col space-y-3 md:flex-row w-full md:space-x-3 md:space-y-0">
                  <div className="basis-1/2">
                    <FormField
                      name="agerange"
                      control={registerForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-sm uppercase font-bold">Age Range</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue=""
                              value={field.value}
                            >
                              <SelectTrigger className="bg-white rounded-md py-5 px-4 mt-2">
                                <SelectValue placeholder="Select your age range" />
                              </SelectTrigger>
                              <SelectContent className="overflow-auto h-56">
                                <SelectViewport>
                                  {ageRange.map((item, idx) => (
                                    <SelectItem className="pl-3 py-2" key={idx} value={item.value}>{item.label}</SelectItem>
                                  ))}
                                </SelectViewport>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription className="text-sm text-red-600">{registerForm.formState.errors.agerange ? registerForm.formState.errors.agerange.message : ''}</FormDescription>
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
                          <FormLabel className="text-white text-sm uppercase font-bold">Residency</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue=""
                              value={field.value}
                            >
                              <SelectTrigger className="bg-white rounded-md py-5 px-4 mt-2">
                                <SelectValue placeholder="Select your residency" />
                              </SelectTrigger>
                              <SelectContent className="overflow-auto">
                                <SelectViewport>
                                  {residency.map((item, idx) => (
                                    <SelectItem className="pl-3 py-2" key={idx} value={item.value}>{item.label}</SelectItem>
                                  ))}
                                </SelectViewport>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription className="text-sm text-red-600">{registerForm.formState.errors.resident ? registerForm.formState.errors.resident.message : ''}</FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Region and Consituency Row */}
                <div className="flex flex-col space-y-3 md:flex-row w-full md:space-x-3 md:space-y-0">
                  <div className="basis-1/2">
                    <FormField
                      name="region"
                      control={registerForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-sm uppercase font-bold">Region</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue=""
                              value={field.value}
                            >
                              <SelectTrigger className="bg-white rounded-md py-5 px-4 mt-2">
                                <SelectValue placeholder="Select your Region" />
                              </SelectTrigger>
                              <SelectContent className="overflow-auto h-56">
                                <SelectViewport>
                                  <SelectScrollUpButton>
                                    <ChevronUp />
                                  </SelectScrollUpButton>
                                  {regions.map((item, idx) => (
                                    <SelectItem className="pl-3 py-2" key={idx} value={item.toLowerCase()}>{item}</SelectItem>
                                  ))}
                                </SelectViewport>
                                <SelectScrollDownButton>
                                  <ChevronDown />
                                </SelectScrollDownButton>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription className="text-sm text-red-600">{registerForm.formState.errors.region ? registerForm.formState.errors.region.message : ''}</FormDescription>
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
                          <FormLabel className="text-white text-sm uppercase font-bold">Constituency</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue=""
                              value={field.value}
                            >
                              <SelectTrigger className="bg-white rounded-md py-5 px-4 mt-2"><SelectValue placeholder="Select your Constituency" /></SelectTrigger>
                              <SelectContent className="overflow-auto h-56">
                                <SelectViewport>
                                  <SelectScrollUpButton>
                                    <ChevronUp />
                                  </SelectScrollUpButton>
                                  {watchRegion.length > 0 ? (
                                    <>
                                      {allConstituencies.filter((reg) => (
                                        reg.region === watchRegion
                                      ))[0].constituencies.map((cst, idx) => (
                                        <SelectItem className="pl-3 py-2" value={cst.toLowerCase()} key={idx}>{cst}</SelectItem>
                                      ))}
                                    </>
                                  ) : (
                                    <>
                                      {allConstituencies.map((item, idx) => (
                                        <SelectGroup key={idx}>
                                          <SelectLabel className="bg-gray-300 pl-3 py-2">{item.region.toUpperCase()}</SelectLabel>
                                          {item.constituencies.map((constituency, idx) => (
                                            <SelectItem className="pl-3 py-2" value={constituency.toLowerCase()} key={idx}>{constituency}</SelectItem>
                                          ))}
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
                          <FormDescription className="text-sm text-red-600">{registerForm.formState.errors.constituency ? registerForm.formState.errors.constituency.message : ''}</FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Industry and Occupation row */}
                <div className="flex flex-col space-y-3 md:flex-row w-full md:space-x-3 md:space-y-0">
                  <div className="basis-1/2">
                    <FormField
                      name="industry"
                      control={registerForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-sm uppercase font-bold">Industry</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue=""
                              value={field.value}
                            >
                              <SelectTrigger className="bg-white rounded-md py-5 px-4 mt-2">
                                <SelectValue placeholder="Select your industry" />
                              </SelectTrigger>
                              <SelectContent className="overflow-auto h-56">
                                <SelectViewport>
                                  {industries.map((item, idx) => (
                                    <SelectItem className="pl-3 py-2" key={idx} value={item.value}>{item.label}</SelectItem>
                                  ))}
                                </SelectViewport>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription className="text-sm text-red-600">{registerForm.formState.errors.industry ? registerForm.formState.errors.industry.message : ''}</FormDescription>
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
                          <FormLabel className="text-white text-sm uppercase font-bold">Occupation</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Enter you occupation"
                              className="placeholder:text-sm w-full rounded-md py-4 h-10 text-sm px-4 mt-2 bg-white"
                            />
                          </FormControl>
                          <FormDescription className="text-sm text-red-600">{registerForm.formState.errors.occupation ? registerForm.formState.errors.occupation.message : ''}</FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Category and Card name display row */}
                <div className="flex flex-col space-y-3 md:flex-row w-full md:space-x-3 md:space-y-0">
                  <div className="basis-1/2">
                    <FormField
                      name="category"
                      control={registerForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-sm uppercase font-bold">Category</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue=""
                              value={field.value}
                            >
                              <SelectTrigger className="bg-white rounded-md py-5 px-4 mt-2">
                                <SelectValue placeholder='Select payment category' />
                              </SelectTrigger>
                              <SelectContent className="overflow-auto h-48">
                                <SelectViewport>
                                  {paymentCategories.map((payment, idx) => (
                                    <SelectItem className="pl-3 py-2" key={idx} value={payment.value}>{payment.label}</SelectItem>
                                  ))}
                                </SelectViewport>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription className="text-sm text-red-600">{registerForm.formState.errors.category ? registerForm.formState.errors.category.message : ''}</FormDescription>
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
                          <FormLabel className="text-white text-sm uppercase font-bold">Display Name on Card</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue=""
                              value={field.value}
                            >
                              <SelectTrigger className="bg-white rounded-md py-5 px-4 mt-2">
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
                          <FormDescription className="text-sm text-red-600">{registerForm.formState.errors.displayNameOnCard ? registerForm.formState.errors.displayNameOnCard.message : ''}</FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Card pickup row */}
                <div className="flex flex-col w-full mb-4">
                  <FormField
                    name="cardpickuplocation"
                    control={registerForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-sm uppercase font-bold">Where do you want to pick your card?</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue=""
                            value={field.value}
                          >
                            <SelectTrigger className="bg-white rounded-md py-5 px-4 mt-2">
                              <SelectValue placeholder='Select a pickup point' />
                            </SelectTrigger>
                            <SelectContent className="overflow-auto h-56">
                              <SelectViewport>
                                <SelectScrollUpButton>
                                  <ChevronUp />
                                </SelectScrollUpButton>
                                {regions.map((item, idx) => (
                                  <SelectItem className="pl-3 py-2 capitalize" key={idx} value={item.toLowerCase()}>{item} {'Head Office'}</SelectItem>
                                ))}
                              </SelectViewport>
                              <SelectScrollDownButton>
                                <ChevronDown />
                              </SelectScrollDownButton>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription className="text-sm text-red-600">{registerForm.formState.errors.cardpickuplocation ? registerForm.formState.errors.cardpickuplocation.message : ''}</FormDescription>
                      </FormItem>
                    )}
                  />
                </div>

                {/* submit button */}
                <div className="flex flex-col w-full items-center space-y-3">
                  <button
                    className="disabled:opacity-70 mx-auto flex flex-row items-center justify-center w-full uppercase bg-gradient-to-r from-ndcgreen to-ndcgreen/40  hover:from-ndcred hover:to-ndcred/30 text-white font-bold py-3 px-8 shadow-lg"
                    type="submit"
                    aria-disabled={isLoading}
                    disabled={isLoading}
                  >
                    {isLoading ? (<RotateCw className="animate-spin" />) : (<span>Continue to Make Payment</span>)}
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
