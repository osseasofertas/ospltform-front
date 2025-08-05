# Backend Endpoints Mapping

## Frontend to Backend Endpoints

### ✅ Correctly Mapped Endpoints

| Frontend Call                                   | Backend Endpoint                         | Status     |
| ----------------------------------------------- | ---------------------------------------- | ---------- |
| `api.get("/withdrawal/queue-position")`         | `GET /withdrawal/queue-position`         | ✅ Correct |
| `api.get("/withdrawal/requests")`               | `GET /withdrawal/requests`               | ✅ Correct |
| `api.post("/withdrawal/requests")`              | `POST /withdrawal/requests`              | ✅ Correct |
| `api.post("/withdrawal/user/premium-reviewer")` | `POST /withdrawal/user/premium-reviewer` | ✅ Correct |

### 📋 Available Backend Endpoints

#### User Endpoints

- `GET /withdrawal/requests` - Get user's withdrawal requests
- `POST /withdrawal/requests` - Create withdrawal request
- `GET /withdrawal/queue-position` - Get user's queue position

#### Admin Endpoints

- `GET /withdrawal/queue` - View complete queue (admin only)
- `POST /withdrawal/requests/:id/approve` - Approve withdrawal request
- `POST /withdrawal/requests/:id/reject` - Reject withdrawal request
- `POST /withdrawal/user/premium-reviewer` - Make user premium reviewer

#### Queue Management

- `POST /queue/update-positions` - Update queue positions
- `POST /queue/process` - Process queue manually

## Frontend Implementation Status

### ✅ Implemented Features

1. **Withdrawal Queue Display** - Shows position, wait time, total in queue
2. **Withdrawal Request Form** - Amount validation and submission
3. **Premium Reviewer Button** - Activation with proper endpoint
4. **Withdrawal Requests History** - Shows all requests with status
5. **Error Handling** - Proper error messages and fallbacks
6. **Loading States** - Loading indicators for all operations

### 🔧 Technical Details

#### State Management

- `withdrawalQueue`: Current queue information from `/withdrawal/queue-position`
- `withdrawalRequests`: Array of user's requests from `/withdrawal/requests`

#### API Calls

```typescript
// Get queue position
const { data } = await api.get("/withdrawal/queue-position");

// Get withdrawal requests
const { data } = await api.get("/withdrawal/requests");

// Create withdrawal request
const response = await api.post("/withdrawal/requests", { amount });

// Become premium reviewer
const response = await api.post("/withdrawal/user/premium-reviewer");
```

#### Error Handling

- Fallback queue data if API fails
- Toast notifications for success/error
- Loading states during operations
- Validation for withdrawal amounts

## Testing Checklist

### Frontend Tests

- [ ] Queue position displays correctly
- [ ] Withdrawal request form works
- [ ] Premium reviewer button functions
- [ ] Error messages show properly
- [ ] Loading states work
- [ ] History displays correctly

### Backend Integration Tests

- [ ] Queue position endpoint returns correct data
- [ ] Withdrawal requests are created successfully
- [ ] Premium reviewer status is updated
- [ ] Error responses are handled properly
- [ ] Balance is deducted correctly

## Monitoring

### Frontend Logs to Monitor

```javascript
console.log("=== fetchWithdrawalQueue START ===");
console.log("=== fetchWithdrawalRequests START ===");
console.log("=== requestWithdrawal START ===");
console.log("=== becomePremiumReviewer START ===");
```

### Backend Logs to Monitor

- Queue processing at 2 AM
- Hourly queue processing
- Error and success logs
- Manual queue processing

## Queue Logic Verification

### Position Calculation

- New users start at position 2064
- Position decreases by ~159 per day
- Premium reviewers get priority (half position)
- 13 days to reach position 1

### Processing Rules

1. Users can request withdrawals anytime
2. Requests added to queue at current position
3. Queue processes from position 1 down
4. Premium reviewers processed first at same position

## Next Steps

1. **Test all endpoints** with real backend
2. **Monitor logs** for any errors
3. **Verify queue processing** works correctly
4. **Test premium reviewer** functionality
5. **Validate balance updates** after withdrawals
