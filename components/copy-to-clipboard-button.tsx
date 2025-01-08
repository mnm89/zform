"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clipboard, ClipboardCheck } from "lucide-react";

export default function CopyToClipboardButton({
  textToCopy,
}: {
  textToCopy: string;
}) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);

      // Reset copied state after animation
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      setIsCopied(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleCopy}
      className={`flex items-center justify-center p-2 rounded-md ${
        isCopied ? "animate-pulse" : ""
      }`}
    >
      {isCopied && <span className="ml-2 text-sm">Copied!</span>}
      {isCopied ? (
        <ClipboardCheck className="size-6" />
      ) : (
        <Clipboard className="size-6" />
      )}
    </Button>
  );
}
