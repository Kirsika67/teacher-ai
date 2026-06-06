import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const SALT_ROUNDS = 10;

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

router.post("/register", (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Nimi on kohustuslik." });
  }
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({
      error: "Kehtiv e-posti aadress on kohustuslik.",
    });
  }
  if (!password || typeof password !== "string" || password.length < 8) {
    return res
      .status(400)
      .json({ error: "Parool peab olema vähemalt 8 tähemärki." });
  }

  const existing = db
    .prepare("SELECT id FROM teachers WHERE email = ? COLLATE NOCASE")
    .get(email.trim().toLowerCase());

  if (existing) {
    return res.status(409).json({
      error: "See e-posti aadress on juba registreeritud.",
    });
  }

  const password_hash = bcrypt.hashSync(password, SALT_ROUNDS);
  const info = db
    .prepare(
      `INSERT INTO teachers (email, password_hash, name)
       VALUES (?, ?, ?)`
    )
    .run(email.trim().toLowerCase(), password_hash, name.trim());

  const teacher = db
    .prepare(
      "SELECT id, email, name, created_at FROM teachers WHERE id = ?"
    )
    .get(info.lastInsertRowid);

  const token = signToken(teacher.id);
  res.status(201).json({ teacher, token });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      error: "E-posti aadress ja parool on kohustuslikud.",
    });
  }

  const teacher = db
    .prepare(
      "SELECT id, email, password_hash, name, created_at FROM teachers WHERE email = ? COLLATE NOCASE"
    )
    .get(String(email).trim().toLowerCase());

  if (!teacher || !bcrypt.compareSync(password, teacher.password_hash)) {
    return res.status(401).json({ error: "Vale e-post või parool." });
  }

  delete teacher.password_hash;
  const token = signToken(teacher.id);
  res.json({ teacher, token });
});

router.get("/me", requireAuth, (req, res) => {
  const teacher = db
    .prepare(
      "SELECT id, email, name, created_at FROM teachers WHERE id = ?"
    )
    .get(req.teacherId);

  if (!teacher) {
    return res.status(404).json({ error: "Kasutajat ei leitud." });
  }
  res.json({ teacher });
});

function signToken(teacherId) {
  const secret = process.env.JWT_SECRET || "arendus-vale-võti";
  return jwt.sign({ sub: teacherId }, secret, { expiresIn: "7d" });
}

export default router;
