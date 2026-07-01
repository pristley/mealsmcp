/**
 * MealDB API Client
 * Minimal fetch-based HTTP client for TheMealDB API
 */

import {
  sanitizeSearchQuery,
  sanitizeCategory,
  sanitizeIngredient,
  validateMealId,
  validateHttpStatus,
  ValidationError,
} from "../utils/validation.js";
import { config } from "../config.js";

const BASE_URL = config.mealdbApiUrl;

// Type definitions for API responses
interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb?: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  [key: string]: unknown;
}

interface CategoryMeal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

interface IngredientMeal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

interface SearchResponse {
  meals: Meal[] | null;
}

interface RandomResponse {
  meals: Meal[];
}

interface CategoryResponse {
  meals: CategoryMeal[] | null;
}

interface IngredientResponse {
  meals: IngredientMeal[] | null;
}

interface MealDetailsResponse {
  meals: Meal[] | null;
}

/**
 * Custom error class for API failures
 */
class MealDBError extends Error {
  constructor(
    public code: string,
    message: string
  ) {
    super(message);
    this.name = "MealDBError";
  }
}

/**
 * Search for a meal by name
 */
export async function searchMeal(name: string): Promise<Meal[]> {
  try {
    const sanitized = sanitizeSearchQuery(name);

    const response = await fetch(
      `${BASE_URL}/search.php?s=${encodeURIComponent(sanitized)}`
    );

    validateHttpStatus(response.status, "/search.php");

    const data: SearchResponse = await response.json();
    return data.meals ?? [];
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new MealDBError("VALIDATION_ERROR", error.message);
    }
    if (error instanceof MealDBError) {
      throw error;
    }
    throw new MealDBError(
      "FETCH_ERROR",
      `Failed to search meals: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Get a random meal
 */
export async function getRandomMeal(): Promise<Meal> {
  try {
    const response = await fetch(`${BASE_URL}/random.php`);

    if (!response.ok) {
      throw new MealDBError(
        "HTTP_ERROR",
        `HTTP ${response.status}: ${response.statusText}`
      );
    }

    const data: RandomResponse = await response.json();

    if (!data.meals || data.meals.length === 0) {
      throw new MealDBError("NO_DATA", "No random meal available");
    }

    return data.meals[0];
  } catch (error) {
    if (error instanceof MealDBError) {
      throw error;
    }
    throw new MealDBError(
      "FETCH_ERROR",
      `Failed to get random meal: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Get meals by category
 */
export async function getMealsByCategory(category: string): Promise<CategoryMeal[]> {
  try {
    const sanitized = sanitizeCategory(category);

    const response = await fetch(
      `${BASE_URL}/filter.php?c=${encodeURIComponent(sanitized)}`
    );

    validateHttpStatus(response.status, "/filter.php?c");

    const data: CategoryResponse = await response.json();
    return data.meals ?? [];
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new MealDBError("VALIDATION_ERROR", error.message);
    }
    if (error instanceof MealDBError) {
      throw error;
    }
    throw new MealDBError(
      "FETCH_ERROR",
      `Failed to get meals by category: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Get meals by ingredient
 */
export async function getMealsByIngredient(ingredient: string): Promise<IngredientMeal[]> {
  try {
    const sanitized = sanitizeIngredient(ingredient);

    const response = await fetch(
      `${BASE_URL}/filter.php?i=${encodeURIComponent(sanitized)}`
    );

    validateHttpStatus(response.status, "/filter.php?i");

    const data: IngredientResponse = await response.json();
    return data.meals ?? [];
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new MealDBError("VALIDATION_ERROR", error.message);
    }
    if (error instanceof MealDBError) {
      throw error;
    }
    throw new MealDBError(
      "FETCH_ERROR",
      `Failed to get meals by ingredient: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Get meal details by ID
 */
export async function getMealById(id: string): Promise<Meal | null> {
  try {
    const validatedId = validateMealId(id);

    const response = await fetch(
      `${BASE_URL}/lookup.php?i=${encodeURIComponent(validatedId)}`
    );

    validateHttpStatus(response.status, "/lookup.php");

    const data: MealDetailsResponse = await response.json();

    if (!data.meals || data.meals.length === 0) {
      return null;
    }

    return data.meals[0];
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new MealDBError("VALIDATION_ERROR", error.message);
    }
    if (error instanceof MealDBError) {
      throw error;
    }
    throw new MealDBError(
      "FETCH_ERROR",
      `Failed to get meal details: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export { MealDBError, Meal, CategoryMeal, IngredientMeal };
