# Design Document: Expense & Budget Visualizer

## Overview

The Expense & Budget Visualizer is a client-side web application built with vanilla JavaScript, HTML, and CSS. It provides users with an intuitive interface to track expenses, manage budgets, and visualize spending patterns through an interactive pie chart. All data is persisted locally using the browser's Local Storage API, ensuring privacy and offline functionality.

### Key Design Principles

1. **Simplicity**: No frameworks or build tools - pure HTML, CSS, and JavaScript
2. **Reactivity**: Automatic UI updates when data changes
3. **Persistence**: All data saved to Local Storage immediately
4. **Modularity**: Clear separation between data management, UI rendering, and event handling
5. **Performance**: Efficient DOM updates and minimal re-renders

### Technology Stack

- **HTML5**: Semantic markup for structure
- **CSS3**: Modern styling with flexbox/grid layouts
- **Vanilla JavaScript (ES6+)**: Application logic without frameworks
- **Chart.js**: Third-party library for pie chart visualization
- **Local Storage API**: Browser-native data persistence

## Architecture

### High-Level Architecture

The application follows a simple Model-View-Controller (MVC) pattern adapted for vanilla JavaScript:

```
┌─────────────────────────────────────────────────────────┐
│                     index.html                          │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Balance    │  │ Input Form   │  │ Transaction  │  │
│  │  Display    │  │              │  │    List      │  │
│  └─────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │          Chart Component (Chart.js)              │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                    app.js (Controller)                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Event Handlers (form submit, delete clicks)     │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  UI Update Functions (render list, update chart) │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Data Management (CRUD operations)               │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│              Local Storage (Data Layer)                 │
│  Key: "transactions"                                    │
│  Value: JSON array of transaction objects               │
└─────────────────────────────────────────────────────────┘
```

### Component Breakdown

#### 1. Data Layer
- **Storage Key**: `"transactions"`
- **Data Format**: JSON array of transaction objects
- **Operations**: Load, save, add, delete

#### 2. Controller Layer (app.js)
- **Initialization**: Load data, set up event listeners, render initial UI
- **Event Handling**: Form submission, delete button clicks
- **State Management**: In-memory array of transactions synchronized with Local Storage
- **UI Coordination**: Orchestrate updates to all UI components

#### 3. View Layer (HTML + CSS)
- **Balance Display**: Dynamic text showing total
- **Input Form**: Three fields with validation
- **Transaction List**: Scrollable container with delete buttons
- **Chart Component**: Canvas element managed by Chart.js

## Components and Interfaces

### Transaction Data Model

```javascript
interface Transaction {
  id: string;           // Unique identifier (timestamp-based or UUID)
  itemName: string;     // Name of the expense item
  amount: number;       // Expense amount (positive number)
  category: string;     // One of: "Food", "Transport", "Fun"
  timestamp: number;    // Creation timestamp (Date.now())
}
```

### Core Functions

#### Data Management Functions

```javascript
/**
 * Load all transactions from Local Storage
 * @returns {Transaction[]} Array of transaction objects
 */
function loadTransactions(): Transaction[]

/**
 * Save transactions array to Local Storage
 * @param {Transaction[]} transactions - Array to persist
 */
function saveTransactions(transactions: Transaction[]): void

/**
 * Add a new transaction
 * @param {string} itemName - Name of the item
 * @param {number} amount - Amount spent
 * @param {string} category - Category (Food/Transport/Fun)
 * @returns {Transaction} The created transaction
 */
function addTransaction(itemName: string, amount: number, category: string): Transaction

/**
 * Delete a transaction by ID
 * @param {string} id - Transaction ID to delete
 * @returns {boolean} True if deleted, false if not found
 */
function deleteTransaction(id: string): boolean

/**
 * Calculate total balance from all transactions
 * @param {Transaction[]} transactions - Array of transactions
 * @returns {number} Sum of all amounts
 */
function calculateBalance(transactions: Transaction[]): number

/**
 * Calculate spending by category
 * @param {Transaction[]} transactions - Array of transactions
 * @returns {Object} Object with category names as keys and totals as values
 */
function calculateCategoryTotals(transactions: Transaction[]): { [category: string]: number }
```

#### UI Rendering Functions

