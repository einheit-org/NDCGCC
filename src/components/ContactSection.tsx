import { Phone, RotateCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "./ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { contactSchema } from "@/utils/constants";
import { Input } from "./ui/input";
import PhoneInputWithCountrySelect from "react-phone-number-input/react-hook-form";
import { Textarea } from "./ui/textarea";

export default function ContactUs() {
  const [isLoading, setIsLoading] = useState(false)

  const initialValues = useMemo(() => {
    return {
      fullname: "",
      email: "",
      phonenumber: "",
      message: ""
    }
  }, [])
  const contactForm = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: initialValues
  })

  async function sendFormEmail(values: z.infer<typeof contactSchema>) {
    setIsLoading(true)
    console.log(values)
    // await resend.emails.send({
    //   from: values.email,
    //   to: '',
    //   subject: '',
    //   react: ''
    // })
  }
  return (
    <section id="contact" className="bg-white/80 py-5">
      <div className="container max-w-3xl mx-auto m-8 px-3">
        <h1 className="w-full text-3xl font-bold leading-tight text-center text-gray-800 uppercase">
          Contact Us
        </h1>
        <div className="w-full mx-auto max-w-3xl pt-5">
          <div className="">
            <p className="text-gray-500 font-light mb-0 uppercase">
              <span className="text-red-700 font-semibold mr-1.5">
                Customer
              </span>
              Service
            </p>
            <h4 className="text-xl text-black  font-medium mt-1 flex flex-row items-center">
              <Phone className="text-ndcgreen mr-1" />0598953919
              | 0534000261
              | 0598953914
              | 0598953915
            </h4>
          </div>
          <p className="text-gray-500  font-light  uppercase my-5">
            <span className="text-red-700 font-semibold mr-1.5">
              Contact
            </span>
            Form
          </p>
          <Form {...contactForm}>
            <form className="w-full" onSubmit={contactForm.handleSubmit(sendFormEmail)}>
              <div className="flex flex-wrap -mx-3 ">
                <div className="w-full  px-3 mb-3">
                  <FormField
                    name="fullname"
                    control={contactForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Full Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="John Doe"
                            className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                          />
                        </FormControl>
                        <FormDescription className="text-sm text-red-600">{contactForm.formState.errors.fullname ? contactForm.formState.errors.fullname.message : ''}</FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className=" w-full mb-4">
                <FormField
                  control={contactForm.control}
                  name="phonenumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Phone Number</FormLabel>
                      <FormControl>
                        <PhoneInputWithCountrySelect
                          {...field}
                          placeholder="Phone Number"
                          defaultCountry="GH"
                          className="block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                      </FormControl>
                      <FormDescription className="text-sm text-red-600">{contactForm.formState.errors.phonenumber?.message ?? ''}</FormDescription>
                    </FormItem>
                  )}
                />

              </div>
              <div className=" w-full mb-4">
                <FormField
                  name="email"
                  control={contactForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Email Address</FormLabel>
                      <Input
                        {...field}
                        placeholder="Email Address"
                        className="block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4  leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      />
                      <FormDescription className="text-sm text-red-600">{contactForm.formState.errors.email?.message ?? ''}</FormDescription>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-wrap -mx-3 mb-3">
                <div className="w-full px-3">
                  <FormField
                    control={contactForm.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Message</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="no-resize appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4  leading-tight focus:outline-none focus:bg-white focus:border-gray-500 h-48 resize-none"
                            placeholder="Enter your message here"
                          />
                        </FormControl>
                        <FormDescription>{contactForm.formState.errors.message?.message ?? ''}</FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="md:flex md:items-center">
                <div className="w-full mt-2">
                  <button
                    className="shadow bg-ndcred hover:bg-black focus:shadow-outline focus:outline-none text-white font-bold py-3 px-4  w-full"
                    type="submit"
                    aria-disabled={isLoading}
                    disabled={isLoading}
                  >
                    {isLoading ? (<RotateCw className="animate-spin" />) : (<span>Send Message</span>)}
                  </button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  )
}