"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useNavigate } from "react-router-dom" // react-router-dom에서 useNavigate 가져오기
import { useState, useEffect } from "react"

import { supabase } from "@/lib/supabaseClient" // Supabase 클라이언트 가져오기
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
import { License, MadeAt } from "@/type/testType"

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
    defaultValues: {
      license: '',
    }
  })

  // 라이선스 및 날짜 상태 관리
  const [licenses, setLicenses] = useState<License[]>([])
  const [madeAts, setMadeAts] = useState<MadeAt[]>([])

  // Supabase에서 라이선스 데이터 가져오기
  useEffect(() => {
    const fetchLicenses = async () => {
      const { data, error } = await supabase
        .from('licenses')  // licenses 테이블에서
        .select('id, license') // license 컬럼만 가져오기

      if (error) {
        console.error("Error fetching licenses:", error)
      } else {
        setLicenses(data || []) // 가져온 데이터를 상태로 설정
      }
    }

    fetchLicenses()
  }, [])

  // license가 선택되면 해당 라이선스의 madeAts 데이터를 가져오기
  useEffect(() => {
    const selectedLicense = form.watch("license"); // form에서 선택된 license 값 가져오기

    if (!selectedLicense) return; // 선택된 license가 없으면 종료
    
    const fetchMadeAts = async () => {
      const selectedLicenseId = licenses.find((license) => license.license === selectedLicense)?.id;

      if (!selectedLicenseId) return; // 선택된 license에 해당하는 ID가 없으면 종료

      // Supabase에서 직접 SQL 쿼리 실행 (RPC 호출)
      const { data, error } = await supabase
        .rpc('get_distinct_made_at', { license_id: selectedLicenseId }); // RPC 함수 호출

      if (error) {
        console.error("Error fetching madeAts:", error);
      } else {
        // label과 value 형태로 변환
        const uniqueMadeAts = data.map((item: { made_at: string | number | Date }) => ({
          label: new Date(item.made_at).toLocaleDateString(), // 날짜 포맷팅
          value: item.made_at,
        }));

        setMadeAts(uniqueMadeAts); // 가져온 데이터를 상태로 설정
        if (uniqueMadeAts.length > 0) {
          form.setValue("madeAt", uniqueMadeAts[0].value); // 첫 번째 madeAt 값을 자동으로 설정
        }
      }
    };

    fetchMadeAts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("license"), licenses]); // 선택된 license가 변경될 때마다 실행



  // licenses가 업데이트된 후 기본값을 설정
  useEffect(() => {
    if (licenses.length > 0) {
      console.log("licenses[0]"+licenses[0].license)
      form.reset({
        license: '미용사(일반)', // 첫 번째 license로 기본값 설정
      })
    }
  }, [licenses, form]) // licenses가 변경될 때마다 실행



  // Form 제출 처리
  const onSubmit = () => {
    const selectedLicense = form.watch("license"); // form에서 선택된 license 값 가져오기
    const selectedMadeAt = form.watch("madeAt"); // form에서 선택된 madeAt 값 가져오기

    const selectedLicenseId = licenses.find((license) => license.license === selectedLicense)?.id;

    if (!selectedLicenseId || !selectedMadeAt) {
      console.error("License or madeAt not selected");
      return;
    }

    // /test로 이동하면서 license_id와 made_at을 쿼리 파라미터로 전달
    navigate(`/test?license_id=${selectedLicenseId}&made_at=${selectedMadeAt}`);
  };

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
                            (licenses) => licenses.license === field.value
                          )?.license
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
                            value={license.license}
                            key={license.id}
                            onSelect={() => {
                              form.setValue("license", license.license)
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
