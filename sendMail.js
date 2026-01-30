const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "sahiddumbuya821@gmail.com",
        pass: "rtje lawl xtwq szbk"
    }
});

const sendMail = (to, subject, text) => {
    const mailOptions = {
        from: "sahiddumbuya821@gmail.com",
        to,
        subject,
        text
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
};


module.exports = sendMail;
