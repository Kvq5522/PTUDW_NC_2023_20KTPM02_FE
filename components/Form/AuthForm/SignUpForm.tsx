"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import Link from "next/link";

import { AXIOS } from "@/constants/ApiCall";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";

const isAlphanumericWithUppercase = (value: string) => {
  return /[A-Z]/.test(value) && /[0-9]/.test(value);
};

const isAgePositiveInteger = (value: number | undefined) => {
  return value ? /^(150|[1-9][0-9]?)$/.test(value.toString()) : true;
};

const isPhoneNumber = (value: string | undefined) => {
  return value ? /^[0-9]{10}$/.test(value) : true;
};

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).refine(isAlphanumericWithUppercase, {
    message: "Password must be alphanumeric with uppercase",
  }),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  phone: z.string().optional().refine(isPhoneNumber, {
    message: "Phone number must be with 10 digits",
  }),
  address: z.string().optional(),
  age: z.preprocess(
    (value: any) => (value === "" ? 0 : Number(value)),
    z.number().optional().refine(isAgePositiveInteger, {
      message: "Age must be a positive integer less than 150",
    })
  ),
  gender: z.string().optional(),
});

interface SignUpFormProps {
  className?: string;
}

export const SignUpForm: React.FC<SignUpFormProps> = (
  props: SignUpFormProps
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const toast = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      phone: "",
      address: "",
      age: 0,
      gender: "M",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setError("");

    const res = await AXIOS.POST({ uri: "/auth/sign-up", params: values });

    if (res && res.statusCode === 201) {
      toast.toast({
        title: "Account has been created!",
        description: "Please check your email to verify your account!",
        className: "top-[-80vh] bg-green-500 text-white",
      });

      setTimeout(() => {
        window.location.href = "/sign-in";
      }, 5000);

      return;
    }

    setError(res.message);
    setLoading(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("p-3 overflow-auto", props.className)}
      >
        <Toaster />
        <div className="space-y-4 w-full">
          <div className="flex justify-center">
            <h1 className="text-2xl">Create account for Classroom!</h1>
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel className="w-[15%] truncate">
                    Email (<span className="text-red-500">*</span>)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Email"
                      disabled={loading}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel className="w-[15%] truncate">
                    Password (<span className="text-red-500">*</span>)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type={"password"}
                      placeholder="Password"
                      disabled={loading}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between gap-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem className="w-[50%]">
                  <FormLabel>
                    <div className="truncate">
                      First Name (<span className="text-red-500">*</span>)
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="First Name"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem className="w-[50%]">
                  <FormLabel>
                    <div className="truncate">
                      Last Name (<span className="text-red-500">*</span>)
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Last Name"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-between gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="w-[50%]">
                  <FormLabel>
                    <div className="truncate">Phone Number</div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Phone number"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="w-[50%]">
                  <FormLabel>
                    <div className="truncate">Address</div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Address"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-between gap-4">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem className="w-[50%]">
                  <FormLabel>
                    <div className="truncate">Age</div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Age"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="w-[50%]">
                  <FormLabel>
                    <div className="truncate">Gender</div>
                  </FormLabel>
                  <FormControl>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Gender" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="M">Male</SelectItem>
                        <SelectItem value="F">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {error && <em className="text-red-600">{error}</em>}

          <div className="pt-6 space-x-2 flex flex-wrap items-center justify-end w-full">
            <Link
              href="/sign-in"
              className={cn(
                buttonVariants({ variant: "outline" }),
                loading ? "pointer-events-none opacity-50" : ""
              )}
            >
              Sign In Here
            </Link>

            <Button type="submit" disabled={loading}>
              Sign Up
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
