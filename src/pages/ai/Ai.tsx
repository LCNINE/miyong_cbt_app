import React, { useState } from 'react';
import axios, { AxiosResponse } from 'axios';

// OpenAI API 응답 타입 정의
interface OpenAIChatResponse {
  choices: { message: { role: string; content: string } }[];
}

export default function Ai() {
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const askGPT = async () => {
    setLoading(true);
    try {
      // AxiosResponse<OpenAIChatResponse>로 응답 타입을 정의
      const res: AxiosResponse<OpenAIChatResponse> = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [{ role: 'user', content: userInput }], // chat 모델에서는 'messages' 필드를 사용
          max_tokens: 2000,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`, // 환경 변수에서 API 키 불러오기
          }
        }
      );
      // 응답 타입이 OpenAIChatResponse이므로 res.data.choices[0].message.content에 접근 가능
      setResponse(res.data.choices[0].message.content);
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      setResponse('Error: Unable to get a response from GPT.');
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>Ask GPT</h1>
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Ask a question..."
      />
      <button onClick={askGPT} disabled={loading}>
        {loading ? 'Loading...' : 'Send'}
      </button>

      <div className="response">
        <h3>Response:</h3>
        <pre>{response}</pre>
      </div>
    </div>
  );
}
