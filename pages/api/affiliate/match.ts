import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { content } = req.body;

  const programs = await prisma.affiliateProgram.findMany();

  const matchedProgram = programs.find(program =>
    program.tags.some(tag => content.includes(tag))
  );

  if (matchedProgram) {
    res.status(200).json(matchedProgram);
  } else {
    res.status(404).json({ message: 'No matching affiliate program found' });
  }
}
