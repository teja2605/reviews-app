const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
dotenv.config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
exports.register = async (req, res) => {
  const { email, password } = req.body;

  const { user, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  return res.status(201).json({ user });
};
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const { user, error } = await supabase.auth.signIn({
    email,
    password,
  });
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  return res.status(200).json({ user });
};
exports.logout = async (req, res) => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  return res.status(200).json({ message: "Logged out successfully" });
};