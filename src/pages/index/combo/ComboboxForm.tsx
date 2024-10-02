import { useState, useEffect } from "react"; // useState 가져오기
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
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
  const navigate = useNavigate();
  const [licensePopoverOpen, setLicensePopoverOpen] = useState(false); // Popover 상태 관리
  const [madeAtPopoverOpen, setMadeAtPopoverOpen] = useState(false); // madeAt Popover 상태 관리

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

  useEffect(() => {
    if (licenses && licenses.length > 0) {
      const reorderedLicenses = [
        ...licenses.filter((license) => license.license !== "미용장"),
        ...licenses.filter((license) => license.license === "미용장"),
      ];
      form.setValue("license", reorderedLicenses[0].license);
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

  const onSubmit = () => {
    const selectedLicense = form.watch("license");
    const selectedMadeAt = form.watch("madeAt");

    if (licenses != null && licenses.length > 0) {
      const selectedLicenseId = licenses.find(
        (license) => license.license === selectedLicense
      )?.id;
      if (!selectedLicenseId || !selectedMadeAt) {
        console.error("License or madeAt not selected");
        return;
      }
      navigate(
        `/test?license_id=${selectedLicenseId}&made_at=${selectedMadeAt}`
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {licensesLoading ? (
          <Skeleton className="h-8 w-[200px] rounded-md" />
        ) : (
          licenses &&
          licenses.length > 0 && (
            <FormField
              control={form.control}
              name="license"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>과목</FormLabel>
                  <Popover
                    open={licensePopoverOpen}
                    onOpenChange={setLicensePopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                          onClick={() => setLicensePopoverOpen(!licensePopoverOpen)} // 버튼 클릭 시 팝업 열림/닫힘 토글
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
                        <CommandList>
                          <CommandGroup>
                            {licenses.map((license) => (
                              <CommandItem
                                value={license.license}
                                key={license.id}
                                onSelect={() => {
                                  form.setValue("license", license.license);
                                  setLicensePopoverOpen(false); // 선택 시 Popover 닫기
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
          <Skeleton className="h-8 w-[200px] rounded-md" />
        ) : (
          madeAts &&
          madeAts.length > 0 && (
            <FormField
              control={form.control}
              name="madeAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>회차</FormLabel>
                  <Popover
                    open={madeAtPopoverOpen}
                    onOpenChange={setMadeAtPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                          onClick={() => setMadeAtPopoverOpen(!madeAtPopoverOpen)} // 버튼 클릭 시 팝업 열림/닫힘 토글
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
                        <CommandList>
                          <CommandGroup>
                            {madeAts.map((madeAt) => (
                              <CommandItem
                                value={madeAt.label}
                                key={madeAt.value}
                                onSelect={() => {
                                  form.setValue("madeAt", madeAt.value);
                                  setMadeAtPopoverOpen(false); // 선택 시 Popover 닫기
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
