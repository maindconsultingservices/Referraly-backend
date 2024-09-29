import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { authMiddleware } from '../../../middleware/authMiddleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.body.userId;

  if (req.method === 'GET') {
    const result = await sql`
      SELECT
        username,
        email,
        first_name AS "firstName",
        last_name AS "lastName",
        gender,
        phone_number AS "phoneNumber",
        date_of_birth AS "dateOfBirth",
        address,
        language_preference AS "languagePreference",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM users
      WHERE id = ${userId};
    `;
    res.status(200).json(result.rows[0]);
  } else if (req.method === 'PUT') {
    const { firstName, lastName, gender, phoneNumber, dateOfBirth, address } = req.body;

    await sql`
      UPDATE users
      SET
        first_name = ${firstName},
        last_name = ${lastName},
        gender = ${gender},
        phone_number = ${phoneNumber},
        date_of_birth = ${dateOfBirth},
        address = ${address},
        updated_at = NOW()
      WHERE id = ${userId};
    `;

    res.status(200).json({ message: 'Profile updated successfully' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default authMiddleware(handler);
