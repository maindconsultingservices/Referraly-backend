import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const languageCode = req.query.languageCode as string;

  const result = await sql`
    SELECT message_key, message_text
    FROM ui_messages
    WHERE language_code = ${languageCode};
  `;

  res.status(200).json(result.rows);
}
