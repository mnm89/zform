import ZForm from "@/zform";
import { z } from "zod";

const WorkExperienceSchema = z.object({
  position: z.object({
    title: z.string({ required_error: "Position title is required" }),
    company: z.string(),
  }),
});

const WorkExperiencesFormSchema = z.object({
  job_history: z.array(WorkExperienceSchema),
});
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
      fieldsConfig={{
        job_history: {
          className: "w-full",
          item: {
            className: "grid grid-cols-2 gap-2",
          },
        },
      }}
    />
  );
}
