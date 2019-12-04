import { Router } from 'express';
const router = new Router();

router.get('/ready', (req, res) => {
  const status = req.app.get('HEALTH_STATUS');
  if (status === 'READY') {
    return res.send({ status });
  } else {
      return res.status(500).send({ status });
  }
});

router.get('/', (req, res) => {
  const status = req.app.get('HEALTH_STATUS');

  return res.send({ status });
});

module.exports = router;
