# Project Structure

## Directory Layout

```
/
├── index.html          # Main HTML entry point
├── css/
│   └── style.css      # Application styles
├── js/
│   └── app.js         # Application logic
├── .kiro/             # Kiro AI assistant configuration
│   ├── specs/         # Feature specifications
│   └── steering/      # Project guidance documents
└── README.md          # Project documentation
```

## File Organization

### HTML (`index.html`)
- Single-page application structure
- Sections: balance display, transaction form, transaction list, chart container
- External dependencies loaded via CDN (Chart.js)
- Scripts loaded at end of body for performance

### JavaScript (`js/app.js`)
Organized into logical sections with clear separation of concerns:

1. **Data Model & State**: Global state variables (`transactions`, `chartInstance`)
2. **Data Management**: CRUD operations and calculations
   - `loadTransactions()`, `saveTransactions()` - Local Storage persistence
   - `addTransaction()`, `deleteTransaction()` - Transaction operations
   - `calculateBalance()`, `calculateCategoryTotals()` - Aggregations
3. **Validation**: Input validation logic (`validateInput()`)
4. **UI Rendering**: DOM manipulation and display updates
   - `updateBalanceDisplay()` - Balance UI updates
   - `renderTransactionList()` - Transaction list rendering
   - `escapeHtml()` - XSS prevention utility

### CSS (`css/style.css`)
Currently placeholder - styles to be implemented

## Code Conventions

### JavaScript Style
- **ES6+ syntax**: Use arrow functions, template literals, const/let
- **JSDoc comments**: Document all functions with parameters and return types
- **Error handling**: Try-catch blocks for storage operations, console warnings for missing DOM elements
- **Defensive programming**: Validate array inputs, check for null/undefined
- **Security**: HTML escaping for user-generated content to prevent XSS

### Naming Conventions
- **Functions**: camelCase with descriptive verb-noun pairs (`addTransaction`, `calculateBalance`)
- **Variables**: camelCase (`transactions`, `chartInstance`)
- **Constants**: Use `const` by default, `let` only when reassignment needed
- **DOM IDs**: kebab-case (`balance-display`, `transaction-form`)
- **CSS classes**: kebab-case (`.transaction-item`, `.delete-btn`)

### Data Model
Transaction objects have this structure:
```javascript
{
  id: string,           // Unique identifier (timestamp + random)
  itemName: string,     // User-provided item name
  amount: number,       // Positive number (parsed float)
  category: string,     // One of: "Food", "Transport", "Fun"
  timestamp: number     // Creation time (milliseconds since epoch)
}
```

### Categories
Fixed set of three categories:
- `Food`
- `Transport`
- `Fun`

Do not add or modify categories without updating validation logic and UI selectors.
