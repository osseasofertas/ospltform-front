import { AppContent } from "@/types";

// Content rotation system - changes every 7 days
const CONTENT_ROTATION_DAYS = 7;

// All available content pool - ready for frontend-only hosting
const contentPool: AppContent[] = [
  // Day 1 - Photos (8)
  {
    id: 1,
    type: "photo",
    title: "Lifestyle Photo 1",
    url: "/prints/PT1.png",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 1,
  },
  {
    id: 2,
    type: "photo",
    title: "Lifestyle Photo 2",
    url: "/prints/PT2.png",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 1,
  },
  {
    id: 3,
    type: "photo",
    title: "Lifestyle Photo 3",
    url: "/prints/PT3.png",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 1,
  },
  {
    id: 4,
    type: "photo",
    title: "Lifestyle Photo 4",
    url: "/prints/PT4.png",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 1,
  },
  {
    id: 5,
    type: "photo",
    title: "Lifestyle Photo 5",
    url: "/prints/PT5.png",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 1,
  },
  {
    id: 6,
    type: "photo",
    title: "Lifestyle Photo 6",
    url: "/prints/PT6.png",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 1,
  },
  {
    id: 7,
    type: "photo",
    title: "Lifestyle Photo 7",
    url: "/prints/PT7.png",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 1,
  },
  {
    id: 8,
    type: "photo",
    title: "Lifestyle Photo 8",
    url: "/prints/PT8.png",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 1,
  },

  // Day 1 - Videos (2)
  {
    id: 9,
    type: "video",
    title: "Video Content 1",
    url: "/videos/PT1.mp4",
    minEarning: "20.00",
    maxEarning: "40.00",
    week: 1,
  },
  {
    id: 10,
    type: "video",
    title: "Video Content 2",
    url: "/videos/PT2.mp4",
    minEarning: "20.00",
    maxEarning: "40.00",
    week: 1,
  },

  // Day 2 - Photos (8)
  {
    id: 11,
    type: "photo",
    title: "Lifestyle Photo 9",
    url: "/prints/PT10.png",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 2,
  },
  {
    id: 12,
    type: "photo",
    title: "Lifestyle Photo 10",
    url: "/prints/PT11.png",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 2,
  },
  {
    id: 13,
    type: "photo",
    title: "Lifestyle Photo 11",
    url: "/prints/PT12.png",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 2,
  },
  {
    id: 14,
    type: "photo",
    title: "Lifestyle Photo 12",
    url: "/prints/PT13.png",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 2,
  },
  {
    id: 15,
    type: "photo",
    title: "Lifestyle Photo 13",
    url: "/prints/PT14.png",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 2,
  },
  {
    id: 16,
    type: "photo",
    title: "Lifestyle Photo 14",
    url: "/prints/PT15.png",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 2,
  },
  {
    id: 17,
    type: "photo",
    title: "Lifestyle Photo 15",
    url: "/prints/PT16.png",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 2,
  },
  {
    id: 18,
    type: "photo",
    title: "Lifestyle Photo 16",
    url: "/prints/PT17.png",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 2,
  },

  // Day 2 - Videos (2)
  {
    id: 19,
    type: "video",
    title: "Video Content 3",
    url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
    minEarning: "20.00",
    maxEarning: "40.00",
    week: 2,
  },
  {
    id: 20,
    type: "video",
    title: "Video Content 4",
    url: "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4",
    minEarning: "20.00",
    maxEarning: "40.00",
    week: 2,
  },
];

// Calculate current day based on user's login date
const getContentDay = (userLoginDate: string | null): number => {
  if (!userLoginDate) return 1; // Default to day 1 if no login date

  const loginDate = new Date(userLoginDate);
  const now = new Date();
  const daysDiff = Math.floor(
    (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  return (Math.floor(daysDiff / CONTENT_ROTATION_DAYS) % 2) + 1; // Rotates between day 1 and 2
};

export const getAvailableContent = (
  userLoginDate: string | null
): AppContent[] => {
  const currentDay = getContentDay(userLoginDate);
  return contentPool.filter((content) => content.week === currentDay);
};

export const getContent = (id: number): AppContent | undefined => {
  return contentPool.find((content) => content.id === id);
};

export const getTodaysContent = (
  userLoginDate: string | null
): AppContent[] => {
  const available = getAvailableContent(userLoginDate);
  const photos = available.filter((c) => c.type === "photo").slice(0, 8);
  const videos = available.filter((c) => c.type === "video").slice(0, 2);
  return [...photos, ...videos];
};
