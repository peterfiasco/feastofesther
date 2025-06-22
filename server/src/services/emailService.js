const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // For development, use a test account or Gmail
  if (process.env.NODE_ENV === 'development') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
      }
    });
  } else {
    // Production email configuration
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
};

// Send registration confirmation email
const sendRegistrationConfirmation = async (registrationData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@feastofestherna.com',
      to: registrationData.email,
      subject: 'Registration Confirmation - Feast of Esther 2025',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #c80e91; font-size: 28px; margin-bottom: 10px;">Feast of Esther 2025</h1>
            <div style="height: 3px; width: 80px; background: linear-gradient(to right, #c80e91, #ff6ec4); margin: 0 auto;"></div>
          </div>
          
          <h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">Registration Confirmed!</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #666; margin-bottom: 20px;">
            Dear ${registrationData.firstname} ${registrationData.lastname},
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #666; margin-bottom: 20px;">
            Thank you for registering for the Feast of Esther 2025 event! We're excited to have you join us for this special celebration.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #c80e91; margin-bottom: 15px;">Registration Details:</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${registrationData.firstname} ${registrationData.lastname}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${registrationData.email}</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> ${registrationData.phonenumber}</p>
            <p style="margin: 5px 0;"><strong>Church:</strong> ${registrationData.nameofchurch}</p>
            <p style="margin: 5px 0;"><strong>T-Shirt Size:</strong> ${registrationData.tshirtsize}</p>
          </div>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #28a745; margin-bottom: 15px;">Event Information:</h3>
            <p style="margin: 5px 0;"><strong>Event:</strong> Feast of Esther 2025 - Houston</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> July 10, 2025</p>
            <p style="margin: 5px 0;"><strong>Location:</strong> Houston, TX (Details will be sent closer to the event)</p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #666; margin-bottom: 20px;">
            We'll send you more details about the event location, schedule, and what to expect as we get closer to the date.
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #666; margin-bottom: 20px;">
            If you have any questions, please don't hesitate to contact us at <a href="mailto:info@feastofestherna.com" style="color: #c80e91;">info@feastofestherna.com</a>.
          </p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 14px;">
              Blessings,<br>
              The Feast of Esther Team
            </p>
          </div>
        </div>
      `
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Registration confirmation email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending registration confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Send donation confirmation email
const sendDonationConfirmation = async (donationData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@feastofestherna.com',
      to: donationData.email,
      subject: 'Donation Confirmation - Feast of Esther Ministries',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #c80e91; font-size: 28px; margin-bottom: 10px;">Feast of Esther Ministries</h1>
            <div style="height: 3px; width: 80px; background: linear-gradient(to right, #c80e91, #ff6ec4); margin: 0 auto;"></div>
          </div>
          
          <h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">Thank You for Your Generous Donation!</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #666; margin-bottom: 20px;">
            Dear ${donationData.firstName} ${donationData.lastName},
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #666; margin-bottom: 20px;">
            Thank you for your generous contribution to Feast of Esther Ministries. Your support helps us continue our mission and make a difference in the lives of many.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #c80e91; margin-bottom: 15px;">Donation Details:</h3>
            <p style="margin: 5px 0;"><strong>Donor:</strong> ${donationData.firstName} ${donationData.lastName}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${donationData.email}</p>
            <p style="margin: 5px 0;"><strong>Amount:</strong> $${parseFloat(donationData.amount).toFixed(2)}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              <strong>Tax Information:</strong> Please keep this email as a record of your donation for tax purposes. 
              A formal tax receipt will be mailed to you if your donation qualifies for tax deduction.
            </p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #666; margin-bottom: 20px;">
            Your contribution will be used to support our ministry activities, events, and outreach programs. 
            We are grateful for your partnership in advancing God's kingdom.
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #666; margin-bottom: 20px;">
            If you have any questions about your donation, please contact us at <a href="mailto:info@feastofestherna.com" style="color: #c80e91;">info@feastofestherna.com</a>.
          </p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 14px;">
              God bless you,<br>
              The Feast of Esther Team
            </p>
          </div>
        </div>
      `
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Donation confirmation email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending donation confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Send admin notification email
const sendAdminNotification = async (type, data) => {
  try {
    const transporter = createTransporter();
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@feastofestherna.com';
    
    let subject, content;
    
    if (type === 'registration') {
      subject = 'New Registration - Feast of Esther 2025';
      content = `
        <h2>New Registration Received</h2>
        <p><strong>Name:</strong> ${data.firstname} ${data.lastname}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phonenumber}</p>
        <p><strong>Church:</strong> ${data.nameofchurch}</p>
        <p><strong>Address:</strong> ${data.streetaddress}, ${data.city}, ${data.zippostalcode}, ${data.country}</p>
        <p><strong>T-Shirt Size:</strong> ${data.tshirtsize}</p>
        <p><strong>Registration Time:</strong> ${new Date().toLocaleString()}</p>
      `;
    } else if (type === 'donation') {
      subject = 'New Donation - Feast of Esther Ministries';
      content = `
        <h2>New Donation Received</h2>
        <p><strong>Donor:</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Amount:</strong> $${parseFloat(data.amount).toFixed(2)}</p>
        <p><strong>Donation Time:</strong> ${new Date().toLocaleString()}</p>
      `;
    }
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@feastofestherna.com',
      to: adminEmail,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          ${content}
        </div>
      `
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Admin notification email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendRegistrationConfirmation,
  sendDonationConfirmation,
  sendAdminNotification
};