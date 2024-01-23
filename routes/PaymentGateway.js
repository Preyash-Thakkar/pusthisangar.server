
const express = require('express');
const { newPayment, checkStatus } = require('../controllers/PaymentGatewayR');
const router = express();

router.post('/payment', newPayment);
router.post('/status/:txnId', checkStatus);

module.exports = router;