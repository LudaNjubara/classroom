import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Profile } from "@prisma/client";
import fetchCountries from "../api/fetch-countries";
import OrganizationCard from "./OrganizationCard";
import StudentCard from "./StudentCard";
import TeacherCard from "./TeacherCard";

type TProps = {
  profile: Profile;
};

export async function CreateAccount({ profile }: TProps) {
  const { countries, isLoading, error } = await fetchCountries();

  return (
    <div>
      <h2
        className="text-6xl mb-10 font-bold bg-clip-text text-transparent
      bg-gradient-to-b from-slate-100 to-slate-200/90
      dark:from-slate-800 dark:to-slate-900/90"
      >
        Join the best education community in the world!
      </h2>

      <Tabs defaultValue="organization" className="w-full">
        <TabsList className="grid w-full grid-cols-3 gap-1">
          <TabsTrigger
            className="hover:bg-slate-300/80 dark:hover:bg-slate-900/80"
            value="organization"
            disabled={isLoading || !!error}
          >
            Organization
          </TabsTrigger>
          <TabsTrigger
            className="hover:bg-slate-300/80 dark:hover:bg-slate-900/80"
            value="teacher"
            disabled={isLoading || !!error}
          >
            Teacher
          </TabsTrigger>
          <TabsTrigger
            className="hover:bg-slate-300/80 dark:hover:bg-slate-900/80"
            value="student"
            disabled={isLoading || !!error}
          >
            Student
          </TabsTrigger>
        </TabsList>
        <TabsContent value="organization">
          <OrganizationCard profile={profile} countries={countries} />
        </TabsContent>
        <TabsContent value="teacher">
          <TeacherCard
            profile={profile}
            countries={[
              {
                name: { common: "Croatia" },
                cca2: "HR",
                flags: {
                  png: "https://flagcdn.com/w320/hr.png",
                  svg: "https://flagcdn.com/hr.svg",
                },
              },
            ]}
          />
        </TabsContent>
        <TabsContent value="student">
          <StudentCard profile={profile} countries={countries} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
