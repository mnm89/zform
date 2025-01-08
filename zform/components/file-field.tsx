import { useFormField } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { ParsedField } from "../core/types";
import { ZFieldProps } from "../types";
import { useZField } from "../context";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

function useFileField(field: ParsedField) {
  const { register, getValues } = useFormContext<Record<string, FileList>>();
  const { id, name } = useFormField();
  const { type, key, required } = field;
  const fileList = getValues(name);
  return { type, key, required, id, ...register(name), fileList };
}

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

  const Preview = imagePreview
    ? imagePreview
    : ({ src }: { src?: string }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt="Preview Image"
          src={src}
          className="w-full max-w-[280px] max-h-[160px] object-contain"
        />
      );
  return (
    <div className="grid grid-cols-2 items-center justify-center gap-4">
      <Input
        key={key}
        {...other}
        {...inputProps}
        accept="image/*"
        type="file"
      />
      <Preview src={url} />
    </div>
  );
};
