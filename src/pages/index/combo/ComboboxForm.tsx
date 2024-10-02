"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom"; // react-router-dom에서 useNavigate 가져오기
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import useLicense from "./hook/useLicense";
import useMadeAt from "./hook/useMadeAt";

const FormSchema = z.object({
  license: z.string({
    required_error: "Please select a license.",
  }),
  madeAt: z.string({
    required_error: "Please select a madeAt.",
  }),
});

export function ComboboxForm() {
  const navigate = useNavigate(); // useNavigate 훅 사용

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      license: "",
      madeAt: "",
    },
  });

  const {
    data: licenses,
    isLoading: licensesLoading,
  } = useLicense();

  // 선택된 license 값이 변경될 때마다 license 데이터를 업데이트
  useEffect(() => {
    if (licenses && licenses.length > 0) {
      form.setValue("license", licenses[1].license);
    }
  }, [licenses]);

  const selectedLicense = form.watch("license");

  const {
    data: madeAts,
    isLoading: madeAtsLoading,
  } = useMadeAt(selectedLicense);

  useEffect(() => {
    if (madeAts && madeAts.length > 0) {
      form.setValue("madeAt", madeAts[0].value);
    }
  }, [madeAts]);

  // Form 제출 처리
  const onSubmit = () => {
    const selectedLicense = form.watch("license"); // form에서 선택된 license 값 가져오기
    const selectedMadeAt = form.watch("madeAt"); // form에서 선택된 madeAt 값 가져오기

    if (licenses != null && licenses.length > 0) {
      const selectedLicenseId = licenses.find(
        (license) => license.license === selectedLicense
      )?.id;
      if (!selectedLicenseId || !selectedMadeAt) {
        console.error("License or madeAt not selected");
        return;
      }
      // /test로 이동하면서 license_id와 made_at을 쿼리 파라미터로 전달
      navigate(
        `/test?license_id=${selectedLicenseId}&made_at=${selectedMadeAt}`
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {licensesLoading ? (
          <Skeleton className="h-8 w-[200px] rounded-md" /> // shadcn 스켈레톤 컴포넌트
        ) : (
          licenses &&
          licenses.length > 0 && (
            <FormField
              control={form.control}
              name="license"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>License</FormLabel>
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
                                (license) => license.license === field.value
                              )?.license
                            : "Select license"}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search license..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No license found.</CommandEmpty>
                          <CommandGroup>
                            {licenses.map((license) => (
                              <CommandItem
                                value={license.license}
                                key={license.id}
                                onSelect={() => {
                                  form.setValue("license", license.license);
                                }}
                              >
                                {license.license}
                                <CheckIcon
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    license.license === field.value
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
          )
        )}
        {madeAtsLoading ? (
          <Skeleton className="h-8 w-[200px] rounded-md" /> // madeAt 로딩 중일 때 스켈레톤
        ) : (
          madeAts &&
          madeAts.length > 0 && (
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
                                  form.setValue("madeAt", madeAt.value);
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
          )
        )}
        <Button type="submit">문제 풀기</Button>
      </form>
    </Form>
  );
}
