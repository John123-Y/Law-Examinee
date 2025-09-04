import nodemailer from '../config/nodemailer';
import fs from 'fs';
import handlebars from 'handlebars';

export const sendOtpEmail = async (email: string, otp: string, type: 'email_verification' | 'password_reset') => {
  const source = fs.readFileSync('templates/otpEmail.html', 'utf8');
  const template = handlebars.compile(source);
  const html = template({ otp, appUrl: process.env.APP_URL, isPasswordReset: type === 'password_reset' });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: type === 'email_verification' ? 'Verify Your Email' : 'Password Reset OTP',
    html
  };

  await nodemailer.sendMail(mailOptions);
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  const source = fs.readFileSync('templates/welcomeEmail.html', 'utf8');
  const template = handlebars.compile(source);
  const html = template({ name, appUrl: process.env.APP_URL });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Welcome to Exam App!',
    html
  };

  await nodemailer.sendMail(mailOptions);
};

export const sendResetPasswordEmail = async (email: string, resetUrl: string) => {
  const source = fs.readFileSync('templates/resetPassword.html', 'utf8');
  const template = handlebars.compile(source);
  const html = template({ resetUrl });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Reset Your Password',
    html
  };

  await nodemailer.sendMail(mailOptions);
};

export const sendPaymentConfirmationEmail = async (email: string, amount: number) => {
  const source = fs.readFileSync('templates/paymentConfirmation.html', 'utf8');
  const template = handlebars.compile(source);
  const html = template({ amount: amount / 100, appUrl: process.env.APP_URL });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Payment Confirmation',
    html
  };

  await nodemailer.sendMail(mailOptions);
};

export default { sendOtpEmail, sendWelcomeEmail, sendResetPasswordEmail, sendPaymentConfirmationEmail };