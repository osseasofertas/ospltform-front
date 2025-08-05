# Remove Wait Time Display

## Change Made

**Request:** Remove the display of estimated wait time for withdrawals from the user interface.

## Implementation

### Removed Elements

1. **Estimated Wait Section:**

   ```typescript
   <div className="flex items-center justify-between">
     <div className="flex items-center gap-2">
       <Clock className="h-4 w-4 text-neutral-600" />
       <span className="text-sm text-neutral-600">Estimated Wait</span>
     </div>
     <span className="text-sm font-medium text-neutral-800">
       {withdrawalQueue.estimatedDaysToPayment} days
     </span>
   </div>
   ```

2. **Total in Queue Section:**

   ```typescript
   <div className="flex items-center justify-between">
     <div className="flex items-center gap-2">
       <Users className="h-4 w-4 text-neutral-600" />
       <span className="text-sm text-neutral-600">Total in Queue</span>
     </div>
     <span className="text-sm font-medium text-neutral-800">
       {withdrawalQueue.totalInQueue} people
     </span>
   </div>
   ```

3. **Clock Icon Import:**

   ```typescript
   import {
     ArrowLeft,
     TrendingUp,
     DollarSign,
     Calendar,
     Video,
     Award,
     Clock, // Removed
     Users,
     Crown,
     ArrowUp,
   } from "lucide-react";
   ```

4. **Updated Queue Section Icon:**
   ```typescript
   // Changed from Clock to Users icon
   <CardTitle className="text-lg flex items-center gap-2">
     <Users className="h-5 w-5 text-primary" />
     Withdrawal Queue
   </CardTitle>
   ```

## Current Display

The withdrawal queue section now shows only:

- **Your Position:** Current position in the queue
- **Premium Reviewer Section:** Upgrade option or status

## Benefits

- **Cleaner Interface:** Less information overload
- **Reduced Anxiety:** Users don't see potentially discouraging wait times
- **Simplified UX:** Focus on essential information only

## Backend Data

The `estimatedDaysToPayment` field is still calculated and available in the backend for internal use, but is no longer displayed to users.

## Files Modified

- `src/pages/wallet.tsx` - Removed wait time display and updated imports
