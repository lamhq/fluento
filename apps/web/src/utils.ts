export function getAbsoluteURL(route: string) {
  return `${window.location.protocol}//${window.location.host}${route}`;
}

export function getEnv(key: string, defaultValue?: string): string {
  const value = import.meta.env[key];
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}
