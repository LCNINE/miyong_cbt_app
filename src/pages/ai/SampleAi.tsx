import React, { useState, useEffect, useRef } from "react";
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Message from "./Message"; // 실제 메시지 컴포넌트를 사용한다고 가정
import { Helmet } from "react-helmet-async";

const SampleAi: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ content: string; isUser: boolean }>>([
    { content: "안녕하세요. 미용필기시험 AI 체험 페이지입니다! 무엇을 도와드릴까요?", isUser: false },
  ]);
  const [input, setInput] = useState<string>("");

  const predefinedQuestions = [
    "미용필기시험은 뭐에요?",
    "AI 피드백은 어떻게 동작하나요?",
    "사용법을 알려주세요",
  ];

  const predefinedResponses: { [key: string]: string } = {
    "미용필기시험은 뭐에요?": "미용필기시험은 미용사 자격증을 취득하기 위한 필기시험입니다. 더 많은 정보를 원하시면 로그인해주세요!",
    "AI 피드백은 어떻게 동작하나요?": "AI 피드백은 사용자가 입력한 답변에 대해 즉각적으로 피드백을 제공하는 기능입니다. 전체 기능을 보려면 로그인이 필요합니다!",
    "사용법을 알려주세요": "미용필기시험 사이트에서 AI 피드백을 받으려면 먼저 로그인해주세요! 다양한 문제와 피드백을 통해 학습을 도와드립니다.",
  };

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = (selectedQuestion?: string) => {
    const messageContent = selectedQuestion || input;
    if (messageContent.trim() === "") return;

    // 사용자가 입력한 메시지 추가
    setMessages([...messages, { content: messageContent, isUser: true }]);

    // 미리 정의된 응답을 찾아서 추가
    const response =
      predefinedResponses[messageContent] || "전체 기능을 이용하려면 로그인해주세요!";
    setMessages((prev) => [...prev, { content: response, isUser: false }]);

    setInput(""); // 입력 초기화
  };

  const handleQuestionClick = (question: string) => {
    // 사용자가 미리 정의된 질문을 클릭하면 해당 질문을 전송
    handleSendMessage(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom(); // 메시지가 업데이트될 때마다 최하단으로 스크롤
  }, [messages]);

  return (
    <>
      <Helmet>
        <title>미용필기시험 AI 체험 페이지</title>
        <meta name="description" content="미용필기시험 AI 체험 페이지" />
      </Helmet>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto p-4">
          {messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}
          {/* 메시지 끝에 있는 div, 스크롤이 이 위치로 이동하게 함 */}
          <div ref={messageEndRef} />
        </div>

        {/* 미리 정의된 질문 목록 */}
        <div className="p-4 border-t">
          <p>질문을 선택해보세요:</p>
          <div className="flex space-x-2">
            {predefinedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outlined"
                onClick={() => handleQuestionClick(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>

        {/* 사용자 입력 */}
        <div className="flex items-center p-4 border-t">
          <input
            type="text"
            className="flex-1 border rounded-lg p-2 mr-2"
            placeholder="질문을 입력하세요..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Button onClick={() => handleSendMessage()} endIcon={<SendIcon />}>
            보내기
          </Button>
        </div>
      </div>
    </>
  );
};

export default SampleAi;
