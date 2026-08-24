/**
 * Home
 */
export const HOME_ROUTE = '/';

/**
 * Data Fetching page
 */
export const DATA_FETCHING_ROUTE = '/data-fetching';

/**
 * Data Mutation page
 */
export const DATA_MUTATION_ROUTE = '/data-mutation';

/**
 * Protected page accessible only to authenticated users
 */
export const PROTECTED_ROUTE = '/protected';

/**
 * Practice page
 */
export const PRACTICE_ROUTE = '/practice';

/**
 * Where user is redirected after signing in on Identity Provider's page
 * This route contains an authorization code which is used to exchange for an access token
 */
export const SIGN_IN_REDIRECT_ROUTE = '/auth/signed-in';

/**
 * Where user is redirected after signing out
 */
export const SIGN_OUT_REDIRECT_ROUTE = '/auth/signed-out';
