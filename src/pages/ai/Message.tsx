// src/components/Message.tsx
import React, { Fragment } from "react";
import { MessageDto } from "./MessageDto";

interface MessageProps {
  message: MessageDto;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} my-2`}>
      <div
        className={`max-w-[75%] p-3 rounded-lg text-base leading-relaxed whitespace-pre-wrap ${
          message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
        }`}
      >
        {message.content.split("\n").map((text, index) => (
          <Fragment key={index}>
            {text}
            <br />
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default Message;
