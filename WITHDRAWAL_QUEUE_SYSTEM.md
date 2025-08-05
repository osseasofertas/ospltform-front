# Withdrawal Queue System

## Overview

The withdrawal system has been completely redesigned to use a queue-based approach instead of the previous 7-day waiting period.

## How It Works

### Queue Structure
- **Starting Position**: 2064 (every new user starts at this position)
- **Queue Direction**: Counts down from 2064 to 1
- **Duration**: 13 days to reach position 1
- **Continuous**: The queue never ends, new users are added at position 2064

### Premium Reviewer Benefits
- **Priority Queue**: Premium reviewers get priority in the withdrawal queue
- **Faster Processing**: Reduced wait times compared to regular users
- **Exclusive Features**: Access to premium features and benefits

## Frontend Implementation

### New Components Added

1. **Withdrawal Queue Display**
   - Shows current position in queue
   - Estimated wait time (13 days)
   - Total people in queue
   - Premium reviewer status

2. **Withdrawal Request Form**
   - Amount input with validation
   - Balance checking
   - Request submission

3. **Premium Reviewer Button**
   - "Become a Premium Reviewer" option
   - Shows current premium status
   - Activation process

4. **Withdrawal Requests History**
   - List of all withdrawal requests
   - Status tracking (pending, processing, completed, failed)
   - Queue position for each request

### State Management

New state properties added to `useAppState`:
- `withdrawalQueue`: Current queue information
- `withdrawalRequests`: Array of user's withdrawal requests

New actions:
- `fetchWithdrawalQueue()`: Get current queue status
- `fetchWithdrawalRequests()`: Get user's withdrawal history
- `requestWithdrawal(amount)`: Submit new withdrawal request
- `becomePremiumReviewer()`: Activate premium status

## Backend Requirements

### New Endpoints Needed

1. **GET /withdrawal-queue**
   ```json
   {
     "position": 2064,
     "totalInQueue": 2064,
     "estimatedDaysToPayment": 13,
     "queueStartedAt": "2024-01-01T00:00:00Z",
     "queueEndsAt": "2024-01-14T00:00:00Z"
   }
   ```

2. **GET /withdrawal-requests**
   ```json
   [
     {
       "id": 1,
       "userId": 123,
       "amount": "50.00",
       "status": "pending",
       "requestedAt": "2024-01-01T10:00:00Z",
       "queuePosition": 2064
     }
   ]
   ```

3. **POST /withdrawal-requests**
   ```json
   {
     "amount": "50.00"
   }
   ```

4. **POST /user/premium-reviewer**
   ```json
   {
     "success": true,
     "message": "Premium reviewer status activated"
   }
   ```

### Database Schema Updates

Add to User table:
- `withdrawalQueuePosition`: Current position in queue
- `withdrawalQueueJoinedAt`: When user joined the queue
- `isPremiumReviewer`: Premium reviewer status

New WithdrawalRequest table:
- `id`: Primary key
- `userId`: Foreign key to User
- `amount`: Withdrawal amount
- `status`: pending/processing/completed/failed
- `requestedAt`: Request timestamp
- `processedAt`: Processing timestamp (nullable)
- `queuePosition`: Position when request was made

## Queue Logic

### Position Calculation
- New users start at position 2064
- Position decreases by ~159 per day (2064 / 13 days)
- Premium reviewers get priority (moved up in queue)

### Processing Rules
1. Users can request withdrawals at any time
2. Requests are added to queue at current position
3. Queue processes from position 1 down
4. Premium reviewers get processed before regular users at same position

## User Experience

### Regular Users
- Start at position 2064
- Wait ~13 days to reach position 1
- Can request withdrawals anytime
- See estimated wait time

### Premium Reviewers
- Priority in queue
- Faster processing
- Exclusive benefits
- Premium status indicator

## Benefits of New System

1. **Transparency**: Users can see their exact position
2. **Predictability**: Known wait time (13 days)
3. **Fairness**: First-come-first-served with premium priority
4. **Scalability**: Queue can handle unlimited users
5. **Motivation**: Premium reviewer incentive
6. **Control**: Users can request withdrawals anytime 