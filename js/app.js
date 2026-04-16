// ============================================
// DATA MODEL & STATE
// ============================================
let transactions = [];
let chartInstance = null;

// ============================================
// DATA MANAGEMENT FUNCTIONS
// ============================================

/**
 * Load all transactions from Local Storage
 * @returns {Array} Array of transaction objects, empty array if no data or on error
 */
function loadTransactions() {
  try {
    const data = localStorage.getItem('transactions');
    
    // Return empty array if no data exists
    if (!data) {
      return [];
    }
    
    // Parse JSON data
    const parsed = JSON.parse(data);
    
    // Validate that parsed data is an array
    if (!Array.isArray(parsed)) {
      console.error('Invalid data format in storage: expected array');
      return [];
    }
    
    return parsed;
  } catch (error) {
    // Handle JSON parse errors and other exceptions
    console.error('Failed to load transactions from Local Storage:', error);
    return [];
  }
}

/**
 * Save transactions array to Local Storage
 * @param {Array} transactions - Array of transaction objects to persist
 * @returns {boolean} True if save succeeded, false if failed
 */
function saveTransactions(transactions) {
  try {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    return true;
  } catch (error) {
    // Handle quota exceeded errors and other exceptions
    console.error('Failed to save transactions to Local Storage:', error);
    
    // Alert user if storage fails
    if (error.name === 'QuotaExceededError') {
      alert('Unable to save data: Storage quota exceeded. Please free up space.');
    } else {
      alert('Unable to save data. Please try again.');
    }
    
    return false;
  }
}

/**
 * Add a new transaction
 * @param {string} itemName - Name of the item
 * @param {number} amount - Amount spent
 * @param {string} category - Category (Food/Transport/Fun)
 * @returns {Object} The created transaction object
 */
function addTransaction(itemName, amount, category) {
  // Create new transaction object with unique ID
  const transaction = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    itemName: itemName,
    amount: parseFloat(amount),
    category: category,
    timestamp: Date.now()
  };
  
  // Add transaction to global transactions array
  transactions.push(transaction);
  
  // Persist to Local Storage
  saveTransactions(transactions);
  
  // Return the created transaction
  return transaction;
}

/**
 * Delete a transaction by ID
 * @param {string} id - Transaction ID to delete
 * @returns {boolean} True if deleted, false if not found
 */
function deleteTransaction(id) {
  // Find index of transaction with matching ID
  const index = transactions.findIndex(transaction => transaction.id === id);
  
  // Return false if not found
  if (index === -1) {
    return false;
  }
  
  // Remove transaction from array
  transactions.splice(index, 1);
  
  // Persist changes to Local Storage
  saveTransactions(transactions);
  
  // Return true to indicate successful deletion
  return true;
}

/**
 * Calculate total balance from all transactions
 * @param {Array} transactions - Array of transaction objects
 * @returns {number} Sum of all transaction amounts
 */
function calculateBalance(transactions) {
  // Return 0 if transactions array is empty or invalid
  if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
    return 0;
  }
  
  // Sum all transaction amounts using reduce
  return transactions.reduce((total, transaction) => {
    return total + (transaction.amount || 0);
  }, 0);
}

/**
 * Calculate spending by category
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} Object with category names as keys (Food, Transport, Fun) and totals as values
 */
function calculateCategoryTotals(transactions) {
  // Initialize totals for all three categories
  const categoryTotals = {
    Food: 0,
    Transport: 0,
    Fun: 0
  };
  
  // Return initial totals if transactions array is empty or invalid
  if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
    return categoryTotals;
  }
  
  // Sum amounts by category
  transactions.forEach(transaction => {
    const category = transaction.category;
    const amount = transaction.amount || 0;
    
    // Only add to total if category is one of the three valid categories
    if (categoryTotals.hasOwnProperty(category)) {
      categoryTotals[category] += amount;
    }
  });
  
  return categoryTotals;
}

// ============================================
// VALIDATION
// ============================================

/**
 * Validate input fields for transaction creation
 * @param {string} itemName - Name of the item
 * @param {string|number} amount - Amount spent
 * @param {string} category - Category (Food/Transport/Fun)
 * @returns {Array<string>} Array of error messages (empty if valid)
 */
function validateInput(itemName, amount, category) {
  const errors = [];
  
  // Validate item name: must be non-empty after trimming
  if (!itemName || itemName.trim() === '') {
    errors.push('Item name is required');
  }
  
  // Validate amount: must be a positive number
  if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
    errors.push('Amount must be a positive number');
  }
  
  // Validate category: must be one of the three valid categories
  if (!category || !['Food', 'Transport', 'Fun'].includes(category)) {
    errors.push('Valid category is required');
  }
  
  return errors;
}
