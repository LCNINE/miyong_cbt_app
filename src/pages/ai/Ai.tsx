import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import OpenAI from "openai";
import SendIcon from "@mui/icons-material/Send";
import Message from "./Message";
import { MessageDto } from "./MessageDto";
import TypingIndicator from "./TypingIndicator";
import { Button } from "@/components/ui/button";

const Ai: React.FC = () => {
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<MessageDto>>(
    new Array<MessageDto>()
  );
  const [input, setInput] = useState<string>("");
  const [assistant, setAssistant] = useState<any>(null);
  const [thread, setThread] = useState<any>(null);
  const [openai, setOpenai] = useState<any>(null);

  useEffect(() => {
    initChatBot();
  }, []);

  useEffect(() => {
    setMessages([
      {
        content: "안녕하세요. 어떻게도와드릴까요?",
        isUser: false,
      },
    ]);
  }, [assistant]);

  const initChatBot = async () => {
    const openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    // Create an assistant
    const assistantId = import.meta.env.VITE_ASSISTANT_ID; // 기존 assistant ID 입력
    const assistant = await openai.beta.assistants.retrieve(assistantId);

    // Create a thread
    const thread = await openai.beta.threads.create();

    setOpenai(openai);
    setAssistant(assistant);
    setThread(thread);
  };

  const createNewMessage = (content: string, isUser: boolean) => {
    const newMessage = new MessageDto(isUser, content);
    return newMessage;
  };

  const handleSendMessage = async () => {
    messages.push(createNewMessage(input, true));
    setMessages([...messages]);
    setInput("");

    // Send a message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: input,
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });

    // Create a response
    let response = await openai.beta.threads.runs.retrieve(thread.id, run.id);

    // Wait for the response to be ready
    while (response.status === "in_progress" || response.status === "queued") {
      console.log("waiting...");
      setIsWaiting(true);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      response = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    setIsWaiting(false);

    // Get the messages for the thread
    const messageList = await openai.beta.threads.messages.list(thread.id);

    // Find the last message for the current run
    const lastMessage = messageList.data
      .filter(
        (message: any) =>
          message.run_id === run.id && message.role === "assistant"
      )
      .pop();

    // Print the last message coming from the assistant
    if (lastMessage) {
      setMessages([
        ...messages,
        createNewMessage(lastMessage.content[0]["text"].value, false),
      ]);
    }
  };

  // detect enter key and send message
  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4">
        {messages.map((message, index) => (
          <div key={index}>
            <Message key={index} message={message} />
          </div>
        ))}
        {isWaiting && (
          <div>
            <TypingIndicator />
          </div>
        )}
      </div>

      <div className="flex items-center p-4 border-t">
        <input
          type="text"
          className="flex-1 border rounded-lg p-2 mr-2"
          disabled={isWaiting}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <Button
          color="primary"
          onClick={handleSendMessage}
          disabled={isWaiting}
        >
          {isWaiting ? (
            <CircularProgress color="inherit" />
          ) : (
            <SendIcon fontSize="large" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default Ai;
