import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/db';
import { authMiddleware } from '../../../middleware/authMiddleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.body.userId;

  if (req.method === 'GET') {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        gender: true,
        phoneNumber: true,
        dateOfBirth: true,
        address: true,
        languagePreference: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.status(200).json(user);
  } else if (req.method === 'PUT') {
    const { firstName, lastName, gender, phoneNumber, dateOfBirth, address } = req.body;

    await prisma.user.update({
      where: { id: userId },
      data: { firstName, lastName, gender, phoneNumber, dateOfBirth, address },
    });

    res.status(200).json({ message: 'Profile updated successfully' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default authMiddleware(handler);
