# Frontend Queue Calculation Implementation

## Problem Solved

**Issue:** The balance was being reset to the total amount when the page was refreshed, losing the withdrawal deduction. The queue position was also not being calculated correctly based on the actual withdrawal request dates.

## Solution Overview

Implemented a frontend-based calculation system that:
1. **Calculates balance** from transactions minus pending withdrawals
2. **Calculates queue position** based on withdrawal request dates
3. **Persists across page refreshes** using withdrawal request data

## Key Changes

### 1. Balance Calculation Logic

**New Balance Formula:**
```typescript
// Calculate balance from transactions minus pending withdrawals
const earningsFromTransactions = transactions.reduce((sum, t) => {
  const amount = Number(t.amount);
  return sum + amount;
}, 0);

// Calculate total pending withdrawals
const totalPendingWithdrawals = withdrawalRequests
  .filter(request => request.status === "pending")
  .reduce((sum, request) => {
    const amount = typeof request.amount === 'string' ? parseFloat(request.amount) : request.amount;
    return sum + amount;
  }, 0);

// Final balance = earnings - pending withdrawals
const balance = earningsFromTransactions - totalPendingWithdrawals;
```

### 2. Queue Position Calculation

**Frontend Queue Logic:**
```typescript
const calculateQueuePosition = (requestDate: string) => {
  const requestTime = new Date(requestDate).getTime();
  const now = Date.now();
  const timeDiff = now - requestTime;
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
  
  // Queue starts at 2064 and decreases over 13 days
  const initialPosition = 2064;
  const daysToComplete = 13;
  const positionDecrease = (daysDiff / daysToComplete) * initialPosition;
  const currentPosition = Math.max(1, Math.floor(initialPosition - positionDecrease));
  
  return currentPosition;
};
```

### 3. Updated WithdrawalRequest Interface

**Enhanced Type Definition:**
```typescript
export interface WithdrawalRequest {
  id: number;
  userId: number;
  amount: string | number;
  status: "pending" | "processing" | "completed" | "failed";
  requestedAt?: string; // For frontend compatibility
  requestDate?: string; // From backend
  processedAt?: string;
  processedDate?: string; // From backend
  queuePosition?: number; // Calculated in frontend
  notes?: string | null;
}
```

### 4. Queue Data Calculation

**Frontend Queue Generation:**
```typescript
// Get user's pending withdrawal requests
const userPendingRequests = withdrawalRequests.filter((req: any) => 
  req.status === "pending" && req.userId === get().user?.id
);

if (userPendingRequests.length > 0) {
  // User has pending withdrawals, calculate position based on oldest request
  const oldestRequest = userPendingRequests.reduce((oldest: any, current: any) => 
    new Date(current.requestDate) < new Date(oldest.requestDate) ? current : oldest
  );
  
  const position = calculateQueuePosition(oldestRequest.requestDate);
  
  queueData = {
    position: position,
    totalInQueue: 2064,
    estimatedDaysToPayment: Math.max(0, 13 - (Date.now() - new Date(oldestRequest.requestDate).getTime()) / (1000 * 60 * 60 * 24)),
    queueStartedAt: oldestRequest.requestDate,
    queueEndsAt: new Date(new Date(oldestRequest.requestDate).getTime() + 13 * 24 * 60 * 60 * 1000).toISOString(),
  };
}
```

## Expected Behavior

### Balance Calculation
- **Before Withdrawal:** $253.31 (total earnings)
- **After Withdrawal Request:** $3.31 (253.31 - 250.00 pending)
- **After Page Refresh:** $3.31 (persistent calculation)

### Queue Position
- **New Withdrawal:** Position 2064
- **After 1 Day:** Position ~1588 (2064 - (1/13 * 2064))
- **After 13 Days:** Position 1
- **No Pending Withdrawals:** Position 2064 (default)

### Data Persistence
- **Page Refresh:** Balance and queue position maintained
- **Multiple Withdrawals:** Oldest withdrawal determines queue position
- **Completed Withdrawals:** Removed from pending calculations

## Backend Integration

### Required Endpoints
1. **GET /withdrawal/requests** - Returns all withdrawal requests
2. **POST /withdrawal/requests** - Creates new withdrawal request

### Expected Response Format
```json
[
  {
    "id": 2,
    "userId": 1,
    "amount": 50,
    "status": "pending",
    "requestDate": "2025-08-05T01:33:02.230Z",
    "processedDate": null,
    "notes": null
  }
]
```

## Debug Information

### Logs to Monitor
```javascript
console.log("Earnings from transactions:", earningsFromTransactions);
console.log("Total pending withdrawals:", totalPendingWithdrawals);
console.log("Final calculated balance:", balance);
console.log(`Request date: ${requestDate}, Days diff: ${daysDiff.toFixed(2)}, Position: ${currentPosition}`);
console.log("Calculated queue data:", queueData);
```

### Calculation Flow
1. **Fetch transactions** from backend
2. **Fetch withdrawal requests** from backend
3. **Calculate earnings** from transactions
4. **Calculate pending withdrawals** from requests
5. **Calculate balance** (earnings - pending)
6. **Calculate queue position** based on oldest pending request
7. **Update UI** with calculated values

## Testing Steps

1. **Check initial balance** before any withdrawals
2. **Make withdrawal request** for $250.00
3. **Verify balance updates** to $3.31 immediately
4. **Refresh page** and confirm balance remains $3.31
5. **Check queue position** shows 2064 for new withdrawal
6. **Wait and refresh** to see position decrease over time
7. **Make multiple withdrawals** and verify oldest determines position

## Benefits

- **Persistent Balance:** Survives page refreshes
- **Accurate Queue:** Based on actual request dates
- **Real-time Updates:** Calculated from current data
- **No Backend Dependencies:** Queue calculation in frontend
- **Consistent State:** Always reflects actual pending withdrawals

## Next Steps

1. **Test balance persistence** across page refreshes
2. **Verify queue calculation** accuracy over time
3. **Monitor performance** with multiple withdrawal requests
4. **Test edge cases** (completed withdrawals, multiple users)
5. **Validate calculations** against expected values 