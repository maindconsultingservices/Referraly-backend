import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { hashPassword } from '../../../utils/encryption';
import { registrationSchema } from '../../../utils/validation';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await registrationSchema.validate(req.body);

    const {
      email,
      username,
      password,
      firstName,
      lastName,
      gender,
      phoneNumber,
      dateOfBirth,
      address,
      languagePreference,
    } = req.body;

    // Check if user already exists
    const existingUser = await sql`SELECT id FROM users WHERE email = ${email} OR username = ${username};`;

    if (existingUser.rowCount > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const passwordHash = await hashPassword(password);

    const isAdmin = process.env.ADMIN_USERS?.split(',').includes(email);
    const role = isAdmin ? 'admin' : 'user';

    await sql`
      INSERT INTO users (
        username,
        email,
        password_hash,
        first_name,
        last_name,
        gender,
        phone_number,
        date_of_birth,
        address,
        language_preference,
        role,
        created_at,
        updated_at
      ) VALUES (
        ${username},
        ${email},
        ${passwordHash},
        ${firstName},
        ${lastName},
        ${gender || null},
        ${phoneNumber || null},
        ${dateOfBirth || null},
        ${address || null},
        ${languagePreference || 'en'},
        ${role},
        NOW(),
        NOW()
      );
    `;

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
