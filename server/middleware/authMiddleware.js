const jwt = require('jsonwebtoken');

const protectAdmin = (req, res, next) => {
  const token = req.cookies.admin_token;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication is required' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Administrator access is required' });
    }

    req.admin = payload;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Your session is invalid or has expired' });
  }
};

module.exports = protectAdmin;
