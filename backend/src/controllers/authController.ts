import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler.ts';
import User from '../models/User.ts';
import generateToken from '../utils/generateToken.ts';
import { signupSchema, loginSchema } from '../validations/authValidation.ts';

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
export const signup = asyncHandler(async (req: Request, res: Response) => {
  const result = signupSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400);
    throw new Error(result.error.errors[0].message);
  }

  const { name, email, password, role } = result.data;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role
  });

  if (user) {
    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400);
    throw new Error(result.error.errors[0].message);
  }

  const { email, password } = result.data;

  const user: any = await User.findOne({ email }).select('+password');

  if (user && (await user.matchPassword(password))) {
    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: any, res: Response) => {
  const user = await User.findById(req.user._id);

  res.json({
    success: true,
    data: user
  });
});
