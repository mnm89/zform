import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { useFormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useZField } from "../context";
import { ParsedField } from "../core/types";
import { ZFieldProps } from "../types";

function useFileField(field: ParsedField) {
  const { register, getValues } = useFormContext<Record<string, FileList>>();
  const { id, name } = useFormField();
  const { type, key, required } = field;
  const fileList = getValues(name);
  return { type, key, required, id, ...register(name), fileList };
}

const ImagePreview: React.FC<{ src?: string }> = ({ src }) => {
  return (
    <div
      className="size-64 bg-gray-200 rounded-lg border border-gray-300 bg-no-repeat bg-contain bg-center flex items-center justify-center"
      style={{
        backgroundImage: src ? `url(${src})` : "none",
      }}
    >
      {!src && (
        <span className="text-center text-gray-500">
          Select an image to preview
        </span>
      )}
    </div>
  );
};

export const ImagePreviewField: React.FC<ZFieldProps> = ({ field, path }) => {
  const { key, fileList, ...other } = useFileField(field);
  const { imagePreview, inputProps } = useZField(field, path);
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    let objectUrl: string;
    if (fileList && fileList[0] && fileList[0] instanceof File) {
      objectUrl = URL.createObjectURL(fileList[0]);
    }
    setUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return objectUrl;
    });
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [fileList]);

  const Preview = imagePreview ? imagePreview : ImagePreview;
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Preview src={url} />
      <Input
        key={key}
        {...other}
        {...inputProps}
        accept="image/*"
        type="file"
      />
    </div>
  );
};
