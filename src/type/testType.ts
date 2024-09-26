// License 타입 정의
export interface License {
  id: number,
  license: string
}

// MadeAt 타입 정의
export interface MadeAt {
  label: string,
  value: string
}

export interface Question {
  id: number;
  no: number;
  content: string;
  made_at: string | null;
}

export interface Example {
  id: number;
  question_id: number;
  content: string;
  type: string; // type이 'text' 또는 'image'일 수 있음
}

export interface Option {
  is_correct: boolean;
  question_id: number;
  no: number;
  content: string;
  type: string; // type이 'text' 또는 'image'일 수 있음
}

export interface QuestionWithExamplesAndOptions {
  id: number;
  no: number;
  content: string;
  made_at: string | null;
  examples: Example[];
  options: Option[];
}

export interface incorrectAnswer {
  questionId: number;
  selectedOption: number;
}