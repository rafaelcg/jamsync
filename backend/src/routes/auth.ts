import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { generateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be at most 20 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  displayName: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const oauthSchema = z.object({
  provider: z.enum(['google', 'apple']),
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(20).optional(),
  displayName: z.string().optional(),
  avatarUrl: z.string().optional(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// POST /auth/register
router.post('/register', async (req: AuthRequest, res) => {
  try {
    const data = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === data.email) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: hashedPassword,
        displayName: data.displayName || data.username,
      },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// POST /auth/login
router.post('/login', async (req: AuthRequest, res) => {
  try {
    const data = loginSchema.parse(req.body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(data.password, user.password || '');
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
      },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// POST /auth/forgot-password - Request password reset email
router.post('/forgot-password', async (req: AuthRequest, res) => {
  try {
    const data = forgotPasswordSchema.parse(req.body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    // Always return success to prevent email enumeration
    // Even if user doesn't exist, we pretend we sent an email
    if (!user) {
      return res.json({
        message: 'If an account exists with this email, a password reset link has been sent.',
      });
    }

    // Delete any existing reset tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // Store token with 1 hour expiration
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: hashedToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    // Build reset URL (frontend URL)
    const resetUrl = `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    // Log the reset URL (in production, send actual email)
    console.log('\n========== PASSWORD RESET EMAIL ==========');
    console.log(`To: ${user.email}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log(`Token (raw): ${resetToken}`);
    console.log(`Token (hashed): ${hashedToken}`);
    console.log('==========================================\n');

    // In production, you would use a real email service like:
    // - Ethereal Email (for testing)
    // - SendGrid, Mailgun, AWS SES, etc.
    
    res.json({
      message: 'If an account exists with this email, a password reset link has been sent.',
      // Only include in development for testing
      ...(process.env.NODE_ENV !== 'production' && { resetUrl }),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// POST /auth/reset-password - Reset password with valid token
router.post('/reset-password', async (req: AuthRequest, res) => {
  try {
    const data = resetPasswordSchema.parse(req.body);

    // Hash the provided token to match stored hash
    const hashedToken = crypto.createHash('sha256').update(data.token).digest('hex');

    // Find valid reset token
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token: hashedToken,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!resetToken) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { id: resetToken.userId },
    });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Update user's password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Delete used reset token
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });

    console.log(`\n========== PASSWORD RESET COMPLETE ==========`);
    console.log(`User: ${user.email}`);
    console.log(`Password updated successfully`);
    console.log('============================================\n');

    res.json({
      message: 'Password has been reset successfully. You can now login with your new password.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// POST /auth/oauth/callback - Handle OAuth user creation/linking
router.post('/oauth/callback', async (req: AuthRequest, res) => {
  try {
    const data = oauthSchema.parse(req.body);

    // Check if user exists by email
    let user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (user) {
      // User exists - link OAuth account if not already linked
      const existingAccount = await prisma.account.findFirst({
        where: {
          userId: user.id,
          provider: data.provider,
        },
      });

      if (!existingAccount) {
        // Link the OAuth account
        await prisma.account.create({
          data: {
            userId: user.id,
            type: 'oauth',
            provider: data.provider,
            providerAccountId: data.email, // Using email as providerAccountId for simplicity
            access_token: 'oauth_token', // In production, pass actual token from frontend
          },
        });
      }

      // Update avatar if provided
      if (data.avatarUrl && !user.avatarUrl) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { avatarUrl: data.avatarUrl },
        });
      }
    } else {
      // Create new user
      const username = data.username || data.email.split('@')[0];
      
      // Ensure username is unique
      let finalUsername = username;
      let counter = 1;
      while (await prisma.user.findUnique({ where: { username: finalUsername } })) {
        finalUsername = `${username}${counter}`;
        counter++;
      }

      user = await prisma.user.create({
        data: {
          email: data.email,
          username: finalUsername,
          displayName: data.displayName || data.email.split('@')[0],
          avatarUrl: data.avatarUrl,
        },
      });

      // Create OAuth account
      await prisma.account.create({
        data: {
          userId: user.id,
          type: 'oauth',
          provider: data.provider,
          providerAccountId: data.email,
          access_token: 'oauth_token',
        },
      });
    }

    // Generate JWT token for the backend
    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    console.log(`\n========== OAUTH LOGIN SUCCESS ==========`);
    console.log(`Provider: ${data.provider}`);
    console.log(`User: ${user.email}`);
    console.log(`Username: ${user.username}`);
    console.log('========================================\n');

    res.json({
      message: 'OAuth login successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
      },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('OAuth callback error:', error);
    res.status(500).json({ error: 'Failed to process OAuth callback' });
  }
});

export default router;
