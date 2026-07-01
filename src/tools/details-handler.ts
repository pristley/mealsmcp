/**
 * Meal Details Tool Handler
 * Handles getMealDetails tool requests with full recipe information
 */

import { getMealById as getMealByIdAPI, Meal } from "../api/mealdb-client.js";

interface Ingredient {
  ingredient: string;
  measure: string;
}

interface TextContent {
  type: "text";
  text: string;
}

interface ToolResponse {
  content: TextContent[];
  isError?: boolean;
}

/**
 * Extract ingredients from meal data as array of objects
 */
function extractIngredients(meal: Meal): Ingredient[] {
  const ingredients: Ingredient[] = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.toString().trim()) {
      ingredients.push({
        ingredient: ingredient.toString().trim(),
        measure: measure ? measure.toString().trim() : "",
      });
    }
  }

  return ingredients;
}

/**
 * Format ingredients as readable list
 */
function formatIngredientsList(ingredients: Ingredient[]): string {
  return ingredients
    .map(({ ingredient, measure }) => `- ${measure} ${ingredient}`.trim())
    .join("\n");
}

/**
 * Handle get meal details requests
 */
export async function handleGetMealDetails(args: {
  meal_id: string;
}): Promise<ToolResponse> {
  try {
    const meal = await getMealByIdAPI(args.meal_id);

    if (!meal) {
      return {
        content: [
          {
            type: "text",
            text: `Meal not found with ID "${args.meal_id}"`,
          },
        ],
      };
    }

    const ingredients = extractIngredients(meal);

    // Build response with all meal details
    let response = `# ${meal.strMeal}

**Category:** ${meal.strCategory || "N/A"}
**Cuisine:** ${meal.strArea || "N/A"}
**ID:** ${meal.idMeal}

## Ingredients (${ingredients.length})

${formatIngredientsList(ingredients)}

## Instructions

${meal.strInstructions || "No instructions available"}
`;

    // Add YouTube link if available
    if (meal.strYoutube) {
      response += `\n## Video Recipe\n[Watch on YouTube](${meal.strYoutube})`;
    }

    // Add image if available
    if (meal.strMealThumb) {
      response += `\n## Image\n![${meal.strMeal}](${meal.strMealThumb})`;
    }

    return {
      content: [
        {
          type: "text",
          text: response,
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
          text: `Error fetching meal details: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}
