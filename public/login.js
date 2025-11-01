// login.js
function showSignup() {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('signup-form').style.display = 'block';
}

function showLogin() {
  document.getElementById('signup-form').style.display = 'none';
  document.getElementById('login-form').style.display = 'block';
}

async function signup(e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!name || !email || !password) {
    alert('모든 필드를 입력해주세요.');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const result = await res.text();
    alert(result);
    showLogin();
  } catch (err) {
    console.error('회원가입 오류:', err);
    alert('회원가입 실패: 서버 오류');
  }
}

async function login(e) {
  e.preventDefault();

  const name = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  if (!name || !password) {
    alert('아이디와 비밀번호를 입력해주세요.');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password })
    });

    const result = await res.text();
    alert(result);

    if (res.ok && result === '로그인 성공') {
      window.location.href = '/index.html';
    }
  } catch (err) {
    console.error('로그인 오류:', err);
    alert('로그인 실패: 서버 오류');
  }
}
