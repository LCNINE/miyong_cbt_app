import { supabase } from "@/lib/supabaseClient";

export async function fetchIncorrectAnswers(userId: string | null) {
  if (userId) {
    const { data, error } = await supabase
      .from("wrong_logs")
      .select("question_id, chose_answer")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching incorrect answers:", error);
      return [];
    }else{
      // 데이터를 변환하여 chose_answer를 selectedOption으로 변경
      return data.map((item: { question_id: number; chose_answer: number | null }) => ({
        questionId: item.question_id,
        selectedOption: item.chose_answer,
      }));
    }
  }
}

export async function fetchQuestionsAndOptions(questionIds: number[]) {
  const { data: questions, error: questionError } = await supabase
    .from("questions")
    .select("*")
    .in("id", questionIds);

  if (questionError) {
    console.error("Error fetching questions:", questionError);
    throw new Error("Failed to fetch questions");
  }

  const { data: examples, error: exampleError } = await supabase
    .from("examples")
    .select("*")
    .in("question_id", questionIds);

  if (exampleError) {
    console.error("Error fetching examples:", exampleError);
    throw new Error("Failed to fetch examples");
  }

  const { data: options, error: optionError } = await supabase
    .from("question_options")
    .select("*")
    .in("question_id", questionIds)
    .order("no", { ascending: true });

  if (optionError) {
    console.error("Error fetching options:", optionError);
    throw new Error("Failed to fetch options");
  }

  return { questions, examples, options };
}