const cron = require('node-cron');
const nodemailer = require('nodemailer');

// Schedule a task to run every minute
cron.schedule('* * * * *', () => {
    // const transporter = nodemailer.createTransport({
    //     host: 'smtp.titan.email',
    //     port: 587,
    //     secure: false,
    //     auth: {
    //         user: 'info@vitnixx.com',
    //         pass: 'Vtc@@7899'
    //     }
    // });
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'knommybassy@gmail.com',
          pass: 'InuhczmfIdqcatyp'
        }
      });
    const mailOptions = {
        from: 'knommybassy@gmail.com',
        to: 'nomaan@360core.inc',
        subject: 'retetrert',
        html: `<p>You have received a new message from your website contact form.</p>Here are the details:<br><br> Name`,
    };
    try {
        // Simulate email sending logic
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.error('Send Mail Error:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Failed to send email:', error);
    }
});
