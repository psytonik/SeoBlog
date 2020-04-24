const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.contactForm = async (req, res) => {
    try {
        const {email, message, name} = await req.body;
        const emailData = {
            to: process.env.EMAIL_TO,
            from: email,
            subject: `Contact Form - ${process.env.APP_NAME}`,
            text: `Email received from contact form \n 
            Sender Name: ${name} \n
            Sender Email: ${email} \n
            Sender Message: ${data.message}`,
            html: `
                <h4>Email received from contact form</h4>
                <p>Sender Name: ${name}</p>
                <p>Sender Email ${email}</p>
                <p>Sender Message ${message}</p>
                <hr/>
                <p>This email may contain sensitive information</p>
                <p>https://anthonyfink.dev</p>
            `
        }
        sgMail.send(emailData)
            .then((sent) => {
                return res.json({
                    success: true
                })
            })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
};

exports.contactBlogAuthorForm = async (req, res) => {
    try {
        const {authorEmail, email, message, name} = await req.body;

        let mailList = [authorEmail, process.env.EMAIL_TO]

        const emailData = {
            to: mailList,
            from: email,
            subject: `Someone message you from - ${process.env.APP_NAME}`,
            text: `Email received from contact form \n 
            Sender Name: ${name} \n
            Sender Email: ${email} \n
            Sender Message: ${data.message}`,
            html: `
                <h4>Email received from contact form</h4>
                <p>Sender Name: ${name}</p>
                <p>Sender Email ${email}</p>
                <p>Sender Message ${message}</p>
                <hr/>
                <p>This email may contain sensitive information</p>
                <p>https://anthonyfink.dev</p>
            `
        }
        sgMail.send(emailData)
            .then((sent) => {
                return res.json({
                    success: true
                })
            })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
};
