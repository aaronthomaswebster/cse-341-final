const router = require('express').Router();
const companyController = require('../controllers/company');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', companyController.getAllCompanies);
router.get('/:id', companyController.getCompanyById);
router.post('/', isAuthenticated, companyController.createCompany);
router.put('/:id', isAuthenticated, companyController.updateCompany);
router.delete('/:id', isAuthenticated, companyController.deleteCompany);

module.exports = router;