```javascript
/**
 * Render the transaction list in the DOM
 * @param {Transaction[]} transactions - Array of transactions to display
 */
function renderTransactionList(transactions: Transaction[]): void

/**
 * Update the balance display
 * @param {number} balance - Total balance to display
 */
function updateBalanceDisplay(balance: number): void

/**
 * Update the pie chart with current spending data
 * @param {Object} categoryTotals - Object with category totals
 */
function updateChart(categoryTotals: { [category: string]: number }): void

/**
 * Clear all input form fields
 */
function clearForm(): void

/**
 * Display validation error message
 * @param {string} message - Error message to display
 */
function showError(message: string): void

/**
 * Hide validation error message
 */
function hideError(): void
```

#### Event Handlers

```javascript
/**
 * Handle form submission
 * @param {Event} event - Form submit event
 */
function handleFormSubmit(event: Event): void

/**
 * Handle delete button click
 * @param {string} transactionId - ID of transaction to delete
 */
function handleDelete(transactionId: string): void
```

### Chart.js Integration

The application uses Chart.js for pie chart visualization:

```javascript
// Chart instance (global or module-scoped)
let chartInstance = null;

/**
 * Initialize Chart.js pie chart
 * @param {HTMLCanvasElement} canvas - Canvas element for chart
 * @returns {Chart} Chart.js instance
 */
function initializeChart(canvas: HTMLCanvasElement): Chart

/**
 * Update existing chart with new data
 * @param {Chart} chart - Chart.js instance
 * @param {Object} categoryTotals - Category spending data
 */
function updateChartData(chart: Chart, categoryTotals: Object): void
```

**Chart Configuration:**
- Type: `pie`
- Labels: Category names (Food, Transport, Fun)
- Data: Total amounts per category
- Colors: Distinct colors for each category
- Options: Responsive, legend enabled, tooltips showing amounts

## Data Models

### Transaction Object

```javascript
{
  id: "1234567890123",           // Unique identifier
  itemName: "Grocery Shopping",  // User-provided name
  amount: 45.50,                 // Numeric amount
  category: "Food",              // One of three categories
  timestamp: 1234567890123       // Creation time
}
```

### Local Storage Structure

**Key:** `"transactions"`

**Value:** JSON string of transaction array

```javascript
[
  {
    "id": "1234567890123",
    "itemName": "Grocery Shopping",
    "amount": 45.50,
    "category": "Food",
    "timestamp": 1234567890123
  },
  {
    "id": "1234567890124",
    "itemName": "Bus Ticket",
    "amount": 2.50,
    "category": "Transport",
    "timestamp": 1234567890124
  }
]
```

### Category Totals Object

```javascript
{
  "Food": 45.50,
  "Transport": 2.50,
  "Fun": 0
}
```

### Application State

The application maintains state in memory:

```javascript
// Global state (or module-scoped)
let transactions = [];      // Array of Transaction objects
let chartInstance = null;   // Chart.js instance
```

State is synchronized with Local Storage on every mutation (add/delete).

## Error Handling

### Input Validation

**Validation Rules:**
1. Item Name: Must be non-empty string (after trimming whitespace)
2. Amount: Must be a positive number (> 0)
3. Category: Must be one of the three predefined options (enforced by select element)

**Validation Flow:**
```javascript
function validateInput(itemName, amount, category) {
  const errors = [];
  
  if (!itemName || itemName.trim() === '') {
    errors.push('Item name is required');
  }
  
  if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
    errors.push('Amount must be a positive number');
  }
  
  if (!category || !['Food', 'Transport', 'Fun'].includes(category)) {
    errors.push('Valid category is required');
  }
  
  return errors;
}
```

**Error Display:**
- Show error messages in a dedicated error container above or within the form
- Use red text or background to indicate errors
- Clear errors when user corrects input or submits successfully

### Local Storage Errors

**Potential Issues:**
1. Storage quota exceeded
2. Storage disabled by user
3. JSON parse errors on corrupted data

**Error Handling Strategy:**

```javascript
function safeLoadTransactions() {
  try {
    const data = localStorage.getItem('transactions');
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      console.error('Invalid data format in storage');
      return [];
    }
    
    return parsed;
  } catch (error) {
    console.error('Failed to load transactions:', error);
    // Optionally notify user
    return [];
  }
}

function safeSaveTransactions(transactions) {
  try {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    return true;
  } catch (error) {
    console.error('Failed to save transactions:', error);
    // Notify user that data couldn't be saved
    alert('Unable to save data. Storage may be full.');
    return false;
  }
}
```

### Chart Rendering Errors

**Potential Issues:**
1. Chart.js library fails to load
2. Canvas element not found
3. Invalid data format

