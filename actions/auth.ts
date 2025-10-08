// actions/auth.ts
'use server';

import { hash } from 'bcryptjs';
import { z, ZodError } from 'zod';
import { prisma } from '@/lib/prisma';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
});

function isZodError(error: unknown): error is ZodError {
  return error instanceof ZodError;
}


export async function registerUser(data: z.infer<typeof registerSchema>) {
  try {
    // Validate input
    const validated = registerSchema.parse(data);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: validated.email.toLowerCase(),
      },
    });

    if (existingUser) {
      return {
        success: false,
        error: 'A user with this email already exists',
      };
    }

    // Hash password
    const hashedPassword = await hash(validated.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validated.email.toLowerCase(),
        name: validated.name,
        password: hashedPassword,
      },
    });

    // Create free subscription for new user
    await prisma.subscription.create({
      data: {
        userId: user.id,
        plan: 'FREE',
        status: 'ACTIVE',
      },
    });

    return {
      success: true,
      message: 'Account created successfully',
    };
  } catch (error) {
    console.error('Registration error:', error);

    if (isZodError(error)) {
      return {
        success: false,
        error: error.issues[0].message as string,
      };
    }

    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    };
  }
}

// Optional: Password reset request
const resetPasswordRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function requestPasswordReset(
  data: z.infer<typeof resetPasswordRequestSchema>
) {
  try {
    const validated = resetPasswordRequestSchema.parse(data);

    const user = await prisma.user.findUnique({
      where: {
        email: validated.email.toLowerCase(),
      },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return {
        success: true,
        message: 'If an account exists, a password reset link has been sent',
      };
    }

    // TODO: Generate reset token and send email
    // For now, just return success
    // You can implement this with a package like nodemailer or resend

    return {
      success: true,
      message: 'If an account exists, a password reset link has been sent',
    };
  } catch (error) {
    console.error('Password reset request error:', error);

    if (error instanceof ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    };
  }
}

// Optional: Change password (when user is logged in)
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters'),
});

export async function changePassword(
  userId: string,
  data: z.infer<typeof changePasswordSchema>
) {
  try {
    const validated = changePasswordSchema.parse(data);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    // Verify current password
    const { compare } = await import('bcryptjs');
    const isPasswordValid = await compare(
      validated.currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return {
        success: false,
        error: 'Current password is incorrect',
      };
    }

    // Hash new password
    const hashedPassword = await hash(validated.newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    return {
      success: true,
      message: 'Password changed successfully',
    };
  } catch (error) {
    console.error('Change password error:', error);

    if (error instanceof ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    };
  }
}

// Optional: Update user profile
const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .optional(),
  email: z.string().email('Invalid email address').optional(),
});

export async function updateProfile(
  userId: string,
  data: z.infer<typeof updateProfileSchema>
) {
  try {
    const validated = updateProfileSchema.parse(data);

    // If email is being changed, check if it's already taken
    if (validated.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: validated.email.toLowerCase(),
          NOT: {
            id: userId,
          },
        },
      });

      if (existingUser) {
        return {
          success: false,
          error: 'This email is already in use',
        };
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(validated.name && { name: validated.name }),
        ...(validated.email && { email: validated.email.toLowerCase() }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    return {
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    };
  } catch (error) {
    console.error('Update profile error:', error);

    if (error instanceof ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    };
  }
}

// Optional: Delete account
export async function deleteAccount(userId: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    // Verify password before deletion
    const { compare } = await import('bcryptjs');
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return {
        success: false,
        error: 'Password is incorrect',
      };
    }

    // Delete user (cascade will delete related data)
    await prisma.user.delete({
      where: { id: userId },
    });

    return {
      success: true,
      message: 'Account deleted successfully',
    };
  } catch (error) {
    console.error('Delete account error:', error);

    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    };
  }
}