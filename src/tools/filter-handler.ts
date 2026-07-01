/**
 * Filter Meal Tool Handlers
 * Handles mealsByCategory and mealsByIngredient tool requests
 */

import {
  getMealsByCategory as getMealsByCategoryAPI,
  getMealsByIngredient as getMealsByIngredientAPI,
  CategoryMeal,
  IngredientMeal,
} from "../api/mealdb-client.js";

interface TextContent {
  type: "text";
  text: string;
}

interface ToolResponse {
  content: TextContent[];
  isError?: boolean;
}

/**
 * Format meal for filter results
 */
function formatFilterMeal(meal: CategoryMeal | IngredientMeal): string {
  return `- **${meal.strMeal}** (ID: ${meal.idMeal})${
    meal.strMealThumb ? `\n  Image: ${meal.strMealThumb}` : ""
  }`;
}

/**
 * Handle meals by category requests
 */
export async function handleMealsByCategory(args: {
  category: string;
}): Promise<ToolResponse> {
  try {
    const meals = await getMealsByCategoryAPI(args.category);

    if (meals.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No meals found in category "${args.category}"`,
          },
        ],
      };
    }

    const topMeals = meals.slice(0, 10);
    const mealList = topMeals.map(formatFilterMeal).join("\n\n");

    return {
      content: [
        {
          type: "text",
          text: `Found ${meals.length} meals in "${args.category}" category. Showing top 10:\n\n${mealList}`,
        },
      ],
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      content: [
        {
          type: "text",
          text: `Error fetching meals by category: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Handle meals by ingredient requests
 */
export async function handleMealsByIngredient(args: {
  ingredient: string;
}): Promise<ToolResponse> {
  try {
    const meals = await getMealsByIngredientAPI(args.ingredient);

    if (meals.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No meals found with ingredient "${args.ingredient}"`,
          },
        ],
      };
    }

    const topMeals = meals.slice(0, 10);
    const mealList = topMeals.map(formatFilterMeal).join("\n\n");

    return {
      content: [
        {
          type: "text",
          text: `Found ${meals.length} meals with "${args.ingredient}" ingredient. Showing top 10:\n\n${mealList}`,
        },
      ],
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      content: [
        {
          type: "text",
          text: `Error fetching meals by ingredient: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}
