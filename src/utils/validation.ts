/**
 * Input Validation Utilities
 * Validates and sanitizes inputs before API calls
 */

/**
 * Custom validation error class
 */
export class ValidationError extends Error {
  constructor(
    public field: string,
    message: string
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Validates that a value is a non-empty string
 */
export function validateString(
  value: unknown,
  fieldName: string,
  maxLength: number = 100
): string {
  if (typeof value !== "string") {
    throw new ValidationError(
      fieldName,
      `${fieldName} must be a string, got ${typeof value}`
    );
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    throw new ValidationError(fieldName, `${fieldName} cannot be empty`);
  }

  if (trimmed.length > maxLength) {
    throw new ValidationError(
      fieldName,
      `${fieldName} must be ${maxLength} characters or less`
    );
  }

  return trimmed;
}

/**
 * Sanitizes a search query string
 * Removes/escapes potentially problematic characters
 */
export function sanitizeSearchQuery(query: string): string {
  const sanitized = validateString(query, "Search query", 50);
  // Remove leading/trailing special chars and multiple spaces
  return sanitized.replace(/\s+/g, " ").replace(/[<>]/g, "");
}

/**
 * Sanitizes category string
 * Categories should be simple alphanumeric
 */
export function sanitizeCategory(category: string): string {
  const sanitized = validateString(category, "Category", 50);
  // Allow alphanumeric, spaces, and hyphens
  if (!/^[a-zA-Z0-9\s\-]+$/.test(sanitized)) {
    throw new ValidationError(
      "category",
      "Category can only contain letters, numbers, spaces, and hyphens"
    );
  }
  return sanitized;
}

/**
 * Sanitizes ingredient string
 * Similar to category - simple alphanumeric
 */
export function sanitizeIngredient(ingredient: string): string {
  const sanitized = validateString(ingredient, "Ingredient", 50);
  // Allow alphanumeric, spaces, commas, and hyphens
  if (!/^[a-zA-Z0-9\s\-,]+$/.test(sanitized)) {
    throw new ValidationError(
      "ingredient",
      "Ingredient can only contain letters, numbers, spaces, hyphens, and commas"
    );
  }
  return sanitized;
}

/**
 * Validates meal ID format
 * Should be numeric string
 */
export function validateMealId(id: unknown): string {
  const stringId = validateString(id, "Meal ID", 20);

  if (!/^\d+$/.test(stringId)) {
    throw new ValidationError(
      "meal_id",
      "Meal ID must be a numeric identifier"
    );
  }

  return stringId;
}

/**
 * Check if response indicates a 404/not found condition
 * TheMealDB returns null for meals array when no results found
 */
export function isNotFound(mealArray: unknown): boolean {
  return mealArray === null || (Array.isArray(mealArray) && mealArray.length === 0);
}

/**
 * Validates HTTP response status
 */
export function validateHttpStatus(status: number, endpoint: string): void {
  if (status === 404) {
    throw new ValidationError(
      "http",
      `API endpoint not found: ${endpoint}`
    );
  }

  if (status >= 400) {
    throw new ValidationError(
      "http",
      `API returned HTTP ${status}: ${
        status === 429 ? "Rate limited" : "Server error"
      }`
    );
  }
}
