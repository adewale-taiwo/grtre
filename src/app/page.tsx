"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formattedLogs, setFormattedLogs] = useState<null | string>(null);

  const formSchema = z.object({
    separator: z.string().min(1, "Separator can not be empty!"),
    columnSpacing: z.string(),
    jobLog: z.string().min(1, "Job log can not be empty!"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      separator: "-",
      columnSpacing: "2",
      jobLog: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { separator, columnSpacing, jobLog } = values;

    // split job log entries by line breaks and remove empty lines
    const logEntries = jobLog
      .split("\n")
      .filter((logTask) => logTask.trim() !== "");

    const formattedLogEntries = logEntries
      .map((logTask) => {
        // split each task by the separator
        const splitLogEntry = logTask.split(separator);

        // join details together if split because of presence of separator
        // and trim extra whitespace
        const separatedLogEntry = [
          splitLogEntry[0].trim(),
          splitLogEntry.slice(1).join(separator).trim(),
        ];

        // insert desired number of columns in between time and details
        const formattedLogEntry =
          separatedLogEntry[0] +
          "\t".repeat(Number(columnSpacing) + 1) +
          separatedLogEntry[1];

        return formattedLogEntry;
      })
      .join("\n");

    setFormattedLogs(formattedLogEntries);
    setDialogOpen(true);
  }

  function handleCopyToClipboard() {
    if (formattedLogs) {
      navigator.clipboard
        .writeText(formattedLogs)
        .then(() => {
          toast({
            title: "Copy Successful!",
            description:
              "The formatted job log has been successfully copied to your clipboard.",
          });
        })
        .catch(() => {
          toast({
            variant: "destructive",
            title: "Copy Failed!",
            description: "Something went wrong. Please try copying again.",
          });
        });
    }
  }

  return (
    <>
      <div className="px-6 pb-5 pt-4 shadow text-center mb-6 dark:border-b dark:shadow-lg bg-muted">
        <p className="text-2xl sm:text-3xl font-medium">Job log formatter</p>
      </div>

      <div className="px-6 mx-auto mb-16 max-w-6xl lg:px-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-8 gap-x-6 lg:grid lg:grid-cols-2"
          >
            <FormField
              control={form.control}
              name="separator"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Separator</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the character that separates the time and details
                    (e.g, hyphen, comma). Default is hyphen "-"
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="columnSpacing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Column Spacing</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="2" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="h-[40vh]">
                      <SelectItem value={"0"}>None</SelectItem>
                      {Array.from({ length: 10 }).map((_, i) => (
                        <SelectItem
                          key={`column-spacing-${i}`}
                          value={`${i + 1}`}
                        >
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the number of empty columns between the time and
                    details.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobLog"
              render={({ field }) => (
                <FormItem className="lg:col-span-2">
                  <FormLabel>Enter job log</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-y min-h-60"
                      placeholder="e.g. 08:00 - Task completed..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Paste or type your job log entries. Ensure it is correctly
                    formatted for best results
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="lg:col-span-2">
              <AlertDialog
                open={dialogOpen}
                onOpenChange={() => setDialogOpen(false)}
              >
                <AlertDialogTrigger asChild>
                  <Button type="submit" size="lg">
                    Convert
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Conversion Successful!</AlertDialogTitle>
                    <AlertDialogDescription>
                      Your job logs have been successfully formatted. Would you
                      like to copy the formatted logs to your clipboard?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCopyToClipboard}>
                      Copy Logs
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
