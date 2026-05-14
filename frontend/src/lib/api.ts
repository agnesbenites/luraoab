const BASE_URL = 'http://10.0.2.2:3333'; // Android emulator → localhost
// const BASE_URL = 'http://localhost:3333'; // Web/iOS

export const api = {
  post: async (path: string, body: object, token?: string) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    return res.json();
  },

  get: async (path: string, token?: string) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return res.json();
  },
};
