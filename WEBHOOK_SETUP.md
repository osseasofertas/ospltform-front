# Simplified Payment System Setup

## Overview

This document explains the simplified payment system that works without webhooks.

## Frontend Implementation

### 1. Payment Flow

1. User selects package on `/limit-upgrade`
2. User clicks "Pay" on `/payment`
3. Frontend redirects to external payment gateway with return URL
4. After payment, user returns to `/payment-success` with package data in URL
5. Frontend automatically updates user's evaluation limit

### 2. URL Parameters

The return URL includes all necessary package information:

```
https://your-domain.com/payment-success?type=basic&current=10&new=15&price=10.00
```

Parameters:

- `type`: "basic" or "premium"
- `current`: Current evaluation limit
- `new`: New evaluation limit after upgrade
- `price`: Payment amount

## Backend Implementation

### 1. Update Evaluation Limit Endpoint

```javascript
// PATCH /user/evaluation-limit
app.patch("/user/evaluation-limit", async (req, res) => {
  try {
    const { evaluationLimit } = req.body;
    const userId = req.user.id; // From authentication middleware

    // Update user's evaluation limit in database
    await updateUserEvaluationLimit(userId, evaluationLimit);

    res.json({
      success: true,
      message: "Evaluation limit updated successfully",
    });
  } catch (error) {
    console.error("Error updating evaluation limit:", error);
    res.status(500).json({ error: "Failed to update evaluation limit" });
  }
});
```

### 2. Database Update Function

```javascript
async function updateUserEvaluationLimit(userId, newLimit) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { evaluationLimit: newLimit },
  });

  return user;
}
```

## External Payment Gateway Configuration

### 1. Redirect URL Format

```
https://your-domain.com/payment-success?type={package_type}&current={current_limit}&new={new_limit}&price={amount}
```

### 2. Example URLs

```
// Basic package (+5 evaluations for $9.99)
https://your-domain.com/payment-success?type=basic&current=10&new=15&price=9.99

// Premium package (+10 evaluations for $19.99)
https://your-domain.com/payment-success?type=premium&current=10&new=20&price=19.99
```

### 3. SpeedSellX Payment Links

```
// Basic Package (+5 evaluations)
https://pay.speedsellx.com/688455C60E2C9

// Premium Package (+10 evaluations)
https://pay.speedsellx.com/688455997C4B2
```

### 3. Gateway Configuration

- **Return URL**: Set to your payment-success page
- **Cancel URL**: Set to your limit-upgrade page
- **Amount**: Dynamic based on selected package

## Security Considerations

### 1. URL Parameter Validation

```javascript
// Validate URL parameters
const validatePackageData = (type, current, newLimit, price) => {
  const validTypes = ["basic", "premium"];
  const validPrices = { basic: 9.99, premium: 19.99 }; // Updated to match SpeedSellX prices

  if (!validTypes.includes(type)) return false;
  if (validPrices[type] !== parseFloat(price)) return false;
  if (parseInt(newLimit) <= parseInt(current)) return false;

  return true;
};
```

### 2. User Authentication

- Ensure user is logged in before updating limit
- Verify user owns the account being updated

### 3. Rate Limiting

- Limit how often a user can update their evaluation limit
- Prevent abuse of the upgrade system

## Testing

### 1. Test Payment Flow

```bash
# 1. Test URL with package data
https://your-domain.com/payment-success?type=basic&current=10&new=15&price=10.00

# 2. Verify user limit is updated in database
SELECT evaluation_limit FROM users WHERE id = 1;
```

### 2. Frontend Testing

1. Navigate to `/limit-upgrade`
2. Select a package
3. Click "Pay" to redirect to external payment
4. Return to `/payment-success` with URL parameters
5. Verify user limit is updated automatically

## Error Handling

### 1. Missing Parameters

- Redirect to main page if parameters are missing
- Log error for debugging

### 2. Invalid Package Data

- Validate package type and pricing
- Show error message to user

### 3. Database Errors

- Show user-friendly error message
- Log detailed error for debugging

## Monitoring

### 1. Payment Metrics

- Track successful upgrades
- Monitor revenue from upgrades
- Analyze user upgrade patterns

### 2. Error Monitoring

- Log failed limit updates
- Track invalid URL parameters
- Monitor database errors

### 3. User Experience

- Track time from payment to limit update
- Monitor user satisfaction with upgrade process

## Advantages of Simplified System

### 1. No Webhook Complexity

- No need to handle webhook signatures
- No webhook timeout issues
- Simpler error handling

### 2. Immediate Updates

- User sees limit updated immediately
- No waiting for webhook processing
- Better user experience

### 3. Easier Debugging

- All data visible in URL
- Simpler to trace issues
- Easier to test

### 4. Reduced Infrastructure

- No webhook endpoints needed
- No payment status tracking
- Simpler database schema

## Implementation Checklist

- [ ] Configure external payment gateway with return URL
- [ ] Implement evaluation limit update endpoint
- [ ] Add URL parameter validation
- [ ] Test complete payment flow
- [ ] Add error handling and logging
- [ ] Monitor payment success rates
- [ ] Document gateway configuration
