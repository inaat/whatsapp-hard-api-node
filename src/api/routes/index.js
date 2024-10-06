// const express = require('express');
// const router = express.Router();
// const instanceRoutes = require('./instance.route');
// const messageRoutes = require('./message.route');
// const miscRoutes = require('./misc.route');
// const groupRoutes = require('./group.route');
// //const managerRoutes = require('./manager.route');

// router.get('/status', (req, res) => res.send('OK'));
// router.use('/instance', instanceRoutes);
// router.use('/message', messageRoutes);
// router.use('/group', groupRoutes);
// router.use('/misc', miscRoutes);
// //router.get('/', (req, res) => res.redirect('/manager/login'));
// //router.use('/manager', managerRoutes); // Adiciona as rotas de gerenciamento aqui

// module.exports = router;


const express = require('express');
const router = express.Router();
const instanceRoutes = require('./instance.route');
const messageRoutes = require('./message.route');
const miscRoutes = require('./misc.route');
const groupRoutes = require('./group.route');
// const managerRoutes = require('./manager.route');

// Parse JSON bodies for webhook
const bodyParser = require('body-parser');
router.use(bodyParser.json()); // Enable parsing JSON in POST requests

// Webhook route
// Webhook route
router.post('/webhook', (req, res) => {
    const webhookData = req.body;

    console.log('Received Webhook:', webhookData);

    // Check if the type is 'message'
    if (webhookData.type === 'message') {
        // Extract message content
        const msgContent = webhookData?.body?.msgContent; // Accessing msgContent
        const messageId = webhookData?.body?.key?.id; // Extracting the message ID if needed
        const sender = webhookData?.body?.pushName; // Extracting the sender's name

        // Log the message content if available
        if (msgContent) {
            console.log('Message Content:', msgContent);
        } else {
            console.log('No message content available.');
        }

        // Log additional information if needed
        console.log('Sender:', sender);
        console.log('Message ID:', messageId);
    } else {
        console.log('Received non-message type:', webhookData.type);
    }

    // Send a response back to acknowledge the webhook was received
    res.status(200).send('Webhook received');
});

router.post('/webhook document', (req, res) => {
    const webhookData = req.body;

    console.log('Received Webhook:', webhookData);

    // Check if the type is 'message'
    if (webhookData.type === 'message') {
        // Extract message content
        const msgContent = webhookData?.body?.msgContent; // Accessing msgContent
        const messageId = webhookData?.body?.key?.id; // Extracting the message ID if needed
        const sender = webhookData?.body?.pushName; // Extracting the sender's name
        const messageDetails = webhookData?.body?.message; // Accessing message object

        // Log the message content if available
        if (msgContent) {
            console.log('Message Content:', msgContent);
        } else {
            console.log('No message content available.');
        }

        // Log additional information if needed
        console.log('Sender:', sender);
        console.log('Message ID:', messageId);
        
        // Check for additional message details and log them
        if (messageDetails) {
            console.log('Message Details:', messageDetails);

            // Log messageContextInfo if it exists
            const contextInfo = messageDetails?.messageContextInfo;
            if (contextInfo) {
                console.log('Message Context Info:', contextInfo);
            } else {
                console.log('No message context info available.');
            }

            // Log documentWithCaptionMessage if it exists
            const documentWithCaption = messageDetails?.documentWithCaptionMessage;
            if (documentWithCaption) {
                console.log('Document with Caption Message:', documentWithCaption);
            } else {
                console.log('No document with caption message available.');
            }
        } else {
            console.log('No message details available.');
        }
    } else {
        console.log('Received non-message type:', webhookData.type);
    }

    // Send a response back to acknowledge the webhook was received
    res.status(200).send('Webhook received');
});


// Existing routes
router.get('/status', (req, res) => res.send('OK'));
router.use('/instance', instanceRoutes);
router.use('/message', messageRoutes);
router.use('/group', groupRoutes);
router.use('/misc', miscRoutes);
// router.get('/', (req, res) => res.redirect('/manager/login'));
// router.use('/manager', managerRoutes); // Uncomment if needed

module.exports = router;
