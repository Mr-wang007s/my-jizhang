const mockStorage: Record<string, any> = {}

export default {
  setStorageSync: (key: string, data: any) => {
    mockStorage[key] = data
  },
  getStorageSync: (key: string) => mockStorage[key],
  removeStorageSync: (key: string) => {
    delete mockStorage[key]
  },
  showToast: jest.fn(),
  navigateTo: jest.fn(),
  navigateBack: jest.fn(),
  cloud: {
    init: jest.fn(),
    database: jest.fn(() => ({
      collection: jest.fn(() => ({
        add: jest.fn(),
        get: jest.fn(),
        where: jest.fn(() => ({
          get: jest.fn(),
          orderBy: jest.fn(() => ({
            get: jest.fn(),
            skip: jest.fn(() => ({
              limit: jest.fn(() => ({
                get: jest.fn()
              }))
            }))
          }))
        })),
        orderBy: jest.fn(() => ({
          get: jest.fn(),
          skip: jest.fn(() => ({
            limit: jest.fn(() => ({
              get: jest.fn()
            }))
          }))
        })),
        doc: jest.fn(() => ({
          update: jest.fn(),
          remove: jest.fn(),
          get: jest.fn()
        })),
      })),
      command: {
        gte: jest.fn((val) => ({ gte: val })),
        lte: jest.fn((val) => ({ lte: val })),
        and: jest.fn((val) => ({ and: val }))
      }
    }))
  }
}
