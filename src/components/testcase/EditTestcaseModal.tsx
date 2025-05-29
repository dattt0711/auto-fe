import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
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

const formSchema = z.object({
  itemNo: z.string().min(1, "Item No is required"),
  stepConfirm: z.string().min(1, "Steps are required"),
  expectationResult: z.string().min(1, "Expected result is required"),
})

type FormValues = z.infer<typeof formSchema>

interface EditTestcaseModalProps {
  isOpen: boolean
  onClose: () => void
  testcase: {
    id: string
    itemNo: string
    stepConfirm: string
    expectationResult: string
  } | null
  onSave: (testcase: {
    id: string
    itemNo: string
    stepConfirm: string
    expectationResult: string
  }) => void
}

export function EditTestcaseModal({ isOpen, onClose, testcase, onSave }: EditTestcaseModalProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: testcase ? {
      itemNo: testcase.itemNo,
      stepConfirm: testcase.stepConfirm,
      expectationResult: testcase.expectationResult,
    } : {
      itemNo: '',
      stepConfirm: '',
      expectationResult: '',
    },
  })

  // Watch all form values
  // const formValues = form.watch()
  // console.log('Current form values:', formValues)

  // // Watch specific field
  // const stepConfirmValue = form.watch('stepConfirm')
  // console.log('Step Confirm value:', stepConfirmValue)

  // // Watch multiple fields
  // const [itemNo, expectationResult] = form.watch(['itemNo', 'expectationResult'])
  // console.log('Item No:', itemNo, 'Expected Result:', expectationResult)

  // Reset form when testcase changes
  React.useEffect(() => {
    if (testcase) {
      form.reset({
        itemNo: testcase.itemNo,
        stepConfirm: testcase.stepConfirm,
        expectationResult: testcase.expectationResult,
      })
    }
  }, [testcase, form])

  if (!testcase) return null

  const currentTestcase = testcase

  function onSubmit(values: FormValues) {
    const updatedTestcase = {
      id: currentTestcase.id,
      ...values,
    }
    console.log('Edited Testcase:', updatedTestcase)
    onSave(updatedTestcase)
    onClose()
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
              name="itemNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item No</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stepConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Steps</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-[150px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expectationResult"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Result</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
  )
} 