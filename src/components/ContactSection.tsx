import { Loader, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from './ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { contactSchema } from '@/utils/constants';
import { Input } from './ui/input';
import PhoneInputWithCountrySelect from 'react-phone-number-input/react-hook-form';
import { Textarea } from './ui/textarea';

export default function ContactUs() {
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = useMemo(() => {
    return {
      fullname: '',
      email: '',
      phonenumber: '',
      message: '',
    };
  }, []);
  const contactForm = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: initialValues,
  });

  async function sendFormEmail(values: z.infer<typeof contactSchema>) {
    setIsLoading(true);
    // remember to remove
    localStorage.setItem('values', JSON.stringify(values));
    // await resend.emails.send({
    //   from: values.email,
    //   to: '',
    //   subject: '',
    //   react: ''
    // })
  }
  return (
    <section id="contact" className="bg-white/80 py-5">
      <div className="container m-8 mx-auto max-w-3xl px-3">
        <h1 className="w-full text-center text-3xl font-bold uppercase leading-tight text-gray-800">
          Contact Us
        </h1>
        <div className="mx-auto w-full max-w-3xl pt-5">
          <div className="">
            <p className="mb-0 font-light uppercase text-gray-500">
              <span className="mr-1.5 font-semibold text-red-700">
                Customer
              </span>
              Service
            </p>
            <h4 className="mt-1 flex  flex-row items-center text-xl font-medium text-black">
              <Phone className="mr-1 text-ndcgreen" />
              0598953919 | 0534000261 | 0598953914 | 0598953915
            </h4>
          </div>
          <p className="my-5  font-light  uppercase text-gray-500">
            <span className="mr-1.5 font-semibold text-red-700">Contact</span>
            Form
          </p>
          <Form {...contactForm}>
            <form
              className="w-full"
              onSubmit={contactForm.handleSubmit(sendFormEmail)}
            >
              <div className="-mx-3 flex flex-wrap ">
                <div className="mb-3  w-full px-3">
                  <FormField
                    name="fullname"
                    control={contactForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="John Doe"
                            className="block w-full appearance-none rounded border border-gray-200 bg-white px-4 py-3 leading-tight text-gray-700 focus:bg-white focus:outline-none"
                          />
                        </FormControl>
                        <FormDescription className="text-sm text-red-600">
                          {contactForm.formState.errors.fullname
                            ? contactForm.formState.errors.fullname.message
                            : ''}
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className=" mb-4 w-full">
                <FormField
                  control={contactForm.control}
                  name="phonenumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <PhoneInputWithCountrySelect
                          {...field}
                          placeholder="Phone Number"
                          defaultCountry="GH"
                          className="block w-full rounded border border-gray-200 bg-white px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                        />
                      </FormControl>
                      <FormDescription className="text-sm text-red-600">
                        {contactForm.formState.errors.phonenumber?.message ??
                          ''}
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
              <div className=" mb-4 w-full">
                <FormField
                  name="email"
                  control={contactForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
                        Email Address
                      </FormLabel>
                      <Input
                        {...field}
                        placeholder="Email Address"
                        className="block w-full rounded border border-gray-200 bg-white px-4 py-3 leading-tight  text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                      />
                      <FormDescription className="text-sm text-red-600">
                        {contactForm.formState.errors.email?.message ?? ''}
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
              <div className="-mx-3 mb-3 flex flex-wrap">
                <div className="w-full px-3">
                  <FormField
                    control={contactForm.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
                          Message
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="no-resize block h-48 w-full resize-none appearance-none rounded border border-gray-200 bg-white px-4  py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                            placeholder="Enter your message here"
                          />
                        </FormControl>
                        <FormDescription>
                          {contactForm.formState.errors.message?.message ?? ''}
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="md:flex md:items-center">
                <div className="mt-2 w-full">
                  <button
                    className="focus:shadow-outline w-full bg-ndcred px-4 py-3 font-bold text-white shadow hover:bg-black  focus:outline-none"
                    type="submit"
                    aria-disabled={isLoading}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader className="animate-spin" />
                    ) : (
                      <span>Send Message</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
