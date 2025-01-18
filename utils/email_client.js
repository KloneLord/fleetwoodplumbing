import nodemailer from 'nodemailer';

export const sendEmail = async (recipient, subject, body) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: recipient,
        subject,
        text: JSON.stringify(body, null, 2),
    });
};
