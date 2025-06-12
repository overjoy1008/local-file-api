require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;
const BASE_DIR = path.resolve(process.env.BASE_DIR); // 절대경로로 고정

// API 키 미들웨어
function authMiddleware(req, res, next) {
  const key = req.headers["x-api-key"];
  if (key !== API_KEY) {
    return res.status(403).json({ message: "Forbidden: Invalid API key" });
  }
  next();
}

// 경로 보호 함수: BASE_DIR 외부 접근 차단
function getSafePath(filename) {
  const safePath = path.resolve(BASE_DIR, filename);
  if (!safePath.startsWith(BASE_DIR)) {
    throw new Error("Access outside of BASE_DIR is forbidden");
  }
  return safePath;
}

// multer 저장소 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, BASE_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// 파일 목록 조회
app.get("/files", authMiddleware, (req, res) => {
  try {
    const files = fs.readdirSync(BASE_DIR);
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: "Failed to read directory", details: err.message });
  }
});

// 파일 다운로드
app.get("/download/:filename", authMiddleware, (req, res) => {
  try {
    const filePath = getSafePath(req.params.filename);
    if (fs.existsSync(filePath)) {
      res.download(filePath);
    } else {
      res.status(404).json({ error: "File not found" });
    }
  } catch (err) {
    res.status(400).json({ error: "Invalid file path", details: err.message });
  }
});

// 파일 업로드
app.post("/upload", authMiddleware, upload.single("file"), (req, res) => {
  try {
    res.json({ message: "File uploaded", file: req.file.originalname });
  } catch (err) {
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

// 파일 삭제
app.delete("/delete/:filename", authMiddleware, (req, res) => {
  try {
    const filePath = getSafePath(req.params.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: "Deleted" });
    } else {
      res.status(404).json({ error: "File not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Delete failed", details: err.message });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Secure File API running at http://localhost:${PORT}`);
});
