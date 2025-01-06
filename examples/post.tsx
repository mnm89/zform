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
    .array(
      z
        .string({ required_error: "Tag cannot be empty" })
        .max(20, "Tag name too long")
    )
    .min(1, "At least one tag is required")
    .max(10, "You can add up to 10 tags"),
  metadata: z.object({
    date: z.date({ required_error: "Please provide the date of the post" }),
    location: z.string({
      required_error: "Please provide the location of the post",
    }),
  }),
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
        content: {
          itemClassName: "col-span-2",
          typeOverride: "textarea",
        },
        metadata: {
          itemClassName:
            "col-span-2 grid grid-cols-2 gap-2 items-center border p-1",
          descriptionOverride: "Post metadata including the date and location",
        },
        tags: {
          itemClassName:
            "col-span-2 grid grid-cols-4 gap-2 items-center border p-1",
          descriptionOverride: "Post tags to help users find your post",
        },
      }}
    />
  );
}
