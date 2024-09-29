import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/db';
import { hashPassword } from '../../../utils/encryption';
import { registrationSchema } from '../../../utils/validation';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await registrationSchema.validate(req.body);

    const { email, username, password, firstName, lastName, languagePreference } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const passwordHash = await hashPassword(password);

    const isAdmin = process.env.ADMIN_USERS?.split(',').includes(email);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        firstName,
        lastName,
        languagePreference,
        role: isAdmin ? 'admin' : 'user',
      },
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
