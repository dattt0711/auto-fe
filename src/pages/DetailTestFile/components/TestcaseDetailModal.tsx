import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import React from "react"
import { Testcase } from "@/services/testcase"

const formSchema = z.object({
  data: z.record(z.string(), z.any()),
  automation_code: z.any(),
});

type FormValues = z.infer<typeof formSchema>

interface TestcaseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  testcase: Testcase | null;
  onSave: (testcase: Testcase) => void;
}

export function TestcaseDetailModal({ isOpen, onClose, testcase, onSave }: TestcaseDetailModalProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: testcase ? {
      data: testcase.data,
      automation_code: testcase.automation_code,
    } : {
      data: {},
      automation_code: null,
    },
  });

  React.useEffect(() => {
    if (testcase) {
      form.reset({
        data: testcase.data,
        automation_code: testcase.automation_code,
      });
    }
  }, [testcase, form]);

  if (!testcase) return null;

  function onSubmit(values: FormValues) {
    if (!testcase) return;
    
    const updatedTestcase: Testcase = {
      _id: testcase._id,
      file_id: testcase.file_id,
      row_index: testcase.row_index,
      is_processed: testcase.is_processed,
      data: values.data,
      automation_code: values.automation_code || null,
    };
    onSave(updatedTestcase);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Test Case</DialogTitle>
          <DialogDescription>
            Make changes to your test case here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="data"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data (JSON)</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      className="min-h-[150px] font-mono"
                      value={JSON.stringify(field.value, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          field.onChange(parsed);
                        } catch {
                          // Handle invalid JSON
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="automation_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Automation Code</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      className="min-h-[150px] font-mono"
                      value={JSON.stringify(field.value, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          field.onChange(parsed);
                        } catch {
                          // Handle invalid JSON
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 