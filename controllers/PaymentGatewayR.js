

const crypto = require("crypto");
const axios = require("axios");
const Order = require("../models/Order");

// import axios from "axios";

// const {salt_key, merchant_id} = require('./secret')

const newPayment = async (req, res) => {
  const merchant_id = "M22VUO6F0UCZI";
  const salt_key = "b08aa1a4-66d7-42b5-a8df-9df382f87a58";

  try {
    const merchantTransactionId = req.body.transactionId;
    console.log("mtid", merchantTransactionId);
    const data = {
      merchantId: merchant_id,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: req.body.MUID,
      name: req.body.name,
      amount: req.body.amount * 100,
      redirectUrl: `https://server.pushtishangar.com/api/status`,
      redirectMode: "POST",
      callbackUrl: `https://server.pushtishangar.com/api/phonpecallback`,
      mobileNumber: req.body.number.toString(),
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    console.log("Dataaa", data);

        const payload = JSON.stringify(data);
        const payloadMain = Buffer.from(payload).toString('base64');
        const keyIndex = 1;
        const string = payloadMain + '/pg/v1/pay' + salt_key;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + '###' + keyIndex;
        console.log("ccc",checksum)

        const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";
        const options = {
            method: 'POST',
            url: prod_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            },
            data: {
                request: payloadMain
            }
        };

        const response = await axios(options);

        if (response.data.success === true) {
            const url = response.data.data.instrumentResponse.redirectInfo.url;
            console.log("Response of payment:", response.data);
            console.log("Data:", response.data.data.instrumentResponse);
            return res.status(200).json({  url:url});
        } else {
            console.error("Payment request failed:", response.data);
            res.status(500).json({
                message: "Payment request failed",
                success: false
            });
        }
    } catch (error) {
        console.error("Error in newPayment:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const phonePeCallBack = (req, res) => {
  console.log("in callback");
  console.log(req.body);
  console.log("end callback");
  // catch {}
  // res.status(200).json('sent')
  // res.end('sent')
  // res.end()
  // res.send('')
};

const checkStatus = async (req, res) => {
  try {
    console.log("in redirect");
    console.log("body", req.body);
    console.log("end redirect");

    const transaction = await Order.findOne({
      transactionId: req.body.transactionId,
    });

    if (!transaction) {
      console.error("Transaction not found");
      return res.redirect(getFailureRedirectURL());
    }

    if (req.body.code === "PAYMENT_SUCCESS") {
      const transUpdate = await Order.findOneAndUpdate(
        { transactionId: req.body.transactionId },
        {
          status: completed,
        },
        { new: true }
      );
      // const trans = await PaymentGateway.findOne({
      //   transactionId: req.body.transactionId,
      // });
      // const prospect = await Prospect.findOneAndUpdate(
      //   { _id: trans.StakeHolderId },
      //   {
      //     PackageID: trans.subPackageId,
      //     PackageStartDt: trans.subPackageStartDt,
      //     PackageEndDt: trans.subPackageEndDt,
      //     IsPaid: true,
      //     IsActive: true,
      //     transactionId: req.body.transactionId,
      //   },
      //   { new: true }
      // );

      // Make an API request to get payment status (optional)
      console.log("yeee", transaction.transactionId);

      const paymentStatus = await fetchPaymentStatus(transaction.transactionId);

      console.log("payment status", paymentStatus);

      // console.log("payment status", paymentStatus);

      // const updatePaymentStatus = await PaymentGateway.findOneAndUpdate(
      //   { _id: req.body.transactionId },
      //   {
      //     paymentInstrument: paymentStatus,
      //   },
      //   { new: true }
      // );

      res.redirect(getSuccessRedirectURL());
      // res.end()
    } else {
      const transUpdate = await Order.findOneAndUpdate(
        { transactionId: req.body.transactionId },
        {
          status: cancelled,
        },
        { new: true }
      );
      res.redirect(getFailureRedirectURL());
      // res.end()
    }
  } catch (err) {
    console.log("error",err);
  }
};

// exports.phonePeRedirect = async (req, res) => {
//     try {
//       console.log("in redirect");
//       console.log(req.body);
//       console.log("end redirect");

//       const transaction = await Order.findOne({
//         transactionId: req.body.transactionId,
//       });

//       if (!transaction) {
//         console.error("Transaction not found");
//         return res.redirect(getFailureRedirectURL());
//       }

//       if (req.body.code === "PAYMENT_SUCCESS") {
//         const transUpdate = await Order.findOneAndUpdate(
//           { transactionId: req.body.transactionId },
//           {
//             status: req.body.code,
//           },
//           { new: true }
//         );
//         // const trans = await PaymentGateway.findOne({
//         //   transactionId: req.body.transactionId,
//         // });
//         // const prospect = await Prospect.findOneAndUpdate(
//         //   { _id: trans.StakeHolderId },
//         //   {
//         //     PackageID: trans.subPackageId,
//         //     PackageStartDt: trans.subPackageStartDt,
//         //     PackageEndDt: trans.subPackageEndDt,
//         //     IsPaid: true,
//         //     IsActive: true,
//         //     transactionId: req.body.transactionId,
//         //   },
//         //   { new: true }
//         // );

//         // Make an API request to get payment status (optional)
//         const paymentStatus = await fetchPaymentStatus(transaction.transactionId);

//         // console.log("payment status", paymentStatus);

//         // const updatePaymentStatus = await PaymentGateway.findOneAndUpdate(
//         //   { _id: req.body.transactionId },
//         //   {
//         //     paymentInstrument: paymentStatus,
//         //   },
//         //   { new: true }
//         // );

//         res.redirect(getSuccessRedirectURL());
//         // res.end()
//       } else {
//         const transUpdate = await PaymentGateway.findOneAndUpdate(
//           { _id: req.body.transactionId },
//           {
//             paymentStatus: req.body.code,
//           },
//           { new: true }
//         );
//         res.redirect(${process.env.FRONTEND_URL}payment-failure);
//         // res.end()
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

async function fetchPaymentStatus(transactionId) {
  try {
    const merchantId = "M22VUO6F0UCZI";
  const salt_key = "b08aa1a4-66d7-42b5-a8df-9df382f87a58";
    const hashInput = `/pg/v1/status/${merchantId}/${transactionId}${salt_key}`;

    // Use crypto to create a SHA-256 hash
    const sha256 =
      crypto.createHash("sha256").update(hashInput).digest("hex") + "###1";
    console.log("sha256", sha256);
    const options = {
      method: "GET",
      url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${transactionId}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": sha256,
        "X-MERCHANT-ID": merchantId,
      },
    };

    const response = await axios.request(options);
    console.log("res of status", response.data);
    return response.data; // Return the payment status or modify as needed
  } catch (error) {
    console.error("Error fetching payment status:", error);
    // Handle the error or return an appropriate value
    return null;
  }
}

const getSuccessRedirectURL = () => {
  return `https://pushtishangar.com/success`;
};

const getFailureRedirectURL = () => {
  return `https://pushtishangar.com/failure`;
};

module.exports = {
  newPayment,
  checkStatus,
  phonePeCallBack,
};