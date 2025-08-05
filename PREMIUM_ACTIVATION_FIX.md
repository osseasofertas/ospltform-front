# Premium Activation Fix

## Problem Identified

**Error:** Backend was receiving `userId: undefined` in the request body, causing a Prisma validation error:

```
Argument `where` of type UserWhereUniqueInput needs at least one of `id` or `email` arguments.
Invalid `this.prisma.user.findUnique()` invocation
where: {
  id: undefined,
  ...
}
```

## Root Cause

The frontend was not sending the `userId` in the request body to the `/withdrawal/user/premium-reviewer` endpoint.

## Solution Implemented

### Updated Function

**Before:**
```typescript
becomePremiumReviewer: async () => {
  try {
    console.log("=== becomePremiumReviewer START ===");
    
    const response = await api.post("/withdrawal/user/premium-reviewer");
    console.log("Premium reviewer response:", response.data);
    
    // Update local user state
    set((state) => ({
      user: state.user ? {
        ...state.user,
        isPremiumReviewer: true,
      } : null,
    }));
    
    console.log("=== becomePremiumReviewer SUCCESS ===");
  } catch (error) {
    console.error("=== becomePremiumReviewer ERROR ===");
    console.error("Error becoming premium reviewer:", error);
    throw error;
  }
},
```

**After:**
```typescript
becomePremiumReviewer: async () => {
  try {
    console.log("=== becomePremiumReviewer START ===");
    
    const currentUser = get().user;
    if (!currentUser) {
      throw new Error("User not found");
    }
    
    console.log("Sending userId:", currentUser.id);
    
    const response = await api.post("/withdrawal/user/premium-reviewer", {
      userId: currentUser.id
    });
    console.log("Premium reviewer response:", response.data);
    
    // Update local user state
    set((state) => ({
      user: state.user ? {
        ...state.user,
        isPremiumReviewer: true,
      } : null,
    }));
    
    console.log("=== becomePremiumReviewer SUCCESS ===");
  } catch (error) {
    console.error("=== becomePremiumReviewer ERROR ===");
    console.error("Error becoming premium reviewer:", error);
    throw error;
  }
},
```

## Key Changes

1. **Added User Validation:** Check if user exists before making request
2. **Added Request Body:** Send `userId` in the request body
3. **Added Logging:** Log the `userId` being sent for debugging
4. **Error Handling:** Throw error if user not found

## Request Format

**Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": 123
}
```

## Backend Expectation

The backend expects:
1. **JWT Token** in Authorization header
2. **userId** in request body
3. **User validation** before updating premium status

## Testing

### Manual Testing Steps
1. **Access premium activation page** while logged in
2. **Check console logs** for "Sending userId: X"
3. **Verify backend receives** correct userId
4. **Confirm premium status** is activated successfully

### Expected Logs
```javascript
console.log("=== becomePremiumReviewer START ===");
console.log("Sending userId:", 123);
console.log("Premium reviewer response:", {...});
console.log("=== becomePremiumReviewer SUCCESS ===");
```

## Files Modified

- **Modified:** `src/hooks/use-app-state.ts` - Updated becomePremiumReviewer function

## Next Steps

1. **Test premium activation** with the fix
2. **Verify backend receives** correct userId
3. **Confirm premium status** updates correctly
4. **Monitor for any remaining errors** 