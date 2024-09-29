import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/db';
import { authMiddleware } from '../../../middleware/authMiddleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.body.userId;

  if (req.method === 'GET') {
    const recommendations = await prisma.recommendation.findMany({
      where: { userId },
    });
    res.status(200).json(recommendations);
  } else if (req.method === 'POST') {
    const { content, programId } = req.body;

    const recommendation = await prisma.recommendation.create({
      data: { content, programId, userId },
    });

    res.status(201).json(recommendation);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default authMiddleware(handler);
