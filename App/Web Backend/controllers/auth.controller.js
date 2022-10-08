const httpStatus = require('http-status');
const authService = require('../services/auth.service');
const tokenService = require('../services/token.service');
const catchAsync = require('../utils/catchAsync');

const register = async (req, res, next) => {
  const { name, email, password, role } = req.body;
  try {
    const user = await authService.createUser({ name, email, password, role });
    const tokens = await tokenService.generateAuthTokens(user);

    res.status(httpStatus.CREATED).json({ user, tokens });
  } catch (err) {
    return next(err);
  }
};

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
};
