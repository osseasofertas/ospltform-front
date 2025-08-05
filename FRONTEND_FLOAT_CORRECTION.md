# Frontend Float Correction

## Problem
The backend was expecting a `Float` for the `amount` field, but the frontend was sending a `String`, causing a Prisma validation error.

## Changes Made

### 1. Updated `use-app-state.ts`

**Before:**
```typescript
const response = await api.post("/withdrawal/requests", { 
  amount, // String
  currentBalance: currentBalance.toFixed(2) // String
});
```

**After:**
```typescript
// Convert amount to float
const amountFloat = parseFloat(amount);
if (isNaN(amountFloat) || amountFloat <= 0) {
  throw new Error("Invalid amount");
}

const response = await api.post("/withdrawal/requests", { 
  amount: amountFloat, // Float
  currentBalance: currentBalance // Number
});
```

### 2. Updated `wallet.tsx`

**Before:**
```typescript
if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
  // Validation
}

if (parseFloat(withdrawalAmount) > balance) {
  // Balance check
}
```

**After:**
```typescript
// Convert and validate amount
const amountFloat = parseFloat(withdrawalAmount);
if (!withdrawalAmount || isNaN(amountFloat) || amountFloat <= 0) {
  // Validation
}

if (amountFloat > balance) {
  // Balance check
}
```

### 3. Enhanced Input Validation

**Before:**
```typescript
onChange={(e) => setWithdrawalAmount(e.target.value)}
```

**After:**
```typescript
onChange={(e) => {
  const value = e.target.value;
  // Only allow valid numbers with up to 2 decimal places
  if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
    setWithdrawalAmount(value);
  }
}}
```

### 4. Improved Button State

**Before:**
```typescript
disabled={isRequestingWithdrawal || !withdrawalAmount || parseFloat(withdrawalAmount) <= 0}
```

**After:**
```typescript
disabled={isRequestingWithdrawal || !withdrawalAmount || isNaN(parseFloat(withdrawalAmount)) || parseFloat(withdrawalAmount) <= 0}
```

## Data Types Sent to Backend

| Field | Type | Description |
|-------|------|-------------|
| `amount` | `number` | Float value (e.g., 250.00) |
| `currentBalance` | `number` | Float value (e.g., 500.00) |

## Validation Rules

1. **Amount must be a valid number**
2. **Amount must be greater than 0**
3. **Amount cannot exceed available balance**
4. **Only up to 2 decimal places allowed**
5. **Empty values are not allowed**

## Error Handling

- **Invalid amount**: Shows toast with "Invalid amount" message
- **Insufficient balance**: Shows toast with "Insufficient balance" message
- **Network errors**: Shows toast with "Withdrawal failed" message

## Testing

### Test Cases

1. **Valid withdrawal**
   - Enter: 100.50
   - Expected: Request sent with `amount: 100.5`

2. **Invalid amount**
   - Enter: "abc"
   - Expected: Validation error, button disabled

3. **Zero amount**
   - Enter: 0
   - Expected: Validation error, button disabled

4. **Negative amount**
   - Enter: -50
   - Expected: Validation error, button disabled

5. **Excessive decimals**
   - Enter: 100.999
   - Expected: Input limited to 100.99

6. **Insufficient balance**
   - Enter: 1000 (when balance is 500)
   - Expected: "Insufficient balance" error

## Backend Compatibility

The frontend now sends:
```json
{
  "amount": 250.0,
  "currentBalance": 500.0
}
```

Instead of:
```json
{
  "amount": "250",
  "currentBalance": "500.00"
}
```

This matches the Prisma schema expectation of `Float` type for the `amount` field.

## Logs to Monitor

```javascript
console.log("Amount as float:", amountFloat);
console.log("Current balance from transactions:", currentBalance);
```

These logs will help verify that the correct data types are being sent to the backend. 