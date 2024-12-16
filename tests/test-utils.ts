import dotenv from 'dotenv';

dotenv.config();

export async function createTestUser(
  email: string,
  password: string,
  number?: number,
) {
  // Fill in required fields from CreateUserDto
  const userPayload = {
    name: `Test User${number ?? ''}`,
    email,
    password,
    birthDate: '1990-01-01', // can be a string; the backend should transform to a Date
    role: 'arbeidstaker', // arbitrary valid role
    mobile: Math.floor(Math.random() * 100000000), // arbitrary mobile number
    bio: 'Test bio', // optional
    // image optional
  };

  const response = await fetch(`${process.env.API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userPayload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create test user: ${errorText}`);
  }

  const data = await response.json();
  return data.item; // The BaseController returns { message, item } by default
}

export async function deleteTestUser(userId: string) {
  const response = await fetch(`${process.env.API_URL}/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete test user: ${errorText}`);
  }

  return true;
}

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${process.env.API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to log in user: ${errorText}`);
  }

  const data = await response.json();
  return data.access_token as string;
}
