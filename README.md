# 🧩 Local File API with Ngrok Access

이 프로젝트는 **Windows PC의 로컬 디렉토리**를 외부에서 API로 접근 가능하게 만들어주는 파일 서버입니다.  
파일 업로드, 다운로드, 삭제, 목록 조회가 가능하며 `API_KEY` 인증으로 보호됩니다.

---

## ✅ 기능 요약

| 기능 | 경로 | 설명 |
|------|------|------|
| 파일 목록 | `/files` | 디렉토리 내 파일 목록 반환 |
| 파일 업로드 | `/upload` | 파일 업로드 (`form-data` 전송) |
| 파일 다운로드 | `/download/:filename` | 파일 다운로드 |
| 파일 삭제 | `/delete/:filename` | 파일 삭제 |

---

## 🛠️ 1. 설치

```bash
git clone <repo-url>
cd local-file-api
npm install
```

---

## ⚙️ 2. `.env` 설정

루트에 `.env` 파일을 만들고 다음을 입력하세요:

```
API_KEY=your-api-key-here
BASE_DIR=D:/Path/To/Your/Directory
```

- `API_KEY`: API 호출 시 필요한 인증 키
- `BASE_DIR`: 읽기/쓰기할 실제 로컬 디렉토리 (절대경로, 반드시 '\'가 아닌 '/'를 사용)
    - BASE_DIR의 부모 디렉토리는 보안을 위해 접근이 불가

---

## 🚀 3. 서버 실행

```bash
node index.js
```

출력:

```
Secure File API running at http://localhost:4000
```

---

## 🌐 4. Ngrok으로 외부 노출

### 4-1. Ngrok 설치

```bash
choco install ngrok
```

또는 직접 다운로드: https://ngrok.com/download

---

### 4-2. Ngrok Auth Token 등록

https://dashboard.ngrok.com/get-started/your-authtoken 에서 토큰 확인 후:

```bash
ngrok config add-authtoken <당신의_토큰>
```

---

### 4-3. 포트 노출

```bash
ngrok http 4000
```

출력:

```
Forwarding https://아주-긴-숫자.ngrok-free.app -> http://localhost:4000
```

---

## 🧪 5. 테스트 (curl.exe)

> API 호출 시 반드시 `x-api-key` 헤더 포함

### 파일 목록 조회

```bash
curl.exe -H "x-api-key: parkfamdesktop5320" https://아주-긴-숫자.ngrok-free.app/files
```

### 파일 업로드

```bash
curl.exe -H "x-api-key: parkfamdesktop5320" -F "file=@test.txt" https://아주-긴-숫자.ngrok-free.app/upload
```

### 파일 다운로드

```bash
curl.exe -H "x-api-key: parkfamdesktop5320" https://아주-긴-숫자.ngrok-free.app/download/test.txt -o downloaded.txt
```

### 파일 삭제

```bash
curl.exe -X DELETE -H "x-api-key: parkfamdesktop5320" https://아주-긴-숫자.ngrok-free.app/delete/test.txt
```

---

## 🔒 보안 주의

- `.env` 파일은 절대 커밋하지 마세요!
- API Key는 외부 노출되지 않게 주의하세요.
- Ngrok 주소는 재실행 시 변경되며, 고정 주소는 유료 플랜에서 사용 가능합니다.

---

## 📂 디렉토리 구조

```
local-file-api/
├── index.js
├── .env
├── .gitignore
├── README.md
└── uploads/           # 업로드된 파일 저장 위치 (BASE_DIR, 선택사항)
```
