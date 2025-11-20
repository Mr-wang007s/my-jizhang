/**
 * Database connection wrapper and query utilities for SQLite
 * 
 * Note: This implementation provides a mock/interface for SQLite operations.
 * The actual SQLite plugin integration will depend on the target platform:
 * - For WeChat Mini Program: use wx.cloud or third-party SQLite plugins
 * - For H5: use sql.js or IndexedDB wrapper
 * - For Native: use platform-specific SQLite plugins
 */

import { CREATE_TABLES, applyMigrations, needsMigration } from './schema'

export interface DatabaseConfig {
  name: string
  location?: string
}

export interface QueryResult {
  rows: any[]
  rowsAffected: number
  insertId?: number
}

/**
 * Database class for managing SQLite operations
 */
class Database {
  private db: any = null
  private initialized = false

  /**
   * Initialize database connection and create tables
   */
  async init(config: DatabaseConfig = { name: 'jizhang.db' }): Promise<void> {
    if (this.initialized) {
      return
    }

    try {
      // TODO: Platform-specific database initialization
      // This is a placeholder that needs to be replaced with actual SQLite implementation
      // For example:
      // - WeChat: use wx.cloud.database() or SQLite plugin
      // - H5: use sql.js or IndexedDB
      // - Native: use @tarojs/plugin-platform-*'s native SQLite
      
      console.log('[Database] Initializing database:', config.name)

      // For now, use in-memory storage as mock
      this.db = this.createMockDb()

      // Create tables
      await this.executeSql(CREATE_TABLES)

      // Check and apply migrations
      const versionResult = await this.executeSql(
        "SELECT value FROM metadata WHERE key = 'schema_version'"
      )
      const currentVersion = versionResult.rows.length > 0 
        ? parseInt(versionResult.rows[0].value) 
        : 0

      if (await needsMigration(currentVersion)) {
        await applyMigrations((sql) => this.executeSql(sql), currentVersion)
      }

      this.initialized = true
      console.log('[Database] Database initialized successfully')
    } catch (error) {
      console.error('[Database] Initialization failed:', error)
      throw new Error(`Database initialization failed: ${error}`)
    }
  }

  /**
   * Execute SQL query
   */
  async executeSql(sql: string, params: any[] = []): Promise<QueryResult> {
    if (!this.initialized && !sql.includes('CREATE TABLE')) {
      throw new Error('Database not initialized. Call init() first.')
    }

    try {
      // TODO: Replace with actual SQLite query execution
      // For now, use mock implementation
      return this.executeMockSql(sql, params)
    } catch (error) {
      console.error('[Database] Query execution failed:', sql, error)
      throw error
    }
  }

  /**
   * Execute SELECT query and return results
   */
  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const result = await this.executeSql(sql, params)
    return result.rows as T[]
  }

  /**
   * Execute INSERT query and return inserted ID
   */
  async insert(sql: string, params: any[] = []): Promise<number> {
    const result = await this.executeSql(sql, params)
    return result.insertId || 0
  }

  /**
   * Execute UPDATE query and return affected rows count
   */
  async update(sql: string, params: any[] = []): Promise<number> {
    const result = await this.executeSql(sql, params)
    return result.rowsAffected
  }

  /**
   * Execute DELETE query and return affected rows count
   */
  async delete(sql: string, params: any[] = []): Promise<number> {
    const result = await this.executeSql(sql, params)
    return result.rowsAffected
  }

  /**
   * Begin transaction
   */
  async beginTransaction(): Promise<void> {
    await this.executeSql('BEGIN TRANSACTION')
  }

  /**
   * Commit transaction
   */
  async commit(): Promise<void> {
    await this.executeSql('COMMIT')
  }

  /**
   * Rollback transaction
   */
  async rollback(): Promise<void> {
    await this.executeSql('ROLLBACK')
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    if (this.db) {
      // TODO: Close actual database connection
      this.db = null
      this.initialized = false
      console.log('[Database] Database connection closed')
    }
  }

  // ===== Mock Implementation =====
  // The following methods are for development/testing only
  // Replace with actual SQLite implementation for production

  private createMockDb(): any {
    return {
      tables: new Map<string, any[]>()
    }
  }

  private executeMockSql(sql: string, params: any[] = []): QueryResult {
    // This is a simplified mock - replace with actual SQLite for production
    const sqlLower = sql.toLowerCase().trim()

    if (sqlLower.startsWith('create table') || sqlLower.startsWith('create index')) {
      return { rows: [], rowsAffected: 0 }
    }

    if (sqlLower.startsWith('insert')) {
      const match = sql.match(/insert\s+(?:or\s+ignore\s+)?into\s+(\w+)/i)
      const tableName = match ? match[1] : 'unknown'
      if (!this.db.tables.has(tableName)) {
        this.db.tables.set(tableName, [])
      }
      const rows = this.db.tables.get(tableName)
      const insertId = rows.length + 1
      rows.push({ id: insertId, ...params })
      return { rows: [], rowsAffected: 1, insertId }
    }

    if (sqlLower.startsWith('select')) {
      const match = sql.match(/from\s+(\w+)/i)
      const tableName = match ? match[1] : 'unknown'
      const rows = this.db.tables.get(tableName) || []
      return { rows, rowsAffected: 0 }
    }

    return { rows: [], rowsAffected: 0 }
  }
}

// Export singleton instance
export const db = new Database()

// Export for testing
export { Database }
