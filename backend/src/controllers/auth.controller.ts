import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../config/database';
import { generateToken } from '../utils/jwt';
 
export const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;
 
    // Validation
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
 
    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
 
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
 
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
 
    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });
 
    // Générer le token
    const token = generateToken({ userId: user.id, email: user.email });
 
    res.status(201).json({
      success: true,
      data: { user, token },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};
 
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
 
    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
 
    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
    });
 
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
 
    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
 
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
 
    // Générer le token
    const token = generateToken({ userId: user.id, email: user.email });
 
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
 
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });
 
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
 
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};