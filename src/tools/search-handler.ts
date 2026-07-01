/**
 * Search and Random Meal Tool Handlers
 * Handles searchMeal and randomMeal tool requests
 */

import {
  searchMeal as searchMealAPI,
  getRandomMeal as getRandomMealAPI,
  Meal,
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
 * Format meal for search results (compact info)
 */
function formatMealForSearch(meal: Meal): string {
  return `- **${meal.strMeal}** (ID: ${meal.idMeal})${
    meal.strMealThumb ? `\n  Image: ${meal.strMealThumb}` : ""
  }`;
}

/**
 * Format meal for random results (full details)
 */
function formatMealForRandom(meal: Meal): string {
  const ingredients: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.toString().trim()) {
      ingredients.push(`${measure || ""} ${ingredient}`.trim());
    }
  }

  return `**${meal.strMeal}**

**Category:** ${meal.strCategory || "N/A"} | **Area:** ${meal.strArea || "N/A"}

**Ingredients:**
${ingredients.slice(0, 10).map((ing) => `- ${ing}`).join("\n")}
${ingredients.length > 10 ? `- ... and ${ingredients.length - 10} more` : ""}

**Instructions:**
${meal.strInstructions ? meal.strInstructions.substring(0, 300) + (meal.strInstructions.length > 300 ? "..." : "") : "N/A"}

${meal.strMealThumb ? `**Image:** ${meal.strMealThumb}` : ""}`;
}

/**
 * Handle search meal requests
 */
export async function handleSearchMeal(args: {
  name: string;
}): Promise<ToolResponse> {
  try {
    const meals = await searchMealAPI(args.name);

    if (meals.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No meals found matching "${args.name}"`,
          },
        ],
      };
    }

    const topMeals = meals.slice(0, 5);
    const mealList = topMeals.map(formatMealForSearch).join("\n\n");

    return {
      content: [
        {
          type: "text",
          text: `Found ${meals.length} meals for "${args.name}". Top 5:\n\n${mealList}`,
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
          text: `Error searching meals: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Handle random meal requests
 */
export async function handleRandomMeal(): Promise<ToolResponse> {
  try {
    const meal = await getRandomMealAPI();

    const formattedMeal = formatMealForRandom(meal);

    return {
      content: [
        {
          type: "text",
          text: formattedMeal,
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
          text: `Error fetching random meal: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}
