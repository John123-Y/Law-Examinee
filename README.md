# Exam App
A WAEC/JAMB-inspired Q&A platform with admin-controlled courses, questions, exams, Paystack payments, and performance analytics.

## Setup
1. Clone the repository.
2. Install dependencies: npm install
3. Create .env and .env.test with the provided configurations.
4. Start MongoDB and run: npm run dev
5. Run tests: npm test

## Environment Variables
- MONGODB_URI: MongoDB connection string
- PAYSTACK_SECRET_KEY: Paystack secret key
- CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET: Cloudinary credentials
- NODEMAILER_HOST, NODEMAILER_PORT, NODEMAILER_USER, NODEMAILER_PASS: Mailtrap credentials
- JWT_SECRET: JWT secret
- APP_URL, CALLBACK_URL: App and callback URLs

## Features
- Course, question, and exam management with CRUD
- User authentication with OTP
- Paystack payment integration
- Cloudinary image uploads for courses
- Performance analytics with Chart.js
- AI-driven topic recommendations