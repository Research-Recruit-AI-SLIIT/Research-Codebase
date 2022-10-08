const router = require('express').Router();
const authRoutes = require('./auth.route');
const organizationRoutes = require('./organization.route');
const interviewRoutes = require('./interview.route');
const interviewSessionRoutes = require('./interview-session.route');
const interviewAnswerRoutes = require('./interview-answer.route');

const defualtRoutes = [
  {
    path: '/auth',
    routes: authRoutes,
  },
  {
    path: '/organization',
    routes: organizationRoutes,
  },
  {
    path: '/interview',
    routes: interviewRoutes,
  },
  {
    path: '/interview-session',
    routes: interviewSessionRoutes,
  },
  {
    path: '/interview-answer',
    routes: interviewAnswerRoutes,
  },
];

defualtRoutes.forEach((route) => {
  router.use(route.path, route.routes);
});

module.exports = router;
