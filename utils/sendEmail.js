const nodemailer = require("nodemailer");


const sendEmail = async (subject, message, send_to, sent_from, reply_to) => {
    // Create Email Transporter
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "marwiz.tech@gmail.com",
            pass: "abuoxineboamaqkm",
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    /// Option for Sending email
    const options = {
        from: sent_from,
        to: send_to,
        replyTo: reply_to,
        subject: subject,
        html: message
    }

    // Send Email
    transporter.sendMail(options, function name(err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
        }
    })
};


module.exports = sendEmail