const { createOrganization, getOrganizations } = require('../controllers/organization.controller');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { organizationValidation } = require('../validations');

const router = require('express').Router();

router.get('/', getOrganizations);
router.post('/create', auth('addOrganization'), validate(organizationValidation.create), createOrganization);

module.exports = router;
