import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { PostList } from "./PostList";
import TestHeader from "./TestHeader";
import { Progress } from "@/components/ui/progress";
import {
  Example,
  Option,
  Question,
  QuestionWithExamplesAndOptions,
} from "@/type/testType";
import { supabase } from "@/lib/supabaseClient.ts";
import { Helmet } from "react-helmet-async";

export default function Test() {
  const { test_id } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 1;

  const [questionData, setQuestionData] = useState<
    QuestionWithExamplesAndOptions[]
  >([]);
  const [licenseName, setLicenseName] = useState<string | null>(null);
  const [licenseId, setLicenseId] = useState<number | null>(null);
  const [madeAt, setMadeAt] = useState<string | null>(null);
  const [episode, setEpisode] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: number | null;
  }>({});
  const [instantFeedback, setInstantFeedback] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (test_id) {
        const { data: questions, error: questionError } = await supabase
          .from("questions")
          .select(
            `
            *,
            tests (
              episode
            )
          `
          )
          .eq("test_id", test_id)
          .order("no", { ascending: true });

        if (questionError) {
          console.error("Error fetching questions:", questionError);
          return;
        }

        const questionIds = questions.map((question: Question) => question.id);

        const { data: examples, error: exampleError } = await supabase
          .from("examples")
          .select("*")
          .in("question_id", questionIds);

        if (exampleError) {
          console.error("Error fetching examples:", exampleError);
          return;
        }

        const { data: options, error: optionError } = await supabase
          .from("question_options")
          .select("*")
          .in("question_id", questionIds)
          .order("no", { ascending: true });

        if (optionError) {
          console.error("Error fetching options:", optionError);
          return;
        }

        const combinedData: QuestionWithExamplesAndOptions[] = questions.map(
          (question: Question) => {
            const questionExamples = examples.filter(
              (example: Example) => example.question_id === question.id
            );
            const questionOptions = options.filter(
              (option: Option) => option.question_id === question.id
            );

            return {
              ...question,
              examples: questionExamples,
              options: questionOptions,
            };
          }
        );

        setQuestionData(combinedData);

        if (questions) {
          setLicenseId(questions[0].license);
          setMadeAt(questions[0].made_at);
          if (questions[0].tests) setEpisode(questions[0].tests.episode);
        }
      }
    };

    fetchQuestions();
  }, [test_id]);

  useEffect(() => {
    const fetchLicense = async () => {
      if (licenseId) {
        const { data: license, error } = await supabase
          .from("licenses")
          .select("license")
          .eq("id", licenseId)
          .single();

        if (error) {
          console.error("Error fetching license:", error);
          return;
        }

        if (license) {
          setLicenseName(license.license);
        }
      }
    };

    fetchLicense();
  }, [licenseId]);

  const firstPostIndex = (currentPage - 1) * postsPerPage;
  const lastPostIndex = firstPostIndex + postsPerPage;
  const currentQuestion = questionData.slice(firstPostIndex, lastPostIndex);

  const handleOptionSelect = (questionId: number, optionNo: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionNo,
    }));
  };

  const handleSubmit = () => {
    const answers = questionData.map((question) => ({
      questionId: question.id,
      optionNo: selectedAnswers[question.id] || null,
    }));

    navigate("/result", {
      state: {
        licenseName: licenseName,
        made_at: madeAt,
        episode: episode,
        answers: answers,
      },
    });
  };

  const totalQuestions = questionData.length;
  const progressValue =
    totalQuestions > 0 ? (currentPage / totalQuestions) * 100 : 0;

  return (
    <div className="flex flex-col h-full bg-white">
      <Helmet>
        <title>미용필시시험/test - 미용필기시험 모의고사</title>
        <meta name="description" content="미용필기시험 모의고사" />
        <meta name="google-site-verification" content="LK2lMpCXPbmg_peIKBrco_0Rp_scYKp4Mn0u5yI6vCI" />
        <meta name="naver-site-verification" content="dd4919f9da4dfbafdd79f35ed97505cf41418c50" />
      </Helmet>

      <TestHeader confirmExit />

      <div className="px-4 pt-5 pb-2 shrink-0">
        <div className="flex items-center justify-end mb-2">
          <label className="inline-flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={instantFeedback}
              onChange={(e) => setInstantFeedback(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 accent-slate-900"
            />
            바로 채점
          </label>
        </div>
        <div className="text-center">
          <span className="text-5xl font-bold text-slate-900 tracking-tight">
            {String(currentPage).padStart(2, "0")}
          </span>
          <span className="text-2xl text-slate-400 ml-2">
            / {totalQuestions || "—"}
          </span>
        </div>
        {licenseName && (
          <div className="text-center text-xs text-slate-500 mt-1">
            {licenseName} · {episode}회 ({madeAt})
          </div>
        )}
      </div>

      <main className="flex-1 px-4 pt-4 pb-4 overflow-y-auto">
        <PostList
          list={currentQuestion}
          onSelectOption={handleOptionSelect}
          selectedAnswers={selectedAnswers}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalQuestions={totalQuestions}
          onSubmit={handleSubmit}
          instantFeedback={instantFeedback}
        />
      </main>

      <footer className="flex-grow-0 px-4 pb-5 pt-2 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="flex items-center gap-1 text-sm text-slate-600 disabled:text-slate-300 disabled:cursor-not-allowed hover:text-slate-900"
            aria-label="이전 문제"
          >
            <ChevronLeft size={16} />
            이전 문제
          </button>
          <span className="text-xs text-slate-400">
            {currentPage} / {totalQuestions || "—"}
          </span>
        </div>
        <Progress value={progressValue} className="h-1.5" />
      </footer>
    </div>
  );
}
