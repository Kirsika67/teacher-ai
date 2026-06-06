import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router({ mergeParams: true });

router.use(requireAuth);

router.get("/", (req, res) => {
  const rows = db
    .prepare(
      `SELECT c.id, c.name, c.subject, c.created_at,
        (SELECT COUNT(*) FROM students s WHERE s.class_id = c.id) AS student_count
       FROM classes c
       WHERE c.teacher_id = ?
       ORDER BY c.name COLLATE NOCASE`
    )
    .all(req.teacherId);

  res.json({ classes: rows });
});

router.post("/", (req, res) => {
  const { name, subject } = req.body || {};

  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Klassi nimi on kohustuslik." });
  }
  if (!subject || typeof subject !== "string" || !subject.trim()) {
    return res.status(400).json({ error: "Õppeaine on kohustuslik." });
  }

  const info = db
    .prepare(
      `INSERT INTO classes (teacher_id, name, subject) VALUES (?, ?, ?)`
    )
    .run(req.teacherId, name.trim(), subject.trim());

  const row = db
    .prepare(
      `SELECT id, name, subject, created_at FROM classes WHERE id = ?`
    )
    .get(info.lastInsertRowid);

  res.status(201).json({ class: row });
});

router.get("/:classId/topics", (req, res) => {
  const classId = Number(req.params.classId);
  if (!Number.isInteger(classId)) {
    return res.status(400).json({ error: "Kehtetu klassi ID." });
  }

  const own = db
    .prepare(`SELECT id FROM classes WHERE id = ? AND teacher_id = ?`)
    .get(classId, req.teacherId);
  if (!own) {
    return res.status(404).json({
      error:
        "Klassi ei leitud või sul ei ole sellele juurdepääsu. Vali oma klass või logi uuesti sisse.",
    });
  }

  const topics = db
    .prepare(
      `SELECT id, class_id, name, created_at FROM topics
       WHERE class_id = ?
       ORDER BY name COLLATE NOCASE`
    )
    .all(classId);

  res.json({ topics });
});

router.post("/:classId/topics", (req, res) => {
  const classId = Number(req.params.classId);
  if (!Number.isInteger(classId)) {
    return res.status(400).json({ error: "Kehtetu klassi ID." });
  }

  const own = db
    .prepare(`SELECT id FROM classes WHERE id = ? AND teacher_id = ?`)
    .get(classId, req.teacherId);
  if (!own) {
    return res.status(404).json({
      error:
        "Klassi ei leitud või sul ei ole sellele juurdepääsu. Vali oma klass või logi uuesti sisse.",
    });
  }

  const { name } = req.body || {};
  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Teema nimi on kohustuslik." });
  }

  const info = db
    .prepare(`INSERT INTO topics (class_id, name) VALUES (?, ?)`)
    .run(classId, name.trim());

  const row = db
    .prepare(
      `SELECT id, class_id, name, created_at FROM topics WHERE id = ?`
    )
    .get(info.lastInsertRowid);

  res.status(201).json({ topic: row });
});

router.delete("/:classId/topics/:topicId", (req, res) => {
  const classId = Number(req.params.classId);
  const topicId = Number(req.params.topicId);
  if (!Number.isInteger(classId) || !Number.isInteger(topicId)) {
    return res.status(400).json({ error: "Kehtetu ID." });
  }

  const own = db
    .prepare(`SELECT id FROM classes WHERE id = ? AND teacher_id = ?`)
    .get(classId, req.teacherId);
  if (!own) {
    return res.status(404).json({
      error:
        "Klassi ei leitud või sul ei ole sellele juurdepääsu. Vali oma klass või logi uuesti sisse.",
    });
  }

  const topic = db
    .prepare(`SELECT id FROM topics WHERE id = ? AND class_id = ?`)
    .get(topicId, classId);
  if (!topic) {
    return res.status(404).json({ error: "Teemat ei leitud." });
  }

  db.prepare(`DELETE FROM grades WHERE topic_id = ?`).run(topicId);
  db.prepare(`DELETE FROM topics WHERE id = ?`).run(topicId);

  res.status(204).send();
});

router.get("/:classId", (req, res) => {
  const classId = Number(req.params.classId);
  if (!Number.isInteger(classId)) {
    return res.status(400).json({ error: "Kehtetu klassi ID." });
  }

  const row = db
    .prepare(
      `SELECT id, name, subject, created_at FROM classes
       WHERE id = ? AND teacher_id = ?`
    )
    .get(classId, req.teacherId);

  if (!row) {
    return res.status(404).json({ error: "Klassi ei leitud." });
  }

  res.json({ class: row });
});

router.patch("/:classId", (req, res) => {
  const classId = Number(req.params.classId);
  if (!Number.isInteger(classId)) {
    return res.status(400).json({ error: "Kehtetu klassi ID." });
  }

  const existing = db
    .prepare(
      `SELECT id FROM classes WHERE id = ? AND teacher_id = ?`
    )
    .get(classId, req.teacherId);

  if (!existing) {
    return res.status(404).json({ error: "Klassi ei leitud." });
  }

  const { name, subject } = req.body || {};
  const updates = [];
  const values = [];

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "Klassi nimi ei tohi olla tühi." });
    }
    updates.push("name = ?");
    values.push(name.trim());
  }
  if (subject !== undefined) {
    if (typeof subject !== "string" || !subject.trim()) {
      return res.status(400).json({ error: "Õppeaine ei tohi olla tühi." });
    }
    updates.push("subject = ?");
    values.push(subject.trim());
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: "Uuendusi pole." });
  }

  values.push(classId, req.teacherId);
  db.prepare(
    `UPDATE classes SET ${updates.join(", ")} WHERE id = ? AND teacher_id = ?`
  ).run(...values);

  const row = db
    .prepare(
      `SELECT id, name, subject, created_at FROM classes WHERE id = ?`
    )
    .get(classId);

  res.json({ class: row });
});

router.delete("/:classId", (req, res) => {
  const classId = Number(req.params.classId);
  if (!Number.isInteger(classId)) {
    return res.status(400).json({ error: "Kehtetu klassi ID." });
  }

  const info = db
    .prepare(`DELETE FROM classes WHERE id = ? AND teacher_id = ?`)
    .run(classId, req.teacherId);

  if (info.changes === 0) {
    return res.status(404).json({ error: "Klassi ei leitud." });
  }

  res.status(204).send();
});

export default router;
