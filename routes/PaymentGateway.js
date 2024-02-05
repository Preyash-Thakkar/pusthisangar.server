const express = require('express');
const { newPayment, checkStatus,phonePeCallBack } = require('../controllers/PaymentGatewayR');
const router = express();

router.post('/payment', newPayment);
router.post('/status', checkStatus);
router.post('/phonpecallback',phonePeCallBack)


module.exports = router;