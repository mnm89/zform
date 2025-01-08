"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import ZForm, { Config } from "@/zform";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { z } from "zod";

const mySchema = z.object({
  avatar: z.custom<FileList>((val) => {
    return val instanceof FileList && val.length > 0;
  }, "Please upload a profile picture"),
  username: z.string({ required_error: "Please enter a username" }).max(50),
  bio: z
    .string()
    .min(100, "A bio should include at least 100 characters")
    .max(500, "A bio should not have more than 500 characters"),
});

const config: Config<typeof mySchema> = {
  bio: { typeOverride: "textarea" },
  avatar: {
    typeOverride: "image-preview",
    imagePreview: ({ src }) => (
      <Avatar className="size-24 border-input border mx-auto">
        <AvatarImage src={src} />
        <AvatarFallback className="w-full break-words my-auto text-center">
          User Avatar
        </AvatarFallback>
      </Avatar>
    ),
  },
};

export default function ProfileForm() {
  return (
    <ZForm
      schema={mySchema}
      onSubmit={(data) => console.log(data)}
      withSubmit
      header={
        <p className="text-2xl text-center font-semibold">
          Update Your Profile
        </p>
      }
      submitProps={{
        variant: "default",
        className: "mx-auto max-w-sm w-full",
      }}
      formProps={{
        className: "w-full flex flex-col",
        noValidate: true,
      }}
      config={config}
    />
  );
}
