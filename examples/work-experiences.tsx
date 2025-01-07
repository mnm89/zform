import ZForm, { Config } from "@/zform";
import { z } from "zod";

const WorkExperienceSchema = z.object({
  role: z.object({
    title: z.string({ required_error: "Role title is required" }),
    company: z.string({ required_error: "Company name is required" }),
  }),
  period: z.object({
    from: z.date(),
    to: z.date().optional(),
  }),
  description: z
    .string()
    .min(10, "Role description must be at least 10 characters")
    .max(2000, "Description is too long"),
});

const WorkExperiencesFormSchema = z.object({
  full_name: z.string({ required_error: "Your name is missing" }),
  job_history: z
    .array(WorkExperienceSchema)
    .min(1, "At least one work experience is needed"),
});

const config: Config<typeof WorkExperiencesFormSchema> = {
  full_name: {
    className: "w-full",
  },
  job_history: {
    className: "w-full flex-col gap-2 flex",
    itemClassName: "border rounded-md",
    role: {
      className: "grid grid-cols-2 gap-2 border-b",
    },
    period: {
      typeOverride: "range",
    },
    description: {
      typeOverride: "textarea",
    },
  },
};
export default function WorkExperienceForm() {
  return (
    <ZForm
      schema={WorkExperiencesFormSchema}
      onSubmit={(data) => console.log(data)}
      withSubmit
      header={
        <p className="text-2xl text-center font-semibold">
          Your Work Experiences
        </p>
      }
      submitProps={{
        variant: "default",
        className: "mx-auto max-w-sm w-full",
      }}
      formProps={{
        className: "flex flex-col items-center gap-4",
      }}
      config={config}
    />
  );
}
