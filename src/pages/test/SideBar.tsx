// Sidebar 컴포넌트 - 답안 표기란
export default function Sidebar({ answers }) {
  return (
    <div className="p-4 bg-white shadow-lg">
      <h2 className="text-xl font-bold mb-4">답안 표기란</h2>
      <ul>
        {answers.map((question, index) => (
          <li key={index} className="mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold">{index + 1}.</span>
              <div className="flex space-x-2">
                {[1, 2, 3, 4].map((option) => (
                  <button
                    key={option}
                    className={`w-8 h-8 rounded-full border border-gray-400 ${question.selected === option ? 'bg-blue-500 text-white' : ''}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* 추가적으로 아래에 답안 제출 버튼도 포함 가능 */}
      <button style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}>
        답안 제출
      </button>
    </div>
  );
}