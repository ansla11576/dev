// login_server.js

const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = 3000;

// GitHub Actions 환경에서만 AWS SDK 활성화
let dynamoDB;
if (process.env.GITHUB_ACTIONS === 'true') {
  AWS.config.update({
    region: 'ap-northeast-2' // 서울 리전
  });
  dynamoDB = new AWS.DynamoDB.DocumentClient();
} else {
  console.warn('⚠️ 로컬 환경에서는 DynamoDB가 비활성화됩니다.');
}

const TABLE_NAME = 'Users';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/signup', async (req, res) => {
  console.log('회원가입 요청 수신:', req.body);
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send('회원가입 실패: 필수 정보 누락');
  }

  if (!dynamoDB) {
    return res.status(503).send('회원가입 실패: 서버가 AWS에 연결되어 있지 않습니다');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const params = {
      TableName: TABLE_NAME,
      Item: {
        userId: uuidv4(),
        name,
        email,
        password: hashedPassword
      }
    };
    await dynamoDB.put(params).promise();
    res.status(200).send('회원가입 성공');
  } catch (err) {
    console.error('DynamoDB 저장 오류:', err);
    res.status(500).send('회원가입 실패: 서버 오류');
  }
});

app.post('/login', async (req, res) => {
  console.log('로그인 요청 수신:', req.body);
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).send('로그인 실패: 필수 정보 누락');
  }

  if (!dynamoDB) {
    return res.status(503).send('로그인 실패: 서버가 AWS에 연결되어 있지 않습니다');
  }

  const params = {
    TableName: TABLE_NAME,
    FilterExpression: '#name = :name',
    ExpressionAttributeNames: { '#name': 'name' },
    ExpressionAttributeValues: { ':name': name }
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    if (data.Items.length === 0) {
      return res.status(404).send('로그인 실패: 사용자 없음');
    }

    const user = data.Items[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send('로그인 실패: 비밀번호 불일치');
    }

    res.status(200).send('로그인 성공');
  } catch (err) {
    console.error('로그인 오류:', err);
    res.status(500).send('로그인 실패: 서버 오류');
  }
});

app.listen(PORT, () => {
  console.log('서버 시작 준비 중');
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
