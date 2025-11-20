import '@testing-library/jest-dom'

// Mock Taro API
global.Taro = {
  navigateTo: jest.fn(),
  navigateBack: jest.fn(),
  showToast: jest.fn(),
  showLoading: jest.fn(),
  hideLoading: jest.fn(),
  showModal: jest.fn()
} as any
