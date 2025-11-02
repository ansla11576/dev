// support.js
async function sendMessage(message = null) {
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  const userMessage = message || input.value.trim();
  if (userMessage === "") return;

  // 사용자 메시지 출력
  const userDiv = document.createElement("div");
  userDiv.className = "chat-message user";
  userDiv.textContent = userMessage;
  chatBox.appendChild(userDiv);

  // LM Studio API 호출
  try {
    const response = await fetch("http://localhost:1234/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-llm-7b-chat:2", // LM Studio에서 선택한 모델 이름
        messages: [
          {
            role: "system",
            content: "너는 AWS 문제풀이 플랫폼의 고객센터 챗봇이야. 네이버 톡톡처럼 친절하고 간결하게 응답해줘."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();
    const botReply = data.choices[0].message.content;

    const botDiv = document.createElement("div");
    botDiv.className = "chat-message bot";
    botDiv.textContent = botReply;
    chatBox.appendChild(botDiv);
  } catch (error) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "chat-message bot";
    errorDiv.textContent = "죄송합니다. 서버와 연결할 수 없습니다.";
    chatBox.appendChild(errorDiv);
    console.error("LM Studio 연결 오류:", error);
  }

  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
}

function presetQuestion(text) {
  sendMessage(text);
}
