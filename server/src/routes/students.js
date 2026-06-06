import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router({ mergeParams: true });

router.use(requireAuth);

function assertOwnClass(teacherId, classId) {
  const row = db
    .prepare(
      `SELECT id FROM classes WHERE id = ? AND teacher_id = ?`
    )
    .get(classId, teacherId);
  return !!row;
}

router.get("/classes/:classId/students", (req, res) => {
  const classId = Number(req.params.classId);
  if (!Number.isInteger(classId)) {
    return res.status(400).json({ error: "Kehtetu klassi ID." });
  }

  if (!assertOwnClass(req.teacherId, classId)) {
    return res.status(404).json({ error: "Klassi ei leitud." });
  }

  const rows = db
    .prepare(
      `SELECT s.id, s.class_id, s.name, s.created_at,
         (SELECT AVG(g.score) FROM grades g WHERE g.student_id = s.id) AS avg_score
       FROM students s
       WHERE s.class_id = ?
       ORDER BY s.name COLLATE NOCASE`
    )
    .all(classId);

  const students = rows.map((row) => ({
    id: row.id,
    class_id: row.class_id,
    name: row.name,
    created_at: row.created_at,
    averagePercent:
      row.avg_score != null
        ? Math.round(Number(row.avg_score) * 10) / 10
        : null,
  }));

  res.json({ students });
});

router.post("/classes/:classId/students", (req, res) => {
  const classId = Number(req.params.classId);
  if (!Number.isInteger(classId)) {
    return res.status(400).json({ error: "Kehtetu klassi ID." });
  }

  if (!assertOwnClass(req.teacherId, classId)) {
    return res.status(404).json({ error: "Klassi ei leitud." });
  }

  const { name, names } = req.body || {};

  /** @type {string[]} */
  let list = [];
  if (Array.isArray(names)) {
    list = names
      .map((n) => (typeof n === "string" ? n.trim() : ""))
      .filter(Boolean);
  } else if (typeof name === "string" && name.trim()) {
    const lines = name
      .split(/\r?\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);
    list = lines.length ? lines : [name.trim()];
  }

  if (list.length === 0) {
    return res
      .status(400)
      .json({ error: "Sisesta vähemalt üks õpilase nimi." });
  }

  const insert = db.prepare(
    `INSERT INTO students (class_id, name) VALUES (?, ?)`
  );

  const created = db.transaction(() => {
    const out = [];
    for (const n of list) {
      const info = insert.run(classId, n);
      const row = db
        .prepare(
          `SELECT id, class_id, name, created_at FROM students WHERE id = ?`
        )
        .get(info.lastInsertRowid);
      out.push(row);
    }
    return out;
  })();

  res.status(201).json({ students: created });
});

router.patch("/classes/:classId/students/:studentId", (req, res) => {
  const classId = Number(req.params.classId);
  const studentId = Number(req.params.studentId);
  if (!Number.isInteger(classId) || !Number.isInteger(studentId)) {
    return res.status(400).json({ error: "Kehtetu ID." });
  }

  if (!assertOwnClass(req.teacherId, classId)) {
    return res.status(404).json({ error: "Klassi ei leitud." });
  }

  const { name } = req.body || {};
  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Õpilase nimi on kohustuslik." });
  }

  const info = db
    .prepare(
      `UPDATE students SET name = ? WHERE id = ? AND class_id = ?`
    )
    .run(name.trim(), studentId, classId);

  if (info.changes === 0) {
    return res.status(404).json({ error: "Õpilast ei leitud." });
  }

  const row = db
    .prepare(
      `SELECT id, class_id, name, created_at FROM students WHERE id = ?`
    )
    .get(studentId);

  res.json({ student: row });
});

router.delete("/classes/:classId/students/:studentId", (req, res) => {
  const classId = Number(req.params.classId);
  const studentId = Number(req.params.studentId);
  if (!Number.isInteger(classId) || !Number.isInteger(studentId)) {
    return res.status(400).json({ error: "Kehtetu ID." });
  }

  if (!assertOwnClass(req.teacherId, classId)) {
    return res.status(404).json({ error: "Klassi ei leitud." });
  }

  const info = db
    .prepare(`DELETE FROM students WHERE id = ? AND class_id = ?`)
    .run(studentId, classId);

  if (info.changes === 0) {
    return res.status(404).json({ error: "Õpilast ei leitud." });
  }

  res.status(204).send();
});

export default router;
