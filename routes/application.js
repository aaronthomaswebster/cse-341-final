const router = require('express').Router();
const applicationController = require('../controllers/application');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', isAuthenticated, applicationController.getApplications);
router.get('/byjobId/:id', applicationController.getApplicationById);
router.get('/filterbystatus/:status', applicationController.filterByStatus);
router.post('/', isAuthenticated, applicationController.createApplication);
router.put('/:id', isAuthenticated, applicationController.updateApplication);
router.delete('/:id', isAuthenticated, applicationController.deleteApplication);

module.exports = router;