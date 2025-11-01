// aws_saa_questions.js
// JSON 파일 불러오기
  // fetch("aws_saa_questions.json")
  //   .then(res => res.json())
  //   .then(data => {
  //     const container = document.getElementById("questions");
  //     container.innerHTML = "";

  //     data.forEach(item => {
  //       const div = document.createElement("div");
  //       div.className = "question";

  //       const title = document.createElement("h2");
  //       title.textContent = `문제 ${item.문제번호}`;
  //       div.appendChild(title);

  //       const question = document.createElement("p");
  //       question.textContent = item.질문;
  //       div.appendChild(question);

  //       // 보기 목록
  //       for (const [key, value] of Object.entries(item.보기)) {
  //         const choice = document.createElement("div");
  //         choice.className = "choice";
  //         choice.textContent = `${key}. ${value}`;
  //         div.appendChild(choice);
  //       }

  //       const answer = document.createElement("div");
  //       answer.className = "answer";
  //       answer.textContent = `정답: ${item.정답}`;
  //       div.appendChild(answer);

  //       container.appendChild(div);
  //     });
  //   })
  //   .catch(err => {
  //     document.getElementById("questions").textContent = "❌ 문제 데이터를 불러올 수 없습니다.";
  //     console.error(err);
  //   });


  // aws_saa_questions.js — AWS SAA 문제 JSON을 불러와 HTML에 표시하는 스크립트

fetch("aws_saa_questions.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("questions");
    container.innerHTML = "";

    data.forEach(item => {
      const div = document.createElement("div");
      div.className = "question";

      // 문제 제목
      const title = document.createElement("h2");
      title.textContent = `문제 ${item.문제번호}`;
      div.appendChild(title);

      // 질문 본문 (줄바꿈 처리)
      const question = document.createElement("p");
      question.innerHTML = item.질문.replace(/\n/g, "<br>");
      div.appendChild(question);

      // 보기 목록 (줄바꿈 처리)
      const choices = document.createElement("div");
      choices.className = "choices";
      for (const [key, value] of Object.entries(item.보기)) {
        const choice = document.createElement("div");
        choice.className = "choice";
        choice.innerHTML = `<strong>${key}.</strong> ${value.replace(/\n/g, "<br>")}`;
        choices.appendChild(choice);
      }
      div.appendChild(choices);

      // 정답 표시
      const answer = document.createElement("div");
      answer.className = "answer";
      answer.innerHTML = `<em>정답: ${item.정답}</em>`;
      div.appendChild(answer);

      container.appendChild(div);
    });
  })
  .catch(err => {
    document.getElementById("questions").textContent = "❌ 문제 데이터를 불러올 수 없습니다.";
    console.error("문제 로딩 오류:", err);
  });
