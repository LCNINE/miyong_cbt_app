import { useState, useEffect, useMemo } from "react";
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
import useTests from "./hook/useTests";
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { supabase } from "@/lib/supabaseClient";

// 폼 스키마 정의
const FormSchema = z.object({
  license: z.string({
    required_error: "Please select a license.",
  }),
  episodeWithYear: z.string({
    required_error: "Please select an episode and year.",
  }),
});

export function ComboboxForm() {
  const navigate = useNavigate();
  const [licensePopoverOpen, setLicensePopoverOpen] = useState(false);
  const [episodePopoverOpen, setEpisodePopoverOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      license: "",
      episodeWithYear: "",
    },
  });

  // 로그 데이터를 Supabase에 저장하는 함수
  async function sendLogToSupabase(logMessage: string) {
    const { data, error } = await supabase
      .from('logs')
      .insert([{ message: logMessage }]);

    if (error) {
      console.error('Error inserting log:', error);
    } else {
      console.log('Log inserted:', data);
    }
  }

  // window.onerror 핸들러 추가
  useEffect(() => {
    const originalOnError = window.onerror;

    window.onerror = function (message, source, lineno, colno, error) {
      const logMessage = `
        Message: ${message}
        Source: ${source}
        Line: ${lineno}
        Column: ${colno}
        Error Object: ${JSON.stringify(error)}
      `;
      sendLogToSupabase(logMessage);
      return false; // 기본 오류 처리를 막지 않음
    };

    return () => {
      window.onerror = originalOnError; // 컴포넌트가 언마운트되면 핸들러 원복
    };
  }, []);

  const {
    data: tests,
    isLoading: testsLoading,
    error: testsError,
  } = useTests();
  if (testsError) {
    console.error("Error loading tests:", testsError);
    sendLogToSupabase(`Error loading tests: ${testsError}`);
    navigate("/error", {
      state: { message: `Error loading tests: ${testsError}` },
    });
  }

  // 라이센스 목록 메모이제이션
  const licenses = useMemo(() => {
    return tests ? [...new Set(tests.map((test) => test.license_name))] : [];
  }, [tests]);

  // 선택된 라이센스에 해당하는 테스트 필터링
  const selectedLicense = form.watch("license");
  const filteredTests = useMemo(() => {
    return tests?.filter((test) => test.license_name === selectedLicense) || [];
  }, [tests, selectedLicense]);

  // 회차와 년도를 합친 배열 생성
  const episodesWithYears = useMemo(() => {
    return filteredTests.map((test) => {
      const episode = test.episode ? `${test.episode}회` : "";
      const madeAt = test.made_at ? `${test.made_at}` : "";
      return {
        label: `${episode} ${madeAt}`.trim(),
        value: test.test_id.toString(),
      };
    });
  }, [filteredTests]);

  // 기본적으로 첫 번째 라이센스 선택하게 설정
  useEffect(() => {
    if (licenses.length > 0 && !selectedLicense) {
      form.setValue("license", licenses[0]);
    }
  }, [licenses, form, selectedLicense]);

  // 기본적으로 첫 번째 회차/년도 선택하게 설정
  useEffect(() => {
    if (episodesWithYears.length > 0) {
      form.setValue("episodeWithYear", episodesWithYears[0].value);
    }
  }, [episodesWithYears, form]);

  const onSubmit = () => {
    const selectedTestId = form.watch("episodeWithYear");

    if (!selectedTestId) {
      console.error("Test not selected");
      return;
    }

    navigate(`/test?test_id=${selectedTestId}`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {testsLoading ? (
          <Skeleton className="h-8 w-[200px] rounded-md" />
        ) : (
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
                          aria-label="항목 선택1(과목)"
                        >
                          {field.value || "Select license"}
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
                                value={license}
                                key={license}
                                onSelect={() => {
                                  form.setValue("license", license);
                                  setLicensePopoverOpen(false);
                                }}
                              >
                                {license}
                                <CheckIcon
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    license === field.value
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

        {episodesWithYears.length > 0 && (
          <FormField
            control={form.control}
            name="episodeWithYear"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>회차 및 년도</FormLabel>
                <Popover
                  open={episodePopoverOpen}
                  onOpenChange={setEpisodePopoverOpen}
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
                        aria-label="항목 선택2(회차 및 년도)"
                      >
                        {field.value
                          ? episodesWithYears.find(
                              (item) => item.value === field.value
                            )?.label
                          : "Select episode and year"}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandList>
                        <CommandGroup>
                          {episodesWithYears.map((item) => (
                            <CommandItem
                              value={item.value}
                              key={item.value}
                              onSelect={() => {
                                form.setValue("episodeWithYear", item.value);
                                setEpisodePopoverOpen(false);
                              }}
                            >
                              {item.label}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  item.value === field.value
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
        )}

        <Button type="submit" aria-label="문제를 풀기 위한 버튼">
          문제 풀기
        </Button>
      </form>
    </Form>
  );
}
