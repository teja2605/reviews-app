const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { data, error } = await supabase.auth.api.getUser(token);
  if (error || !data) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.user = data;
  next();
};
module.exports = authMiddleware;