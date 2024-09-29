import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { comparePassword } from '../../../utils/encryption';
import { generateToken } from '../../../utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, password } = req.body;

    const result = await sql`SELECT id, password_hash, language_preference, role FROM users WHERE email = ${email};`;

    if (result.rowCount === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = generateToken(user.id);

    await sql`UPDATE users SET last_login = NOW() WHERE id = ${user.id};`;

    res.status(200).json({ token, languagePreference: user.language_preference, role: user.role });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
