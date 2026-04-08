import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

// Use standard local storage on the client, and a dummy noop storage on the Next.js server to prevent SSR crashes.
const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

export default storage;
