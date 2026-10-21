export type MockMode = 'normal' | 'slow' | 'error' | 'empty';

let currentMode: MockMode = 'normal';

export function getMockMode(): MockMode {
  return currentMode;
}

export function setMockMode(mode: MockMode): void {
  currentMode = mode;
}