**Error Handling:**

```javascript
function safeInitializeChart(canvasId) {
  try {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.error('Chart canvas not found');
      return null;
    }
    
    if (typeof Chart === 'undefined') {
      console.error('Chart.js library not loaded');
      return null;
    }
    
    return new Chart(canvas, chartConfig);
  } catch (error) {
    console.error('Failed to initialize chart:', error);
    return null;
  }
}
```

### DOM Manipulation Errors

**Strategy:**
- Check for element existence before manipulation
- Use optional chaining or null checks
- Gracefully degrade if elements are missing

```javascript
function safeUpdateElement(elementId, content) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = content;
  } else {
    console.warn(`Element ${elementId} not found`);
  }
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Input Validation Correctness

*For any* combination of item name, amount, and category inputs, the validation function SHALL correctly identify whether all required fields are present and valid (non-empty name after trimming, positive numeric amount, valid category).

**Validates: Requirements 1.3**

### Property 2: Transaction Creation Preserves Input Data

*For any* valid item name, amount, and category, creating a transaction SHALL produce a transaction object containing exactly those values along with a unique ID and timestamp.

**Validates: Requirements 1.5**

### Property 3: Transaction List Reflects Current State

*For any* array of transactions in application state, the rendered transaction list SHALL contain exactly those transactions, displaying the item name, amount, and category for each.

**Validates: Requirements 1.6, 2.1, 2.3, 2.4**

### Property 4: Form Clearing After Submission

*For any* valid transaction input, after successful form submission, all input fields SHALL be empty.

**Validates: Requirements 1.7**

### Property 5: Delete Control Presence

*For any* transaction in the rendered list, a delete control SHALL be present and associated with that specific transaction.

**Validates: Requirements 3.1**

### Property 6: Delete Operation Correctness

*For any* transaction list and any transaction ID in that list, deleting that transaction SHALL result in a new list containing all transactions except the one with the specified ID.

**Validates: Requirements 2.5, 3.2**

### Property 7: Balance Calculation Invariant

*For any* array of transactions, the displayed balance SHALL equal the sum of all transaction amounts.

**Validates: Requirements 4.1, 4.2, 4.3, 3.3**

### Property 8: Category Totals Calculation

*For any* array of transactions, the calculated category totals SHALL equal the sum of transaction amounts grouped by category, with each category (Food, Transport, Fun) having a total greater than or equal to zero.

**Validates: Requirements 5.2**

### Property 9: Chart Data Consistency

*For any* array of transactions, the chart data SHALL match the calculated category totals, with chart values corresponding to the sum of amounts for each category.

**Validates: Requirements 5.1, 5.3, 5.4, 3.4**

### Property 10: Storage Persistence Round-Trip

*For any* array of valid transactions, saving to Local Storage and then loading from Local Storage SHALL produce an equivalent array of transactions with all fields preserved.

**Validates: Requirements 6.1, 6.3**

### Property 11: Storage Synchronization After Add

*For any* initial transaction array in storage, adding a new transaction SHALL result in storage containing the original transactions plus the new transaction.

**Validates: Requirements 6.1**

### Property 12: Storage Synchronization After Delete

*For any* transaction array in storage and any transaction ID in that array, deleting that transaction SHALL result in storage containing all transactions except the deleted one.

**Validates: Requirements 6.2**

### Property 13: Application State Restoration

*For any* array of transactions saved to Local Storage, loading the application SHALL restore the complete state: transaction list populated with all saved transactions, balance equal to sum of amounts, and chart data matching category totals.

**Validates: Requirements 6.4, 6.5, 6.6**

### Property 14: Add-Delete Idempotence

*For any* initial transaction array, adding a transaction and then immediately deleting it SHALL return the application to a state equivalent to the initial state (same transactions, same balance, same chart data).

**Validates: Requirements 1.5, 3.2, 4.2, 4.3**

### Property 15: Transaction Rendering Completeness

*For any* transaction with item name, amount, and category, the rendered HTML element for that transaction SHALL contain text or attributes representing all three fields.

**Validates: Requirements 2.3**

## Implementation Notes

### File Structure

```
expense-budget-visualizer/
├── index.html              # Main HTML file
├── css/
│   └── style.css          # Single CSS file for all styles
├── js/
│   └── app.js             # Single JavaScript file for all logic
```

### HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Expense & Budget Visualizer</title>
  <link rel="stylesheet" href="css/style.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <div class="container">
    <!-- Balance Display -->
    <section class="balance-section">
      <h1>Total Balance</h1>
      <div id="balance-display" class="balance-amount">$0.00</div>
    </section>

    <!-- Input Form -->
    <form id="transaction-form" class="input-form">
      <div id="error-message" class="error-message hidden"></div>
      <input type="text" id="item-name" placeholder="Item Name" required>
      <input type="number" id="amount" placeholder="Amount" step="0.01" min="0.01" required>
      <select id="category" required>
        <option value="">Select Category</option>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Fun">Fun</option>
      </select>
      <button type="submit">Add Transaction</button>
    </form>

    <!-- Transaction List -->
    <section class="transaction-list-container">
      <h2>Transactions</h2>
      <div id="transaction-list" class="transaction-list"></div>
    </section>

    <!-- Chart Component -->
    <section class="chart-container">
      <h2>Spending by Category</h2>
      <canvas id="spending-chart"></canvas>
    </section>
  </div>

  <script src="js/app.js"></script>
</body>
</html>
```

