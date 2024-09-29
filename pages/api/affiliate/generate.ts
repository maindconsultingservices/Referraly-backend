import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { authMiddleware } from '../../../middleware/authMiddleware';
import crypto from 'crypto';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.body.userId;
  const { programId } = req.body;

  const secretKey = process.env.SECRET_KEY!;
  const data = `${userId}-${programId}`;
  const hash = crypto.createHmac('sha256', secretKey).update(data).digest('hex');
  const externalId = hash.substring(0, 12);

  // Check if the external affiliate ID already exists
  const existingId = await sql`
    SELECT id FROM external_affiliate_ids
    WHERE user_id = ${userId} AND program_id = ${programId};
  `;

  if (existingId.rowCount === 0) {
    await sql`
      INSERT INTO external_affiliate_ids (
        user_id,
        program_id,
        external_id,
        created_at,
        updated_at
      ) VALUES (
        ${userId},
        ${programId},
        ${externalId},
        NOW(),
        NOW()
      );
    `;
  }

  res.status(201).json({ externalId });
}

export default authMiddleware(handler);
