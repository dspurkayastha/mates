export const log = (...args: any[]) => {
  if (__DEV__) console.log(...args);
};

export const debug = (channel: string, ...args: any[]) => {
  if (__DEV__ && process.env.EXPO_PUBLIC_DEBUG?.includes(channel)) {
    console.log(`[${channel}]`, ...args);
  }
};
