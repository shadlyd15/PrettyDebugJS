/**
 * @external
 * @fileOverview Send Email On Alarm Example
 * @author Shadly Salahuddin
 * @link mailto:shadlyd15@gmail.com
 * @version 2.0.1
 */

const net = require('net');
const debug = require('.././PrettyDebugJS.js');

const nodemailer = require('nodemailer');

// async..await is not allowed in global scope, must use a wrapper
async function sendEmail(to, subject, message){
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: '<YOUR_EMAIL>',
      pass: '<YOUR_PASSWORD>'
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"<YOUR_NAME>" <YOUR_EMAIL>', // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: 'Notification', // plain text body
    html: message // html body
  });

  debug.alert("Message sent: %s", info.messageId);
  debug.alert("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

debug.info('Example : Send Email On Alarm');
// debug.info('Send Emmail : ' + sendMail());

debug.scheduleHealthCheck(function(){
	debug.memoryWatermark();
	debug.sysMemoryMonitor();
	debug.nodeMemoryMonitor({
		heapTotal: { upperLimit : 5 }
	}, function(){
		debug.critical('Memory Usage Alarm : Total heap usage is above 5 MB');
		sendEmail('RECEIVER_EMAIL@EXAMPLE.com', 'High Memory Usage Alert', 'Memory Usage Alarm : Total heap usage is above 5 MB').catch(debug.error)
	});
}, 1);
