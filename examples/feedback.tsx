"use client";

import React from "react";
import { z } from "zod";
import ZForm from "@/zform";

const feedbackSchema = z.object({
  rating: z
    .number({ required_error: "Rating is required" })
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  comment: z.string().max(500, "Comment is too long").optional(),
  subscribe: z.boolean().default(false),
});

export default function FeedbackForm() {
  return (
    <ZForm
      schema={feedbackSchema}
      onSubmit={(data) => console.log(data)}
      withSubmit
      withReset
      header={<h2 className="text-xl font-semibold">Feedback Form</h2>}
      submitProps={{
        variant: "default",
      }}
      resetProps={{
        variant: "outline",
      }}
      formProps={{
        className: "grid grid-cols-2 gap-2 items-center",
      }}
      fieldsProps={{
        rating: {
          inputProps: {
            min: 1,
            max: 5,
            step: 1,
          },
          typeOverride: "stepper",
        },
        comment: {
          itemClassName: "col-span-2",
          typeOverride: "textarea",
          inputProps: {
            placeholder: "Add a comment (optional)",
          },
        },
        subscribe: {
          itemClassName: "col-span-2",
          labelOverride: "Subscribe to updates",
          descriptionOverride:
            "Get notified about responses and new feedback features.",
        },
      }}
    />
  );
}