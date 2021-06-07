import Auth from '../utils/Auth';

const auth = async (req, res, next) => {
  const token = req.headers['x-token'];
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
  return next();
};

export default auth;
