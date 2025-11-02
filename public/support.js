
  function sendMessage() {
    const input = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");
    const userMessage = input.value.trim();
    if (userMessage === "") return;

    // 사용자 메시지 출력
    const userDiv = document.createElement("div");
    userDiv.className = "chat-message user";
    userDiv.textContent = userMessage;
    chatBox.appendChild(userDiv);

    // 간단한 응답 로직 (예시)
    const botDiv = document.createElement("div");
    botDiv.className = "chat-message bot";
    if (userMessage.includes("시험")) {
      botDiv.textContent = "AWS 시험은 상단 메뉴의 '시험예약'을 통해 예약하실 수 있어요.";
    } else if (userMessage.includes("할인")) {
      botDiv.textContent = "'할인' 페이지에서 현재 제공 중인 쿠폰을 확인하실 수 있습니다.";
    } else if (userMessage.includes("저장")) {
      botDiv.textContent = "로그인 후 문제풀이를 하시면 자동으로 저장됩니다.";
    } else {
      botDiv.textContent = "죄송해요, 아직 그 질문에 대한 답변을 준비 중이에요. 이메일 support@awsquiz.com 으로 문의해주세요.";
    }
    chatBox.appendChild(botDiv);

    // 입력창 초기화
    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
  }


  async function sendMessage() {
    const input = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");
    const userMessage = input.value.trim();
    if (userMessage === "") return;

    // 사용자 메시지 출력
    const userDiv = document.createElement("div");
    userDiv.className = "chat-message user";
    userDiv.textContent = userMessage;
    chatBox.appendChild(userDiv);

    // LM Studio API 호출
    const response = await fetch("http://localhost:1234/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-llm-7b-chat", // LM Studio에서 선택한 모델 이름
        messages: [
          { role: "system", content: "너는 AWS 고객센터 챗봇이야." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    const botReply = data.choices[0].message.content;

    // 챗봇 응답 출력
    const botDiv = document.createElement("div");
    botDiv.className = "chat-message bot";
    botDiv.textContent = botReply;
    chatBox.appendChild(botDiv);

    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
  }



