import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { content } = req.body;

  const result = await sql`SELECT * FROM affiliate_programs;`;
  const programs = result.rows;

  const matchedProgram = programs.find(program =>
    program.tags.some((tag: string) => content.includes(tag))
  );

  if (matchedProgram) {
    res.status(200).json(matchedProgram);
  } else {
    res.status(404).json({ message: 'No matching affiliate program found' });
  }
}
