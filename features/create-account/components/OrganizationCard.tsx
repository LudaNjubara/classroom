"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { CountriesCombobox } from "@/components/ui/CountriesCombobox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { API_ENDPOINTS } from "@/constants/api-constants";
import { Profile } from "@prisma/client";
import { useRouter } from "next/navigation";
import { TCountry } from "../types";

const formSchema = z.object({
  name: z
    .string()
    .nonempty({
      message: "PLease enter a name.",
    })
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(255, {
      message: "Name must be at most 255 characters.",
    }),
  email: z
    .string()
    .nonempty({
      message: "Please enter an email.",
    })
    .email({
      message: "Please enter a valid email.",
    }),
  address: z
    .string()
    .nonempty({
      message: "Please enter an address.",
    })
    .min(2, {
      message: "Address must be at least 2 characters.",
    }),
  city: z
    .string()
    .nonempty({
      message: "Please enter a city.",
    })
    .min(2, {
      message: "City must be at least 2 characters.",
    }),
  state: z
    .string()
    .nonempty({
      message: "Please enter a state.",
    })
    .min(2, {
      message: "State must be at least 2 characters.",
    }),
  phone: z.string().nonempty({
    message: "Please enter a phone number.",
  }),
  country: z.string().nonempty({
    message: "Please select a country.",
  }),
});

type TProps = {
  profile: Profile;
  countries: TCountry[];
};

export default function OrganizationCard({ profile, countries }: TProps) {
  const { toast } = useToast();
  const router = useRouter();

  const [selectedCountry, setSelectedCountry] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      email: "",
      address: "",
      city: "",
      state: "",
      phone: "",
      country: selectedCountry,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!(form.formState.isValid || selectedCountry)) return;

    fetch(API_ENDPOINTS.ORGANIZATION.CREATE, {
      method: "POST",
      body: JSON.stringify({
        ...values,
        profileId: profile.kindeId,
      }),
    })
      .then((res) => {
        if (res.ok) {
          router.refresh();

          toast({
            title: "Organization created.",
            description:
              "Your organization was successfully created, you should see your dashboard in a few moments. Welcome to the Classroom platform!",
            variant: "default",
          });
        } else {
          toast({
            title: "Error creating organization.",
            description: "Something went wrong while creating your organization.",
            variant: "destructive",
            action: (
              <ToastAction altText="Try again" onClick={form.handleSubmit(onSubmit)}>
                Try again
              </ToastAction>
            ),
          });
        }
      })
      .catch((err) => {
        toast({
          title: "Error creating organization.",
          description: err.message,
          variant: "destructive",
        });
      });
  }

  useEffect(() => {
    form.setValue("country", selectedCountry);
  }, [selectedCountry, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization</CardTitle>
        <CardDescription>
          Create an organization which will represent your school or university on Classroom&reg; platform.
          With it you can manage your teachers, classes, students and much more. Start by filling out the form
          below.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-2 gap-14">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Hogwarts..." {...field} />
                    </FormControl>
                    <FormDescription>This is your school / university name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="hey@there.com" {...field} />
                    </FormControl>
                    <FormDescription>This is your school / university email.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St..." {...field} />
                    </FormControl>
                    <FormDescription>This is your school / university address.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="New York..." {...field} />
                    </FormControl>
                    <FormDescription>This is your school / university city.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="New York..." {...field} />
                    </FormControl>
                    <FormDescription>This is your school / university state.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+385 1234 567" {...field} />
                    </FormControl>
                    <FormDescription>This is your school / university phone number.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={() => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <CountriesCombobox
                        countriesData={countries}
                        selectedCountry={selectedCountry}
                        setSelectedCountry={setSelectedCountry}
                      />
                    </FormControl>
                    <FormDescription>This is your school / university country.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
