import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required'
    }),
  name: Joi.string().min(2).required().messages({
    'string.min': 'Name must be at least 2 characters long',
    'any.required': 'Name is required'
  })
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

export const verifyEmailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required'
  }),
  otp: Joi.string().length(6).pattern(/^\d+$/).required().messages({
    'string.length': 'OTP must be 6 digits',
    'string.pattern.base': 'OTP must contain only digits',
    'any.required': 'OTP is required'
  })
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required'
  })
});

export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required'
  }),
  otp: Joi.string().length(6).pattern(/^\d+$/).required().messages({
    'string.length': 'OTP must be 6 digits',
    'string.pattern.base': 'OTP must contain only digits',
    'any.required': 'OTP is required'
  }),
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({
      'string.min': 'New password must be at least 8 characters long',
      'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'New password is required'
    })
});

export const courseSchema = Joi.object({
  title: Joi.string().min(3).required().messages({
    'string.min': 'Title must be at least 3 characters long',
    'any.required': 'Title is required'
  }),
  description: Joi.string().min(10).required().messages({
    'string.min': 'Description must be at least 10 characters long',
    'any.required': 'Description is required'
  })
});

export const examSchema = Joi.object({
  course: Joi.string().hex().length(24).required().messages({
    'string.hex': 'Course ID must be a valid ObjectId',
    'string.length': 'Course ID must be 24 characters long',
    'any.required': 'Course ID is required'
  }),
  year: Joi.number().integer().min(2000).max(new Date().getFullYear() + 1).required().messages({
    'number.base': 'Year must be a number',
    'number.min': 'Year must be at least 2000',
    'number.max': `Year cannot be greater than ${new Date().getFullYear() + 1}`,
    'any.required': 'Year is required'
  }),
  rankings: Joi.array().items(
    Joi.object({
      user: Joi.string().hex().length(24).required(),
      questions: Joi.array().items(
        Joi.object({
          questionId: Joi.string().hex().length(24).required(),
          answer: Joi.string().required(),
          timeSpent: Joi.number().min(0).required(),
          percentage: Joi.number().min(0).max(100).required()
        })
      )
    })
  ).optional()
});
export const questionSchema = Joi.object({
  course: Joi.string().hex().length(24).required().messages({
    'string.hex': 'Course ID must be a valid ObjectId',
    'string.length': 'Course ID must be 24 characters long',
    'any.required': 'Course ID is required'
  }),
  question: Joi.string().min(5).required().messages({
    'string.min': 'Question must be at least 5 characters long',
    'any.required': 'Question is required'
  }),
  options: Joi.array().items(Joi.string().min(1)).min(2).max(5).required().messages({
    'array.min': 'At least 2 options are required',
    'array.max': 'Maximum 5 options allowed',
    'any.required': 'Options are required'
  }),
  correctAnswer: Joi.string().required().messages({
    'any.required': 'Correct answer is required'
  }),
  caseStudy: Joi.string().optional(),
  years: Joi.array().items(Joi.number().integer().min(2000).max(new Date().getFullYear() + 1)).min(1).required().messages({
    'array.min': 'At least one year is required',
    'any.required': 'Years are required'
  }),
  explanation: Joi.string().min(10).required().messages({
    'string.min': 'Explanation must be at least 10 characters long',
    'any.required': 'Explanation is required'
  }),
  isPremium: Joi.boolean().optional(),
  releaseDate: Joi.date().optional(),
  expiryDate: Joi.date().optional()
});

export const paymentSchema = Joi.object({
  amount: Joi.number().min(100).required().messages({
    'number.min': 'Amount must be at least 100',
    'any.required': 'Amount is required'
  }),
  type: Joi.string().valid('premium_subscription').required().messages({
    'any.only': 'Type must be premium_subscription',
    'any.required': 'Type is required'
  })
});

export const submitAnswerSchema = Joi.object({
  questionId: Joi.string().hex().length(24).required().messages({
    'string.hex': 'Question ID must be a valid ObjectId',
    'string.length': 'Question ID must be 24 characters long',
    'any.required': 'Question ID is required'
  }),
  selectedAnswer: Joi.string().required().messages({
    'any.required': 'Selected answer is required'
  }),
  timeTaken: Joi.number().min(0).required().messages({
    'number.min': 'Time taken cannot be negative',
    'any.required': 'Time taken is required'
  })
});