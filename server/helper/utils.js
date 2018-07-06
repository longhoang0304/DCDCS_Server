import httpStatus from 'http-status';
import User from '../user/user.model';

function checkPassword(pass) {
  if (typeof pass !== 'string') return false;
  if (!pass.match(/.{6,}/)) {
    return false;
  }
  return true;
}

/**
 *
 * @param {Function} verificationFunction
 * Generate verication middleware with given verification function
 */
const genUserVerification = (verificationFunction) => async (req, res, next) => {
  const token = req.headers['x-access-token'];
  const res401 = () => res.status(httpStatus.UNAUTHORIZED).json({ message: 'You action is not allowed' });
  let id;
  let isAdmin = false;

  try {
    const ret = await User.verifyToken(token);
    id = ret.id; // eslint-disable-line
    isAdmin = ret.isAdmin; // eslint-disable-line
  } catch (error) {
    if (error.status === httpStatus.BAD_REQUEST) {
      return res.status(error.status).json({ message: error.message });
    }
    return res401();
  }

  if (isAdmin) return next();
  return verificationFunction(req, res401, next, id, res);
};

export {
  checkPassword,
  genUserVerification,
};