import Auth from '../utils/Auth';

const preAuth = async (req, res, next) => {
  const token = req.headers['x-token'];
  if (!token) {
    req.authStatus = false;
    return next();
  }

  let userId;
  try {
    userId = await Auth.getUserByToken(token);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  } catch (e) {
    return res.status(401).json({ error: e.message });
  }
  req.userId = userId;
  req.token = token;
  return next();
};

export default preAuth;
