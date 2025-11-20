const mockStorage: Record<string, any> = {};

const Taro = {
  // Storage APIs
  setStorageSync: (key: string, data: any) => {
    mockStorage[key] = data;
  },
  getStorageSync: (key: string) => mockStorage[key],
  removeStorageSync: (key: string) => {
    delete mockStorage[key];
  },
  clearStorageSync: () => {
    Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
  },

  // UI APIs
  showToast: jest.fn(),
  showLoading: jest.fn(),
  hideLoading: jest.fn(),
  showModal: jest.fn(() => Promise.resolve({ confirm: true })),

  // Navigation APIs
  navigateTo: jest.fn(),
  redirectTo: jest.fn(),
  navigateBack: jest.fn(),
  switchTab: jest.fn(),

  // Cloud APIs
  cloud: {
    init: jest.fn(),
    database: jest.fn(() => ({
      collection: jest.fn(() => ({
        add: jest.fn(() => Promise.resolve({ _id: 'mock-id' })),
        get: jest.fn(() => Promise.resolve({ data: [] })),
        doc: jest.fn(() => ({
          get: jest.fn(() => Promise.resolve({ data: {} })),
          update: jest.fn(() => Promise.resolve({})),
          remove: jest.fn(() => Promise.resolve({})),
        })),
        where: jest.fn(function(this: any) {
          return this;
        }),
        orderBy: jest.fn(function(this: any) {
          return this;
        }),
        skip: jest.fn(function(this: any) {
          return this;
        }),
        limit: jest.fn(function(this: any) {
          return this;
        }),
      })),
      command: {
        gte: jest.fn((val) => val),
        lte: jest.fn((val) => val),
        and: jest.fn(function(this: any, val: any) {
          return val;
        }),
      },
    })),
  },

  // Lifecycle hooks (for testing)
  useLaunch: jest.fn((fn) => fn()),
  useDidShow: jest.fn(),
  useDidHide: jest.fn(),
};

export default Taro;
