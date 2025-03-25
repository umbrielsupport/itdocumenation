import { compare, hash } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db';

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  image?: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export type UserWithoutPassword = Omit<User, 'password'>;

export const hashPassword = async (password: string): Promise<string> => {
  return hash(password, 10);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return compare(password, hashedPassword);
};

export const createUser = async (
  name: string,
  email: string,
  password: string,
  role = 'user'
): Promise<UserWithoutPassword | null> => {
  try {
    const hashedPassword = await hashPassword(password);
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO users (id, name, email, password, role)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(id, name, email, hashedPassword, role);

    const user = getUserByEmail(email);
    if (!user) return null;

    // Remove password from returned user
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Failed to create user:', error);
    return null;
  }
};

export const getUserByEmail = (email: string): User | null => {
  try {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email) as User | undefined;

    return user || null;
  } catch (error) {
    console.error('Failed to get user by email:', error);
    return null;
  }
};

export const getUserById = (id: string): User | null => {
  try {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const user = stmt.get(id) as User | undefined;

    return user || null;
  } catch (error) {
    console.error('Failed to get user by ID:', error);
    return null;
  }
};

export const createOrganization = (
  name: string,
  industry?: string,
  logo?: string
): { id: string } | null => {
  try {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO organizations (id, name, industry, logo)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(id, name, industry || null, logo || null);

    return { id };
  } catch (error) {
    console.error('Failed to create organization:', error);
    return null;
  }
};

export const addUserToOrganization = (
  userId: string,
  organizationId: string,
  role = 'member'
): boolean => {
  try {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO organization_users (id, organization_id, user_id, role)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(id, organizationId, userId, role);

    return true;
  } catch (error) {
    console.error('Failed to add user to organization:', error);
    return false;
  }
};

export const getUserOrganizations = (userId: string) => {
  try {
    const stmt = db.prepare(`
      SELECT o.* FROM organizations o
      JOIN organization_users ou ON o.id = ou.organization_id
      WHERE ou.user_id = ?
    `);

    const organizations = stmt.all(userId);
    return organizations;
  } catch (error) {
    console.error('Failed to get user organizations:', error);
    return [];
  }
};

export const getOrganizationUsers = (organizationId: string) => {
  try {
    const stmt = db.prepare(`
      SELECT u.id, u.name, u.email, u.image, u.role as user_role, ou.role as org_role
      FROM users u
      JOIN organization_users ou ON u.id = ou.user_id
      WHERE ou.organization_id = ?
    `);

    const users = stmt.all(organizationId);
    return users;
  } catch (error) {
    console.error('Failed to get organization users:', error);
    return [];
  }
};
