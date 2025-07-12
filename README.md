# SafeMoney - Content Evaluation App

A mobile-first React application for evaluating photos and videos with earnings tracking.

## Features

- **Frontend-Only Architecture**: No backend dependencies, all data stored in localStorage
- **Content Evaluation System**: Review photos (3-stage) and videos (single-stage) with earnings
- **Daily Limits**: 10 evaluations per day with automatic reset
- **Earnings Tracking**: Detailed statistics, daily breakdown, and transaction history
- **Content Rotation**: 2 videos + 8 photos daily, rotating every 7 days
- **OnlyFans-Style UI**: Blue color scheme (#00AFF0) with modern design

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. The `vercel.json` configuration will handle the build automatically
3. Deploy directly as a static frontend application

### Manual Build

```bash
npm install
npm run build
```

The build output will be in the `dist` folder, ready for any static hosting service.

## Project Structure

```
├── client/src/          # React application source
├── public/prints/       # Static image assets
├── dist/               # Build output (generated)
└── vercel.json         # Vercel deployment config
```

## Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:5000` to view the application.

## Data Storage

All user data is stored in browser localStorage:
- User balance and registration info
- Daily evaluation counts and limits
- Detailed earnings history by day
- Transaction records
- Content evaluation progress

Data persists between browser sessions and resets only on manual logout (after 7-day lockout period).