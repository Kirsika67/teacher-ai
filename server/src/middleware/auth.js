import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.warn(
    "HOIATUS: JWT_SECRET puudub. Lisa server/.env faili muutuja JWT_SECRET."
  );
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ")
    ? header.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ error: "Autentimine on vajalik." });
  }

  try {
    const secret = JWT_SECRET || "arendus-vale-võti";
    const payload = jwt.verify(token, secret);
    req.teacherId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: "Kehtetu või aegunud seanss." });
  }
}
