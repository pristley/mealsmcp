/**
 * Configuration Module
 * Loads settings from environment or uses sensible defaults
 * No secrets required - this is just for API endpoints and timeouts
 */

/**
 * Parse timeout value from env var (ms)
 */
function parseTimeout(value: string | undefined, defaultValue: number): number {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Configuration object
 */
export const config = {
  /**
   * TheMealDB API base URL
   * Can be overridden with MEALDB_API_URL env var
   */
  mealdbApiUrl: process.env.MEALDB_API_URL || "https://www.themealdb.com/api/json/v1/1",

  /**
   * HTTP request timeout in milliseconds
   * Can be overridden with HTTP_TIMEOUT env var
   * Default: 10 seconds
   */
  httpTimeout: parseTimeout(process.env.HTTP_TIMEOUT, 10000),

  /**
   * Max results to return from search/filter operations
   * Can be overridden with MAX_RESULTS env var
   * Default: 10
   */
  maxResults: parseInt(process.env.MAX_RESULTS || "10", 10),

  /**
   * Max search query length (characters)
   * Can be overridden with MAX_QUERY_LENGTH env var
   * Default: 50
   */
  maxQueryLength: parseInt(process.env.MAX_QUERY_LENGTH || "50", 10),

  /**
   * Enable debug logging
   * Can be set with DEBUG env var (any truthy value)
   * Default: false
   */
  debug: Boolean(process.env.DEBUG),
};

/**
 * Log configuration on startup (if debug enabled)
 */
if (config.debug) {
  console.error("[config] Configuration loaded:", {
    mealdbApiUrl: config.mealdbApiUrl,
    httpTimeout: `${config.httpTimeout}ms`,
    maxResults: config.maxResults,
    maxQueryLength: config.maxQueryLength,
  });
}
