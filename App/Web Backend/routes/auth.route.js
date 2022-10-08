const router = require('express').Router();
const { register, login, refreshTokens, logout } = require('../controllers/auth.controller');
const { authValidation } = require('../validations');
const validate = require('../middlewares/validate');

router.post('/register', validate(authValidation.createUser), register);
router.post('/login', validate(authValidation.login), login);
router.post('/logout', validate(authValidation.logout), logout);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), refreshTokens);

module.exports = router;
