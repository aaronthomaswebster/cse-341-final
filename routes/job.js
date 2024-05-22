const router = require('express').Router();
const jobController = require('../controllers/job');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);
router.post('/', isAuthenticated, jobController.createJob);
router.put('/:id', isAuthenticated, jobController.updateJob);
router.delete('/:id', isAuthenticated, jobController.deleteJob);

module.exports = router;