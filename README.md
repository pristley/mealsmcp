# Meals MCP Server

A production-ready [Model Context Protocol](https://modelcontextprotocol.io/) server for discovering and retrieving meal recipes. Powered by the free [TheMealDB API](https://www.themealdb.com/api.php).

## What It Does

Meals MCP provides AI assistants with 5 powerful tools for meal discovery and recipe lookup:
- **Search meals** by name
- **Find random meals** for inspiration
- **Browse meals** by category (Seafood, Vegetarian, Pasta, etc.)
- **Filter meals** by ingredient
- **Get full recipes** with ingredients, measurements, and instructions

No authentication required. All data comes from the free, public TheMealDB API.

## Quick Start

### Installation

```bash
npm install
npm run build
```

### Start the Server

```bash
npm start
```

The MCP server will start on stdio transport and wait for client connections.

## Available Tools

### 1. `search_meal`
Search for meals by name.

**Input:**
```json
{
  "name": "pasta"
}
```

**Output:**
```
Found 30 meals for "pasta". Top 5:

- **Fettuccine Alfredo** (ID: 52794)
  Image: https://www.themealdb.com/images/media/meals/...

- **Spaghetti Carbonara** (ID: 52800)
  Image: https://www.themealdb.com/images/media/meals/...

[... 3 more meals ...]
```

---

### 2. `random_meal`
Get a random meal for culinary inspiration.

**Input:**
```json
{}
```

**Output:**
```
**Pad Thai**

**Category:** Seafood | **Area:** Thai

**Ingredients:**
- 2 tablespoons Tamarind Paste
- 2 tablespoons Fish Sauce
- 1 tablespoon Oyster Sauce
- 1 tablespoon Lime Juice
- 2 Cloves Garlic
- 2 Chicken Breasts
- 8 oz Rice Noodles
- 2 Eggs
- 100g Beansprouts
- 50g Peanuts
- ... and 5 more

**Instructions:**
Heat oil in a wok over high heat. Add minced garlic and stir-fry until fragrant. Add chicken and cook until done. Add noodles and toss well. Pour sauce mixture and stir...

**Image:** https://www.themealdb.com/images/media/meals/...
```

---

### 3. `meals_by_category`
Browse meals by category.

**Input:**
```json
{
  "category": "Seafood"
}
```

**Output:**
```
Found 23 meals in "Seafood" category. Showing top 10:

- **Baked Salmon** (ID: 52959)
  Image: https://www.themealdb.com/images/media/meals/...

- **Fish and Chips** (ID: 52802)
  Image: https://www.themealdb.com/images/media/meals/...

[... 8 more meals ...]
```

**Popular Categories:**
- Seafood
- Vegetarian
- Pasta
- Meat
- Breakfast
- Dessert
- Vegan
- Starter

---

### 4. `meals_by_ingredient`
Find meals that use a specific ingredient.

**Input:**
```json
{
  "ingredient": "chicken"
}
```

**Output:**
```
Found 89 meals with "chicken" ingredient. Showing top 10:

- **Chicken Fajita Supreme** (ID: 52847)
  Image: https://www.themealdb.com/images/media/meals/...

- **Chicken Biryani** (ID: 52957)
  Image: https://www.themealdb.com/images/media/meals/...

[... 8 more meals ...]
```

---

### 5. `get_meal_details`
Get complete recipe details for a meal by ID.

**Input:**
```json
{
  "meal_id": "52959"
}
```

**Output:**
```
# Baked Salmon

**Category:** Seafood
**Cuisine:** Canadian
**ID:** 52959

## Ingredients (7)

- 1 tbsp Butter
- 1/2 cup White Wine
- 2 tbsp Lemon Juice
- 1 tsp Dill
- 1 Salmon Fillet
- Salt and Pepper to taste
- Fresh Lemon

## Instructions

Preheat oven to 375°F (190°C). Place salmon fillet on a baking sheet. Melt butter and mix with white wine, lemon juice, and dill. Pour over salmon. Season with salt and pepper. Bake for 15-20 minutes until cooked through. Serve immediately with fresh lemon wedges.

## Video Recipe
[Watch on YouTube](https://www.youtube.com/watch?v=...)

## Image
![Baked Salmon](https://www.themealdb.com/images/media/meals/...)
```

---

## Features

✅ **Production-Ready**
- TypeScript with strict mode
- Comprehensive input validation
- Proper error handling
- 404 detection and rate limit handling

✅ **Minimal Dependencies**
- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `node-fetch` - HTTP client (compatible with Node.js 18+)
- No other runtime dependencies

✅ **Well-Structured**
- Clean separation of concerns (API, tools, validation)
- Type-safe responses
- Modular handlers for each tool

✅ **Free & Open**
- No authentication required
- Powered by [TheMealDB](https://www.themealdb.com/api.php) free API
- No rate limiting in normal usage

## Project Structure

```
mealsmcp/
├── src/
│   ├── index.ts              # MCP server entry point
│   ├── api/
│   │   └── mealdb-client.ts  # TheMealDB API client
│   ├── tools/
│   │   ├── search-handler.ts    # Search & random meal handlers
│   │   ├── filter-handler.ts    # Category & ingredient filters
│   │   └── details-handler.ts   # Meal details handler
│   └── utils/
│       └── validation.ts      # Input validation & sanitization
├── dist/                     # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Development

```bash
# Type check
npm run typecheck

# Development (with ts-node)
npm run dev

# Test all tools with sample requests
npm test

# Build
npm run build

# Start compiled server
npm start
```

## Error Handling

The server handles common error scenarios gracefully:
- **Invalid inputs** - Sanitizes and validates before API calls
- **Empty results** - Returns friendly "no meals found" messages
- **HTTP errors** - Catches 404s, rate limits, and server errors
- **Network failures** - Provides meaningful error messages

## Requirements

- Node.js 18.0.0 or later
- npm or yarn

## License

MIT

## API Attribution

Built with [TheMealDB](https://www.themealdb.com/) - A free, crowd-sourced database of meals from around the world.
