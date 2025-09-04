import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer from '../config/nodemailer';

export const sendOtpEmail = async (email: string, otp: string, type: 'email_verification' | 'password_reset') => {
  const source = fs.readFileSync('templates/otpEmail.html', 'utf8');
  const template = handlebars.compile(source);
  const html = template({ otp, appUrl: process.env.APP_URL, isPasswordReset: type === 'password_reset' });
  await nodemailer.sendMail({ from: process.env.EMAIL_FROM, to: email, subject: type === 'email_verification' ? 'Verify Your Email' : 'Password Reset OTP', html });
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  const source = fs.readFileSync('templates/welcomeEmail.html', 'utf8');
  const template = handlebars.compile(source);
  const html = template({ name, appUrl: process.env.APP_URL });
  await nodemailer.sendMail({ from: process.env.EMAIL_FROM, to: email, subject: 'Welcome to Exam App!', html });
};

export const sendResetPasswordEmail = async (email: string, resetUrl: string) => {
  const source = fs.readFileSync('templates/resetPassword.html', 'utf8');
  const template = handlebars.compile(source);
  const html = template({ resetUrl });
  await nodemailer.sendMail({ from: process.env.EMAIL_FROM, to: email, subject: 'Reset Your Password', html });
};

export const sendPaymentConfirmationEmail = async (email: string, amount: number) => {
  const source = fs.readFileSync('templates/paymentConfirmation.html', 'utf8');
  const template = handlebars.compile(source);
  const html = template({ amount: amount / 100, appUrl: process.env.APP_URL });
  await nodemailer.sendMail({ from: process.env.EMAIL_FROM, to: email, subject: 'Payment Confirmation', html });
};


export default { sendOtpEmail, sendWelcomeEmail, sendResetPasswordEmail, sendPaymentConfirmationEmail };