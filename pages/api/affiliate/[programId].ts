import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const programId = parseInt(req.query.programId as string);

  const program = await prisma.affiliateProgram.findUnique({
    where: { id: programId },
  });

  res.status(200).json(program);
}
