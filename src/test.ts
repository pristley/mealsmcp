/**
 * Test Script for Meals MCP Server
 * Tests all 5 tools with sample requests and validates responses
 * 
 * Run with: npm run test
 */

import { handleSearchMeal, handleRandomMeal } from "./tools/search-handler.js";
import {
  handleMealsByCategory,
  handleMealsByIngredient,
} from "./tools/filter-handler.js";
import { handleGetMealDetails } from "./tools/details-handler.js";

interface ToolResponse {
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
}

/**
 * Validate response structure
 */
function validateResponse(
  response: unknown,
  toolName: string
): response is ToolResponse {
  if (!response || typeof response !== "object") {
    console.error(`❌ ${toolName}: Response is not an object`);
    return false;
  }

  const resp = response as Record<string, unknown>;

  if (!Array.isArray(resp.content)) {
    console.error(`❌ ${toolName}: Missing or invalid 'content' array`);
    return false;
  }

  if (resp.content.length === 0) {
    console.error(`❌ ${toolName}: Content array is empty`);
    return false;
  }

  const firstItem = resp.content[0];
  if (
    !firstItem ||
    typeof firstItem !== "object" ||
    !("type" in firstItem) ||
    !("text" in firstItem)
  ) {
    console.error(
      `❌ ${toolName}: Content items must have 'type' and 'text' fields`
    );
    return false;
  }

  return true;
}

/**
 * Test a tool and log results
 */
async function testTool(
  name: string,
  handler: () => Promise<ToolResponse>,
  expectSuccess: boolean = true
): Promise<void> {
  try {
    const response = await handler();

    if (!validateResponse(response, name)) {
      return;
    }

    if (expectSuccess && response.isError) {
      console.error(`⚠️  ${name}: Returned error response`);
    } else if (!expectSuccess && !response.isError) {
      console.warn(`⚠️  ${name}: Expected error but got success`);
    }

    const textLength = response.content[0].text.length;
    console.log(
      `✅ ${name}: ${textLength} chars | Error: ${response.isError ? "yes" : "no"}`
    );
    console.log(`   Preview: ${response.content[0].text.substring(0, 80)}...`);
  } catch (error) {
    console.error(
      `❌ ${name}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Run all tests
 */
async function runTests(): Promise<void> {
  console.log("\n🍽️  Meals MCP Server - Tool Test Suite\n");
  console.log("=" * 60);

  // Test 1: Search Meal
  console.log("\n1️⃣  Testing search_meal (searching for 'pasta')...");
  await testTool("search_meal", () =>
    handleSearchMeal({ name: "pasta" })
  );

  // Test 2: Random Meal
  console.log("\n2️⃣  Testing random_meal...");
  await testTool("random_meal", () => handleRandomMeal());

  // Test 3: Meals by Category
  console.log("\n3️⃣  Testing meals_by_category (category: 'Seafood')...");
  await testTool("meals_by_category", () =>
    handleMealsByCategory({ category: "Seafood" })
  );

  // Test 4: Meals by Ingredient
  console.log("\n4️⃣  Testing meals_by_ingredient (ingredient: 'chicken')...");
  await testTool("meals_by_ingredient", () =>
    handleMealsByIngredient({ ingredient: "chicken" })
  );

  // Test 5: Get Meal Details (use a known meal ID)
  console.log("\n5️⃣  Testing get_meal_details (meal_id: '52959')...");
  await testTool("get_meal_details", () =>
    handleGetMealDetails({ meal_id: "52959" })
  );

  // Test 6: Error Handling - Empty Search
  console.log("\n⚠️  Testing error handling (empty search query)...");
  await testTool(
    "search_meal (empty)",
    () => handleSearchMeal({ name: "" }),
    false
  );

  // Test 7: Error Handling - Invalid Meal ID
  console.log("\n⚠️  Testing error handling (invalid meal ID)...");
  await testTool(
    "get_meal_details (invalid)",
    () => handleGetMealDetails({ meal_id: "invalid" }),
    false
  );

  console.log("\n" + "=" * 60);
  console.log("\n✨ Test suite complete!\n");
}

// Run tests
runTests().catch((error) => {
  console.error("Test suite error:", error);
  process.exit(1);
});
