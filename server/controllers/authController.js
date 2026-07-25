const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 8 * 60 * 60 * 1000,
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const { ADMIN_EMAIL, ADMIN_PASSWORD_HASH, JWT_SECRET } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH || !JWT_SECRET) {
    return res.status(500).json({ success: false, message: 'Admin authentication is not configured' });
  }

  const isValidPassword = await bcrypt.compare(password || '', ADMIN_PASSWORD_HASH);

  if (email !== ADMIN_EMAIL || !isValidPassword) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const token = jwt.sign({ role: 'admin', email: ADMIN_EMAIL }, JWT_SECRET, { expiresIn: '8h' });

  res.cookie('admin_token', token, cookieOptions).status(200).json({
    success: true,
    data: { email: ADMIN_EMAIL },
  });
};

const logout = (req, res) => {
  res.clearCookie('admin_token', cookieOptions).status(200).json({ success: true });
};

const getSession = (req, res) => {
  res.status(200).json({ success: true, data: { email: req.admin.email } });
};

module.exports = { getSession, login, logout };
