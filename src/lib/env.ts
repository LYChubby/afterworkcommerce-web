function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value.replace(/\/+$/, "");
}

export const env = {
  get apiBaseUrl(): string {
    return getRequiredEnv("API_BASE_URL");
  },
};
