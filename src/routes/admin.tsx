import { Form, FormControl, FormDescription, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import MainNav from "@/components/widgets/MainNav";
import { loginSchema } from "@/utils/constants";
import { sendAgentLogin } from "@/utils/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, RotateCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { createSearchParams, useNavigate } from "react-router-dom";
import { z } from "zod";

export default function Admin() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const initialLoginValues = useMemo(() => {
    return {
      id: "",
      password: ""
    }
  }, [])
  const agentLoginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: initialLoginValues
  })

  const [isLoading, setIsLoading] = useState(false)
  const [loginErrors, setLoginErrors] = useState(false)

  async function loginAgent(values: z.infer<typeof loginSchema>) {
    setIsLoading(true)
    const response = await sendAgentLogin(values)
    if (response === 200) {
      setIsLoading(false)
      const params = { id: values.id }
      navigate({
        pathname: '/dashboard',
        search: `?${createSearchParams(params)}`
      })
    } else {
      setIsLoading(false)
      setLoginErrors(true)
      toast({
        variant: "destructive",
        title: "Sorry! Login Error",
        description: "We could not log you in. Please try again."
      })
    }
  }

  useEffect(() => {
    if (loginErrors) {
      agentLoginForm.reset(initialLoginValues)
    }
  }, [loginErrors, agentLoginForm, initialLoginValues])
  return (
    <div className="bg-zinc-900 bg-[url('/logo_bg.svg')] bg-center bg-no-repeat w-full min-h-screen flex flex-col">
      <MainNav />

      <div className="my-auto flex flex-col items-center justify-center w-full px-8 md:px-0 md:w-1/4 lg:w-1/5 mx-auto">
        <div className="flex flex-col items-center justify-center">
          <img src="/logo.png" />
        </div>
        {/* <h2 className="my-6 uppercase font-bold text-2xl">Agent Login</h2> */}
        <div className="w-full flex flex-col">
          <Form
            {...agentLoginForm}
          >
            <form className="flex flex-col items-start justify-start space-y-4" onSubmit={agentLoginForm.handleSubmit(loginAgent)}>
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
                          className="placeholder:text-sm placeholder:text-red-600 w-full rounded-md py-4 h-10 text-sm px-4 mt-2 bg-zinc-900"
                        />
                      </FormControl>
                      <FormDescription className="text-sm text-red-600">{agentLoginForm.formState.errors.id ? agentLoginForm.formState.errors.id.message : ''}</FormDescription>
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
                          className="placeholder:text-sm placeholder:text-red-600 w-full rounded-md py-4 h-10 text-sm px-4 mt-2 bg-zinc-900 placeholder:capitalize"
                        />
                      </FormControl>
                      <FormDescription className="text-sm text-red-600">{agentLoginForm.formState.errors.password ? agentLoginForm.formState.errors.password.message : ''}</FormDescription>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <button type="submit" className="rounded-lg w-full bg-ndcgreen text-white py-2 text-base flex flex-row justify-center items-center space-x-4">
                  {isLoading ? (<RotateCw className="animate-spin" />) : (
                    <>
                      <span className="uppercase">Sign In</span>
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
