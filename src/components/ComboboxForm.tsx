"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useNavigate } from "react-router-dom" // react-router-dom에서 useNavigate 가져오기

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/hooks/use-toast"

const licenses = [
  { label: "미용사(일반)", value: "미용사(일반)" },
  { label: "미용사(피부)", value: "미용사(피부)" },
] as const

const madeAts = [
  { label: "2024년 10월 10일", value: "2024년 10월 10일" },
  { label: "2024년 10월 11일", value: "2024년 10월 11일" },
] as const

const FormSchema = z.object({
  license: z.string({
    required_error: "Please select a license.",
  }),
  madeAt: z.string({
    required_error: "Please select a madeAt.",
  }),
})

export function ComboboxForm() {
  const navigate = useNavigate() // useNavigate 훅 사용
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // 서브밋 시 /test 경로로 이동하며 폼 데이터를 쿼리 파라미터로 전달
    navigate(`/test?license=${data.license}&madeAt=${data.madeAt}`)
    
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FormField
          control={form.control}
          name="license"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>license</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? licenses.find(
                            (licenses) => licenses.value === field.value
                          )?.label
                        : "Select license"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search framework..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No framework found.</CommandEmpty>
                      <CommandGroup>
                        {licenses.map((license) => (
                          <CommandItem
                            value={license.label}
                            key={license.value}
                            onSelect={() => {
                              form.setValue("license", license.value)
                            }}
                          >
                            {license.label}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                license.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="madeAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>madeAt</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? madeAts.find(
                            (madeAt) => madeAt.value === field.value
                          )?.label
                        : "Select madeAt"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search framework..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No framework found.</CommandEmpty>
                      <CommandGroup>
                        {madeAts.map((madeAt) => (
                          <CommandItem
                            value={madeAt.label}
                            key={madeAt.value}
                            onSelect={() => {
                              form.setValue("madeAt", madeAt.value)
                            }}
                          >
                            {madeAt.label}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                madeAt.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">문제 풀기</Button>
      </form>
    </Form>
  )
}
