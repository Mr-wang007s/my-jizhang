/**
 * SQLite Database Schema
 * Defines tables for Transaction, Category, and Metadata
 */

export const SCHEMA_VERSION = 1

/**
 * SQL statements to create tables
 */
export const CREATE_TABLES = `
  -- Category table
  CREATE TABLE IF NOT EXISTS category (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK(type IN ('income', 'expense', 'both')),
    icon TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  -- Create index on category type
  CREATE INDEX IF NOT EXISTS idx_category_type ON category(type);

  -- Transaction table
  CREATE TABLE IF NOT EXISTS transaction (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL CHECK(amount >= 0),
    type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
    date TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    note TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category(id)
  );

  -- Create indexes for common queries
  CREATE INDEX IF NOT EXISTS idx_transaction_date ON transaction(date);
  CREATE INDEX IF NOT EXISTS idx_transaction_type ON transaction(type);
  CREATE INDEX IF NOT EXISTS idx_transaction_category ON transaction(category_id);

  -- Metadata table for app configuration
  CREATE TABLE IF NOT EXISTS metadata (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  -- Insert initial metadata
  INSERT OR IGNORE INTO metadata (key, value) VALUES ('schema_version', '${SCHEMA_VERSION}');
  INSERT OR IGNORE INTO metadata (key, value) VALUES ('default_time_range', 'this_month');
  INSERT OR IGNORE INTO metadata (key, value) VALUES ('default_analytics_view', 'monthly_expense_trend');
`

/**
 * Migration functions for future schema changes
 */
export const MIGRATIONS: Record<number, string> = {
  // Future migrations will be added here
  // Example:
  // 2: 'ALTER TABLE transaction ADD COLUMN tags TEXT;'
}

/**
 * Check if migration is needed
 */
export async function needsMigration(currentVersion: number): Promise<boolean> {
  return currentVersion < SCHEMA_VERSION
}

/**
 * Apply pending migrations
 */
export async function applyMigrations(
  executeSql: (sql: string) => Promise<void>,
  fromVersion: number
): Promise<void> {
  for (let version = fromVersion + 1; version <= SCHEMA_VERSION; version++) {
    const migration = MIGRATIONS[version]
    if (migration) {
      await executeSql(migration)
    }
  }
  await executeSql(
    `UPDATE metadata SET value = '${SCHEMA_VERSION}' WHERE key = 'schema_version'`
  )
}
