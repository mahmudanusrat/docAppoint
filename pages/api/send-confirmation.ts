import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic'; // Disable caching for this route

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, appointmentDetails } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `Healthcare App <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Appointment Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #2563eb; text-align: center;">Appointment Confirmation</h2>
          <p>Dear ${name},</p>
          <p>Your appointment has been successfully booked. Here are the details:</p>
          
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 4px 0;"><strong>Doctor:</strong> ${appointmentDetails.split(' on ')[0].replace('Appointment with ', '')}</p>
            <p style="margin: 4px 0;"><strong>Date:</strong> ${appointmentDetails.split(' on ')[1].split(' at ')[0]}</p>
            <p style="margin: 4px 0;"><strong>Time:</strong> ${appointmentDetails.split(' at ')[1]}</p>
          </div>
          
          <p>Please arrive 10 minutes before your scheduled time.</p>
          <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
          
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
            <p>Best regards,</p>
            <p><strong>Healthcare Team</strong></p>
          </div>
        </div>
      `,
    };
    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Error sending email' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
