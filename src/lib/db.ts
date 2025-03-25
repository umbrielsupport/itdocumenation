import Database from 'better-sqlite3';
import { join } from 'path';

// Create or connect to SQLite database
const db = new Database(join(process.cwd(), 'itdoc.db'));

// Initialize the database with necessary tables
function initializeDatabase() {
  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      image TEXT,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create organizations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      industry TEXT,
      logo TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create organization_users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS organization_users (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      role TEXT DEFAULT 'member',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(organization_id, user_id),
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create asset_types table
  db.exec(`
    CREATE TABLE IF NOT EXISTS asset_types (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT,
      organization_id TEXT NOT NULL,
      fields TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(organization_id, name),
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
    )
  `);

  // Create assets table
  db.exec(`
    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      asset_type_id TEXT NOT NULL,
      organization_id TEXT NOT NULL,
      data TEXT DEFAULT '{}',
      status TEXT DEFAULT 'active',
      created_by_id TEXT NOT NULL,
      updated_by_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (asset_type_id) REFERENCES asset_types(id),
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
      FOREIGN KEY (created_by_id) REFERENCES users(id),
      FOREIGN KEY (updated_by_id) REFERENCES users(id)
    )
  `);

  // Create folders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS folders (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      parent_id TEXT,
      organization_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES folders(id),
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
    )
  `);

  // Create documents table
  db.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      organization_id TEXT NOT NULL,
      folder_id TEXT,
      is_public BOOLEAN DEFAULT 0,
      created_by_id TEXT NOT NULL,
      updated_by_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
      FOREIGN KEY (folder_id) REFERENCES folders(id),
      FOREIGN KEY (created_by_id) REFERENCES users(id),
      FOREIGN KEY (updated_by_id) REFERENCES users(id)
    )
  `);

  // Create document_assets table
  db.exec(`
    CREATE TABLE IF NOT EXISTS document_assets (
      id TEXT PRIMARY KEY,
      document_id TEXT NOT NULL,
      asset_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(document_id, asset_id),
      FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
      FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
    )
  `);

  // Create passwords table
  db.exec(`
    CREATE TABLE IF NOT EXISTS passwords (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      username TEXT,
      password TEXT NOT NULL,
      url TEXT,
      notes TEXT,
      organization_id TEXT NOT NULL,
      created_by_id TEXT NOT NULL,
      updated_by_id TEXT NOT NULL,
      category TEXT,
      tags TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
      FOREIGN KEY (created_by_id) REFERENCES users(id),
      FOREIGN KEY (updated_by_id) REFERENCES users(id)
    )
  `);
}

// Initialize the database
initializeDatabase();

export { db };
