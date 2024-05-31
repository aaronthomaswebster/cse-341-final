const router = require('express').Router();
const applicationController = require('../controllers/application');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', isAuthenticated, applicationController.getApplications);
router.get('/:id', isAuthenticated, applicationController.getApplicationById);
router.get('/byjobId/:id', isAuthenticated, applicationController.getApplicationByJobId);
router.get('/filterbystatus/:status', isAuthenticated, applicationController.filterByStatus);
router.post('/', isAuthenticated, applicationController.createApplication);
router.put('/:id', isAuthenticated, applicationController.updateApplication);
router.delete('/:id', isAuthenticated, applicationController.deleteApplication);

module.exports = router;