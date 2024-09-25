import models from '../model/model.js';
import nodemailer from 'nodemailer'
import pLimit from 'p-limit';

const limit = pLimit(5); // limit for number of concurrent mails that can be sent
const User = models.User;

async function notifyUsers(event) {
  try {
    // Find users whose IDs are in the event's subscribers array
    const subscribers = await User.find({ _id: { $in: event.subscribers } });

    if (subscribers.length === 0) {
      console.log(`No subscribers for event: ${event.name}`);
      return;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const emailPromises = subscribers.map((user) => limit(async () => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Tickets Available for ${event.theatreName + ' ' + event.url}!!!`,
        text: `Hi ${user.email},\n\nTickets are now available for a movie you subscribed.\n\nCheck it out here: ${event.url}\n\nBest,\nBMS Notification Service`
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Notification sent to: ${user.email}`);
      } catch (error) {
        console.error(`Failed to send email to ${user.email}:`, error);
      }
    })
    );

    await Promise.all(emailPromises);
    console.log(`Notifications sent for event: ${event.name}`);
  } catch (error) {
    console.error('Error notifying users:', error);
  }
}

export default notifyUsers;
