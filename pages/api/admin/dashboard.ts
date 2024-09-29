import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/db';
import { authMiddleware } from '../../../middleware/authMiddleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.body.userId;

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (user?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const usersCount = await prisma.user.count();
  const recommendationsCount = await prisma.recommendation.count();
  const affiliateProgramsCount = await prisma.affiliateProgram.count();

  res.status(200).json({
    usersCount,
    recommendationsCount,
    affiliateProgramsCount,
  });
}

export default authMiddleware(handler);
