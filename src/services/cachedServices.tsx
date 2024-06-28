class CachedService {
  state: { [x: string]: any };
  constructor() {
    this.state = {};
  }

  initialState(state?: { [x: string]: any }) {
    this.state = state || {};
  }

  setValue<T>(key: string, value: T) {
    this.state[key] = value;
  }

  getValue(key: string) {
    return this.state[key];
  }
}

export default new CachedService();
