import CodeBlock from "@/components/ui/code-block";
import fs from "fs";
import path from "path";
import DynamicComponent from "@/components/dynamic-example-component";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CopyToClipboardButton from "@/components/copy-to-clipbord-button";
interface Props {
  params: Promise<{
    example: string;
  }>;
}

export default async function ExampleDetail({ params }: Props) {
  const { example } = await params;

  const file = fs.readFileSync(
    path.join(process.cwd(), "examples", `${example}.tsx`),
    "utf-8"
  );

  if (!file) redirect("/404");

  return (
    <section className="p-4 grid grid-cols-1 gap-2 md:grid-cols-2 items-center h-screen">
      <Card>
        <CardContent className="py-4 flex items-center justify-center">
          <DynamicComponent example={example} />
        </CardContent>
      </Card>
      <Card className="border-none">
        <CardHeader className="flex justify-end items-end p-0">
          <CopyToClipboardButton textToCopy={file} />
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[700px] w-full">
            <CodeBlock code={`${file}`} language="tsx" />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
    </section>
  );
}
