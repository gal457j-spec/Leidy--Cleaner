/**
 * Utilities for converting snake_case database fields to camelCase for API response
 */
/**
 * Recursively convert object keys from snake_case to camelCase
 * Useful for converting database column names to API response format
 *
 * @example
 * camelize({ first_name: 'John', last_updated: '2024-01-01' })
 * // { firstName: 'John', lastUpdated: '2024-01-01' }
 */
export declare function camelize(obj: any): any;
/**
 * Convert object keys from camelCase to snake_case
 * Useful for converting API request data to database column names
 *
 * @example
 * snakeify({ firstName: 'John', lastUpdated: '2024-01-01' })
 * // { first_name: 'John', last_updated: '2024-01-01' }
 */
export declare function snakeify(obj: any): any;
//# sourceMappingURL=transformers.d.ts.map