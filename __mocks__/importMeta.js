Object.defineProperty(global, 'import.meta', {
  value: {
    env: {
      VITE_GOOGLE_CLIENT_ID: 'test_client_id',
      VITE_GOOGLE_REDIRECT_URI: 'test_redirect_uri',
    },
  },
  writable: true,
});