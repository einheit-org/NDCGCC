import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import MainNav from '@/components/widgets/MainNav';
import { adminLoginSchema } from '@/utils/constants';
// import { sendAgentLogin } from "@/utils/data";
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight, Loader } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { z } from 'zod';

export default function Admin() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const initialLoginValues = useMemo(() => {
    return {
      id: '',
      password: '',
    };
  }, []);
  const agentLoginForm = useForm<z.infer<typeof adminLoginSchema>>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: initialLoginValues,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loginErrors, setLoginErrors] = useState(false);

  async function loginAgent(values: z.infer<typeof adminLoginSchema>) {
    setIsLoading(true);
    if (
      (values.id === import.meta.env.VITE_AD_ID &&
        values.password === import.meta.env.VITE_AD_PW) ||
      (values.id === import.meta.env.VITE_AD2_ID &&
        values.password === import.meta.env.VITE_AD2_PW)
    ) {
      if (values.id === import.meta.env.VITE_AD_ID) {
        window.localStorage.setItem('adminName', 'General Secretary');
      }
      if (values.id === import.meta.env.VITE_AD2_ID) {
        window.localStorage.setItem('adminName', 'Seidu Agongo');
      }

      setIsLoading(false);
      const params = { id: values.id, type: 'donors' };
      navigate({
        pathname: '/admindashboard',
        search: `?${createSearchParams(params)}`,
      });
    } else {
      setIsLoading(false);
      setLoginErrors(true);
      toast({
        variant: 'destructive',
        title: 'Oops!',
        description: 'Something went wrong. Please try again.',
      });
    }
  }

  useEffect(() => {
    if (loginErrors) {
      agentLoginForm.reset(initialLoginValues);
    }
  }, [loginErrors, agentLoginForm, initialLoginValues]);
  return (
    <div className="flex min-h-screen w-full flex-col bg-zinc-900 bg-[url('/logo_bg.svg')] bg-center bg-no-repeat">
      <MainNav />

      <div className="mx-auto my-auto flex w-full flex-col items-center justify-center px-8 md:w-1/4 md:px-0 lg:w-1/5">
        <div className="flex flex-col items-center justify-center">
          <img src="/logo.png" />
        </div>
        {/* <h2 className="my-6 uppercase font-bold text-2xl">Agent Login</h2> */}
        <div className="flex w-full flex-col">
          <Form {...agentLoginForm}>
            <form
              className="flex flex-col items-start justify-start space-y-4"
              onSubmit={agentLoginForm.handleSubmit(loginAgent)}
              onChange={() => setLoginErrors(false)}
            >
              <div className="w-full">
                {/* <label>Email</label> */}
                <FormField
                  name="id"
                  control={agentLoginForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your ID"
                          className="mt-2 h-10 w-full rounded-md bg-zinc-900 px-4 py-4 text-sm text-white placeholder:text-sm placeholder:text-red-600"
                        />
                      </FormControl>
                      <FormDescription className="text-sm text-red-600">
                        {agentLoginForm.formState.errors.id
                          ? agentLoginForm.formState.errors.id.message
                          : ''}
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                {/* <label>ID</label> */}
                <FormField
                  name="password"
                  control={agentLoginForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Enter your Password"
                          className="mt-2 h-10 w-full rounded-md bg-zinc-900 px-4 py-4 text-sm text-white placeholder:text-sm placeholder:capitalize placeholder:text-red-600"
                        />
                      </FormControl>
                      <FormDescription className="text-sm text-red-600">
                        {agentLoginForm.formState.errors.password
                          ? agentLoginForm.formState.errors.password.message
                          : ''}
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <button
                  type="submit"
                  className="flex w-full flex-row items-center justify-center space-x-4 rounded-lg bg-ndcgreen py-2 text-base text-white"
                >
                  {isLoading ? (
                    <Loader className="animate-spin" />
                  ) : (
                    <>
                      <span className="uppercase">Sign In</span>
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
                {loginErrors && <p className='text-sm text-ndcred leading-tight tracking-tight mt-3'>Oops! Something went wrong. Please try again</p>}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
