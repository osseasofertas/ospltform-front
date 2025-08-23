# Countdown Timer Test Documentation

## Test Objective
Verify that the withdrawal countdown timer correctly displays remaining days, hours, and minutes, and shows the error message after 13 days.

## Test Cases

### Test Case 1: Countdown Display
**Objective**: Verify countdown shows correct format (days: hours: minutes)

**Steps**:
1. Open the wallet page
2. Check if countdown timer is displayed in the withdrawal section
3. Verify format shows: `DD:HH:MM`
4. Confirm hours and minutes are zero-padded (e.g., 05:09)

**Expected Result**: 
- Countdown displays in format: `13:00:00` (for new users)
- Hours and minutes are zero-padded
- Timer updates every minute

### Test Case 2: Countdown Decrease
**Objective**: Verify countdown decreases over time

**Steps**:
1. Note the initial countdown values
2. Wait for 1 minute
3. Check if minutes decreased by 1
4. Wait for 1 hour
5. Check if hours decreased by 1
6. Wait for 1 day
7. Check if days decreased by 1

**Expected Result**:
- Minutes decrease every minute
- Hours decrease every hour
- Days decrease every day
- Timer reaches `00:00:00` after exactly 13 days

### Test Case 3: Error Message After 13 Days
**Objective**: Verify error message appears after countdown reaches zero

**Steps**:
1. Set user registration date to 13+ days ago
2. Refresh the wallet page
3. Check if countdown timer is hidden
4. Verify error message appears: "It was not possible to verify the user's identity"
5. Check if "Contact Support" button is present
6. Click "Contact Support" button
7. Verify redirect to support page

**Expected Result**:
- Countdown timer disappears
- Red error message appears with warning icon
- "Contact Support" button is clickable
- Clicking button redirects to `/support` page

### Test Case 4: Form Disable After Expiry
**Objective**: Verify withdrawal form is disabled after 13 days

**Steps**:
1. Set user registration date to 13+ days ago
2. Check withdrawal input field
3. Check withdrawal button
4. Try to submit withdrawal request

**Expected Result**:
- Input field is disabled
- Submit button is disabled
- No withdrawal can be requested

## Test Data Setup

### For Testing Countdown (New User)
```javascript
// Set registration date to current time
user.registrationDate = new Date().toISOString();
// Expected countdown: 13:00:00
```

### For Testing Error Message (Expired User)
```javascript
// Set registration date to 14 days ago
user.registrationDate = new Date(Date.now() - (14 * 24 * 60 * 60 * 1000)).toISOString();
// Expected: Error message appears
```

## Implementation Details

### Countdown Logic
- Calculates 13 days from registration date
- Updates every minute using `setInterval`
- Formats time as days, hours, minutes
- Zero-pads hours and minutes

### Error Message Logic
- Shows when countdown reaches `00:00:00`
- Disables withdrawal form
- Provides contact support button
- Redirects to support page

### UI Components
- Blue countdown timer with clock icon
- Red error message with warning icon
- Contact support button
- Disabled form inputs

## Verification Checklist

- [ ] Countdown displays correctly for new users
- [ ] Timer updates every minute
- [ ] Format is DD:HH:MM with zero-padding
- [ ] Error message appears after 13 days
- [ ] Contact support button works
- [ ] Form is disabled after expiry
- [ ] Support page shows contact email
