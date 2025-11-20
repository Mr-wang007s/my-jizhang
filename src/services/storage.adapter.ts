import Taro from '@tarojs/taro';

/**
 * Storage adapter interface for platform independence
 */
export interface StorageAdapter {
  get<T = any>(collection: string, query?: any): Promise<T[]>;
  getById<T = any>(collection: string, id: string): Promise<T | null>;
  create<T = any>(collection: string, data: any): Promise<T>;
  update<T = any>(collection: string, id: string, data: any): Promise<T>;
  delete(collection: string, id: string): Promise<void>;
  count(collection: string, query?: any): Promise<number>;
}

/**
 * WeChat Cloud Database adapter
 */
export class WeAppCloudAdapter implements StorageAdapter {
  private db: any;

  constructor() {
    if (process.env.TARO_ENV === 'weapp') {
      this.db = Taro.cloud.database();
    }
  }

  async get<T = any>(collection: string, query?: any): Promise<T[]> {
    const col = this.db.collection(collection);
    const result = await (query ? col.where(query) : col).get();
    return result.data as T[];
  }

  async getById<T = any>(collection: string, id: string): Promise<T | null> {
    const result = await this.db.collection(collection).doc(id).get();
    return result.data as T | null;
  }

  async create<T = any>(collection: string, data: any): Promise<T> {
    const result = await this.db.collection(collection).add({ data });
    return { ...data, _id: result._id } as T;
  }

  async update<T = any>(collection: string, id: string, data: any): Promise<T> {
    await this.db.collection(collection).doc(id).update({ data });
    const updated = await this.getById<T>(collection, id);
    return updated!;
  }

  async delete(collection: string, id: string): Promise<void> {
    await this.db.collection(collection).doc(id).remove();
  }

  async count(collection: string, query?: any): Promise<number> {
    const col = this.db.collection(collection);
    const result = await (query ? col.where(query) : col).count();
    return result.total;
  }
}

/**
 * Local storage adapter (fallback for H5 and other platforms)
 */
export class LocalStorageAdapter implements StorageAdapter {
  private getCollectionData<T>(collection: string): T[] {
    try {
      const data = Taro.getStorageSync(collection);
      return data && Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  private setCollectionData<T>(collection: string, data: T[]): void {
    try {
      Taro.setStorageSync(collection, data);
    } catch (e) {
      console.error('Failed to set storage:', e);
    }
  }

  async get<T = any>(collection: string, query?: any): Promise<T[]> {
    let data = this.getCollectionData<T>(collection);

    // Simple query filtering (basic implementation)
    if (query) {
      data = data.filter((item: any) => {
        return Object.keys(query).every((key) => item[key] === query[key]);
      });
    }

    return data;
  }

  async getById<T = any>(collection: string, id: string): Promise<T | null> {
    const data = this.getCollectionData<T>(collection);
    const item = data.find((item: any) => item._id === id);
    return item || null;
  }

  async create<T = any>(collection: string, data: any): Promise<T> {
    const collectionData = this.getCollectionData(collection);
    const newItem = {
      ...data,
      _id: `${collection}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    collectionData.push(newItem);
    this.setCollectionData(collection, collectionData);
    return newItem as T;
  }

  async update<T = any>(collection: string, id: string, data: any): Promise<T> {
    const collectionData = this.getCollectionData(collection);
    const index = collectionData.findIndex((item: any) => item._id === id);

    if (index === -1) {
      throw new Error(`Item with id ${id} not found`);
    }

    collectionData[index] = { ...(collectionData[index] as any), ...data };
    this.setCollectionData(collection, collectionData);
    return collectionData[index] as T;
  }

  async delete(collection: string, id: string): Promise<void> {
    const collectionData = this.getCollectionData(collection);
    const filtered = collectionData.filter((item: any) => item._id !== id);
    this.setCollectionData(collection, filtered);
  }

  async count(collection: string, query?: any): Promise<number> {
    const data = await this.get(collection, query);
    return data.length;
  }
}

/**
 * Get appropriate storage adapter based on environment
 */
export function getStorageAdapter(): StorageAdapter {
  if (process.env.TARO_ENV === 'weapp') {
    return new WeAppCloudAdapter();
  }
  return new LocalStorageAdapter();
}
