import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const languageCode = req.query.languageCode as string;

  const messages = await prisma.uIMessage.findMany({
    where: { languageCode },
  });

  res.status(200).json(messages);
}
