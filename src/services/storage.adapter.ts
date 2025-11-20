/**
 * Storage adapter abstraction for platform independence
 * Supports both WeChat Cloud Database and local storage
 */

import Taro from '@tarojs/taro'

export interface StorageAdapter {
  // Basic CRUD operations
  get<T>(collection: string, query?: any): Promise<T[]>
  getById<T>(collection: string, id: string): Promise<T | null>
  create<T>(collection: string, data: any): Promise<T>
  update<T>(collection: string, id: string, data: any): Promise<T>
  delete(collection: string, id: string): Promise<void>
  
  // Utility methods
  count(collection: string, query?: any): Promise<number>
}

/**
 * WeChat Cloud Database Adapter
 */
export class CloudDBAdapter implements StorageAdapter {
  private db: any

  constructor() {
    if (process.env.TARO_ENV === 'weapp') {
      this.db = Taro.cloud.database()
    }
  }

  async get<T>(collection: string, query: any = {}): Promise<T[]> {
    const result = await this.db
      .collection(collection)
      .where(query)
      .get()
    
    return result.data as T[]
  }

  async getById<T>(collection: string, id: string): Promise<T | null> {
    const result = await this.db
      .collection(collection)
      .doc(id)
      .get()
    
    return result.data ? (result.data as T) : null
  }

  async create<T>(collection: string, data: any): Promise<T> {
    const result = await this.db
      .collection(collection)
      .add({ data })
    
    return {
      _id: result._id,
      ...data
    } as T
  }

  async update<T>(collection: string, id: string, data: any): Promise<T> {
    await this.db
      .collection(collection)
      .doc(id)
      .update({ data })
    
    // Return updated document
    const updated = await this.getById<T>(collection, id)
    return updated!
  }

  async delete(collection: string, id: string): Promise<void> {
    await this.db
      .collection(collection)
      .doc(id)
      .remove()
  }

  async count(collection: string, query: any = {}): Promise<number> {
    const result = await this.db
      .collection(collection)
      .where(query)
      .count()
    
    return result.total
  }
}

/**
 * Local Storage Adapter (fallback for H5 or development)
 */
export class LocalStorageAdapter implements StorageAdapter {
  private getCollectionData<T>(collection: string): T[] {
    try {
      const data = Taro.getStorageSync(collection)
      return data || []
    } catch (e) {
      console.error(`Failed to get collection ${collection}:`, e)
      return []
    }
  }

  private setCollectionData<T>(collection: string, data: T[]): void {
    try {
      Taro.setStorageSync(collection, data)
    } catch (e) {
      console.error(`Failed to set collection ${collection}:`, e)
    }
  }

  async get<T>(collection: string, query?: any): Promise<T[]> {
    let data = this.getCollectionData<T>(collection)
    
    // Simple query matching (only supports exact matches)
    if (query && Object.keys(query).length > 0) {
      data = data.filter((item: any) => {
        return Object.keys(query).every(key => {
          if (typeof query[key] === 'object' && query[key].$gte && query[key].$lte) {
            // Simple date range query
            return item[key] >= query[key].$gte && item[key] <= query[key].$lte
          }
          return item[key] === query[key]
        })
      })
    }
    
    return data
  }

  async getById<T>(collection: string, id: string): Promise<T | null> {
    const data = this.getCollectionData<T>(collection)
    const found = data.find((item: any) => item._id === id)
    return found ? (found as T) : null
  }

  async create<T>(collection: string, data: any): Promise<T> {
    const collectionData = this.getCollectionData<T>(collection)
    
    // Generate ID if not provided
    const id = data._id || `${collection}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newItem = {
      _id: id,
      ...data
    } as T
    
    collectionData.push(newItem)
    this.setCollectionData(collection, collectionData)
    
    return newItem
  }

  async update<T>(collection: string, id: string, data: any): Promise<T> {
    const collectionData = this.getCollectionData<T>(collection)
    const index = collectionData.findIndex((item: any) => item._id === id)
    
    if (index === -1) {
      throw new Error(`Document with id ${id} not found in collection ${collection}`)
    }
    
    collectionData[index] = {
      ...collectionData[index],
      ...data
    } as T
    
    this.setCollectionData(collection, collectionData)
    return collectionData[index]
  }

  async delete(collection: string, id: string): Promise<void> {
    const collectionData = this.getCollectionData(collection)
    const filtered = collectionData.filter((item: any) => item._id !== id)
    this.setCollectionData(collection, filtered)
  }

  async count(collection: string, query?: any): Promise<number> {
    const data = await this.get(collection, query)
    return data.length
  }
}

/**
 * Factory function to create the appropriate storage adapter
 */
export function createStorageAdapter(): StorageAdapter {
  // Use Cloud DB for WeChat mini-program, local storage for H5/development
  if (process.env.TARO_ENV === 'weapp') {
    return new CloudDBAdapter()
  } else {
    return new LocalStorageAdapter()
  }
}

// Export singleton instance
export const storageAdapter = createStorageAdapter()