### JavaScript Module Structure

The `app.js` file will be organized into logical sections:

```javascript
// ============================================
// DATA MODEL & STATE
// ============================================
let transactions = [];
let chartInstance = null;

// ============================================
// DATA MANAGEMENT FUNCTIONS
// ============================================
function loadTransactions() { /* ... */ }
function saveTransactions(transactions) { /* ... */ }
function addTransaction(itemName, amount, category) { /* ... */ }
function deleteTransaction(id) { /* ... */ }
function calculateBalance(transactions) { /* ... */ }
function calculateCategoryTotals(transactions) { /* ... */ }

// ============================================
// VALIDATION
// ============================================
function validateInput(itemName, amount, category) { /* ... */ }

// ============================================
// UI RENDERING FUNCTIONS
// ============================================
function renderTransactionList(transactions) { /* ... */ }
function updateBalanceDisplay(balance) { /* ... */ }
function updateChart(categoryTotals) { /* ... */ }
function clearForm() { /* ... */ }
function showError(message) { /* ... */ }
function hideError() { /* ... */ }

// ============================================
// CHART MANAGEMENT
// ============================================
function initializeChart(canvas) { /* ... */ }
function updateChartData(chart, categoryTotals) { /* ... */ }

// ============================================
// EVENT HANDLERS
// ============================================
function handleFormSubmit(event) { /* ... */ }
function handleDelete(transactionId) { /* ... */ }

// ============================================
// INITIALIZATION
// ============================================
function init() {
  // Load data from storage
  transactions = loadTransactions();
  
  // Initialize chart
  const canvas = document.getElementById('spending-chart');
  chartInstance = initializeChart(canvas);
  
  // Render initial UI
  renderTransactionList(transactions);
  updateBalanceDisplay(calculateBalance(transactions));
  updateChart(calculateCategoryTotals(transactions));
  
  // Set up event listeners
  document.getElementById('transaction-form')
    .addEventListener('submit', handleFormSubmit);
}

// Run initialization when DOM is ready
document.addEventListener('DOMContentLoaded', init);
```

### Key Implementation Considerations

1. **ID Generation**: Use `Date.now() + Math.random()` or a simple counter for transaction IDs
2. **Number Formatting**: Use `toFixed(2)` for displaying currency amounts
3. **Event Delegation**: Consider using event delegation for delete buttons if performance becomes an issue with many transactions
4. **Chart Colors**: Use distinct, accessible colors for the three categories
5. **Responsive Design**: Ensure the chart and layout work on mobile devices
6. **Accessibility**: Add ARIA labels and ensure keyboard navigation works
7. **Error Recovery**: If Local Storage fails, continue operating in memory-only mode

### Performance Optimizations

1. **Debouncing**: Not needed for this simple application, but could be added if real-time search/filter is added
2. **Virtual Scrolling**: Not needed unless supporting thousands of transactions
3. **Memoization**: Consider memoizing category totals calculation if performance testing reveals issues
4. **Chart Updates**: Use Chart.js update methods instead of destroying and recreating the chart

### Browser Compatibility Notes

- **Local Storage**: Supported in all modern browsers (Chrome, Firefox, Edge, Safari)
- **ES6+ Features**: Use features supported in all target browsers or include a transpilation step if needed
- **Chart.js**: Version 3.x or later, loaded via CDN
- **CSS Grid/Flexbox**: Fully supported in all target browsers

