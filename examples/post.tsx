import ZForm from "@/zform";
import { z } from "zod";

export const postFormSchema = z.object({
  title: z
    .string({ required_error: "Please provide a title for post" })
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title is too long"),
  content: z
    .string({ required_error: "Please provide a content for the post" })
    .min(10, "Content must be at least 10 characters")
    .max(2000, "Content is too long"),
  tags: z
    .array(z.string({ required_error: "Tag cannot be empty" }))
    .min(1, "At least one tag is required")
    .max(10, "You can add up to 10 tags"),
  metadata: z.object(
    {
      date: z.date({ required_error: "Please provide the date of the post" }),
      location: z.string({
        required_error: "Please provide the location of the post",
      }),
    },
    { required_error: "Please complete post metadata" }
  ),
});
export default function PostForm() {
  return (
    <ZForm
      schema={postFormSchema}
      onSubmit={(data) => console.log(data)}
      withSubmit
      header={
        <p className="text-2xl text-center font-semibold">Create A Post</p>
      }
      submitProps={{
        variant: "default",
        className: "mx-auto col-span-2 max-w-sm w-full",
      }}
      formProps={{
        className: "grid grid-cols-2 gap-2 items-center",
      }}
      fieldsProps={{
        metadata: {
          itemClassName:
            "col-span-2 grid grid-cols-2 gap-2 items-center border p-1",
        },
      }}
    />
  );
}
