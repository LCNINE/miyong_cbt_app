import React, { useState, useEffect } from "react";
import { ExamSchedule } from "./types";
import { supabase } from "@/lib/supabaseClient";
import { format } from "date-fns";

const Calendar1: React.FC = () => {
  const [schedules, setSchedules] = useState<ExamSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"필기" | "실기">("필기");

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const { data, error } = await supabase
          .from("exam_schedules")
          .select("*")
          .order("exam_type", { ascending: true })
          .order("exam_round", { ascending: true })
          .order("application_starts_at", { ascending: true });

        if (error) throw error;
        setSchedules(data as ExamSchedule[]);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, []);

  const formatRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // MM.DD 형식으로 포맷팅
    const formatToMMDD = (date: Date) => format(date, "M.d");

    return `${formatToMMDD(start)}~${formatToMMDD(end)}`;
  };

  const renderTable = (filterType: string) => {
    const filteredSchedules = schedules.filter(
      (schedule) => schedule.exam_type === filterType
    );

    return (
      <table className="table-auto w-full text-center border-collapse border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-2 py-1 border border-gray-300">회차</th>
            <th className="px-2 py-1 border border-gray-300">원서접수</th>
            <th className="px-2 py-1 border border-gray-300">시험</th>
            <th className="px-2 py-1 border border-gray-300">합격자 발표일</th>
          </tr>
        </thead>
        <tbody>
          {filteredSchedules.length > 0 ? (
            filteredSchedules.map((schedule) => (
              <tr key={schedule.id} className="even:bg-gray-50">
                <td className="px-2 py-1 border border-gray-300">
                  {schedule.exam_round}
                </td>
                <td className="px-2 py-1 border border-gray-300">
                  {formatRange(
                    schedule.application_starts_at,
                    schedule.application_ends_at
                  )}
                </td>
                <td className="px-2 py-1 border border-gray-300">
                  {formatRange(schedule.starts_at, schedule.ends_at)}
                </td>
                <td className="px-2 py-1 border border-gray-300">
                  {schedule.success_announ_at || "미정"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="px-2 py-1 border border-gray-300 text-gray-500"
              >
                {`${filterType} 데이터가 없습니다.`}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  const renderExamInfo = () => (
    <div className="bg-white rounded-lg shadow-md p-6 my-6">
      <table className="table-auto w-full text-left border-collapse">
        <tbody>
          <tr className="border-b">
            <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-100">
              검정방법
            </td>
            <td className="px-4 py-3">
              <span className="block">
                <strong className="text-gray-700">필기</strong>: 객관식 4지 택일형
                (60문제)
              </span>
              <span className="block">
                <strong className="text-gray-700">실기</strong>: 작업형 (약 2시간
                30분)
              </span>
            </td>
          </tr>
          <tr className="border-b">
            <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-100">
              시험 수수료
            </td>
            <td className="px-4 py-3">
              <span className="block">
                <strong className="text-gray-700">일반</strong>: 필기 14,500원, 실기
                24,900원
              </span>
              <span className="block">
                <strong className="text-gray-700">피부</strong>: 필기 14,500원, 실기
                27,300원
              </span>
              <span className="block">
                <strong className="text-gray-700">메이크업, 네일</strong>: 필기
                14,500원, 실기 17,200원
              </span>
            </td>
          </tr>
          <tr className="border-b">
            <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-100">
              수수료 환불규정
            </td>
            <td className="px-4 py-3">
              <a
                href="https://www.q-net.or.kr/crf022.do?id=crf02201&gSite=Q&gId="
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-bold underline hover:text-blue-800"
              >
                환불규정 바로가기
              </a>
            </td>
          </tr>
          <tr className="border-b">
            <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-100">
              시행처 / 문의
            </td>
            <td className="px-4 py-3">
              한국산업인력공단 / 고객센터 1644-8000
            </td>
          </tr>
          <tr className="border-b">
            <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-100">
              원서접수
            </td>
            <td className="px-4 py-3">
              <a
                href="https://www.q-net.or.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-bold underline hover:text-blue-800"
              >
                www.q-net.or.kr/
              </a>
            </td>
          </tr>
          <tr>
            <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-100">
              응시자격
            </td>
            <td className="px-4 py-3">제한없음</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
  


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-sm text-blue-600">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-center text-gray-700 mb-4">
        2025 미용자격증 시험정보
      </h1>
      {renderExamInfo()}
      <div className="flex justify-center mb-4">
        <button
          className={`px-4 py-1 rounded-t-lg font-semibold ${
            activeTab === "필기"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("필기")}
        >
          필기시험
        </button>
        <button
          className={`px-4 py-1 rounded-t-lg font-semibold ${
            activeTab === "실기"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("실기")}
        >
          실기시험
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md p-2">
        {activeTab === "필기" && renderTable("필기")}
        {activeTab === "실기" && renderTable("실기")}
      </div>
    </div>
  );
};

export default Calendar1;
