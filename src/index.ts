import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

/**
 * MCP Server for Meals API
 * Provides tools for searching and retrieving meal information
 */

// Tool definitions
const TOOLS: Tool[] = [
  {
    name: "search_meal",
    description: "Search for meals by name",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: {
          type: "string",
          description: "The meal name to search for",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "random_meal",
    description: "Get a random meal",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "meals_by_category",
    description: "Get meals by category",
    inputSchema: {
      type: "object" as const,
      properties: {
        category: {
          type: "string",
          description: "The meal category (e.g., Seafood, Vegetarian, Pasta)",
        },
      },
      required: ["category"],
    },
  },
  {
    name: "meals_by_ingredient",
    description: "Get meals by ingredient",
    inputSchema: {
      type: "object" as const,
      properties: {
        ingredient: {
          type: "string",
          description: "The ingredient to search for",
        },
      },
      required: ["ingredient"],
    },
  },
  {
    name: "get_meal_details",
    description: "Get detailed information about a specific meal",
    inputSchema: {
      type: "object" as const,
      properties: {
        meal_id: {
          type: "string",
          description: "The unique meal ID",
        },
      },
      required: ["meal_id"],
    },
  },
];

// Initialize MCP Server
const server = new Server(
  {
    name: "meals-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * List available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOLS,
  };
});

/**
 * Handle tool calls
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "search_meal":
        return await handleSearchMeal(args as { name: string });
      case "random_meal":
        return await handleRandomMeal();
      case "meals_by_category":
        return await handleMealsByCategory(args as { category: string });
      case "meals_by_ingredient":
        return await handleMealsByIngredient(args as { ingredient: string });
      case "get_meal_details":
        return await handleGetMealDetails(args as { meal_id: string });
      default:
        return {
          content: [
            {
              type: "text",
              text: `Unknown tool: ${name}`,
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      content: [
        {
          type: "text",
          text: `Error executing tool ${name}: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

/**
 * Tool handler stubs - implement handlers in src/tools/
 */

async function handleSearchMeal(args: { name: string }) {
  // TODO: Implement search_meal handler
  return {
    content: [
      {
        type: "text",
        text: `Search meal handler not implemented yet. Query: ${args.name}`,
      },
    ],
  };
}

async function handleRandomMeal() {
  // TODO: Implement random_meal handler
  return {
    content: [
      {
        type: "text",
        text: "Random meal handler not implemented yet",
      },
    ],
  };
}

async function handleMealsByCategory(args: { category: string }) {
  // TODO: Implement meals_by_category handler
  return {
    content: [
      {
        type: "text",
        text: `Meals by category handler not implemented yet. Category: ${args.category}`,
      },
    ],
  };
}

async function handleMealsByIngredient(args: { ingredient: string }) {
  // TODO: Implement meals_by_ingredient handler
  return {
    content: [
      {
        type: "text",
        text: `Meals by ingredient handler not implemented yet. Ingredient: ${args.ingredient}`,
      },
    ],
  };
}

async function handleGetMealDetails(args: { meal_id: string }) {
  // TODO: Implement get_meal_details handler
  return {
    content: [
      {
        type: "text",
        text: `Get meal details handler not implemented yet. Meal ID: ${args.meal_id}`,
      },
    ],
  };
}

/**
 * Start the MCP server
 */
async function main(): Promise<void> {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("[meals-mcp] Server started successfully");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`[meals-mcp] Failed to start server: ${errorMessage}`);
    process.exit(1);
  }
}

// Handle process errors
process.on("uncaughtException", (error) => {
  console.error("[meals-mcp] Uncaught exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("[meals-mcp] Unhandled rejection:", reason);
  process.exit(1);
});

main();
