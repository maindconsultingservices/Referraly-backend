import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/db';
import { comparePassword } from '../../../utils/encryption';
import { generateToken } from '../../../utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = generateToken(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    res.status(200).json({ token, languagePreference: user.languagePreference, role: user.role });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
