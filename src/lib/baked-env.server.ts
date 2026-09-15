/**
 * Optional production secrets for a direct Vercel file deploy.
 * Override with real Vercel/Neon env vars when those are set.
 * Keep values empty in git — never commit connection strings.
 */
export const bakedDatabaseUrl: string | undefined = undefined;
export const bakedAuthSecret: string | undefined = undefined;
