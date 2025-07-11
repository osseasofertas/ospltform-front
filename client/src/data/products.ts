import { AppContent } from "@/types";

// Content rotation system - changes every 7 days
const CONTENT_ROTATION_DAYS = 7;

// All available content pool - ready for frontend-only hosting
const contentPool: AppContent[] = [
  // Week 1 - Photos (8)
  { id: 1, type: "photo", title: "Lifestyle Photo 1", url: "/attached_assets/prints/PT1.png", minEarning: "6.00", maxEarning: "10.00", week: 1 },
  { id: 2, type: "photo", title: "Lifestyle Photo 2", url: "/attached_assets/prints/PT2.png", minEarning: "6.00", maxEarning: "10.00", week: 1 },
  { id: 3, type: "photo", title: "Lifestyle Photo 3", url: "/attached_assets/prints/PT3.png", minEarning: "6.00", maxEarning: "10.00", week: 1 },
  { id: 4, type: "photo", title: "Lifestyle Photo 4", url: "/attached_assets/prints/PT4.png", minEarning: "6.00", maxEarning: "10.00", week: 1 },
  { id: 5, type: "photo", title: "Lifestyle Photo 5", url: "/attached_assets/prints/PT5.png", minEarning: "6.00", maxEarning: "10.00", week: 1 },
  { id: 6, type: "photo", title: "Lifestyle Photo 6", url: "/attached_assets/prints/PT6.png", minEarning: "6.00", maxEarning: "10.00", week: 1 },
  { id: 7, type: "photo", title: "Lifestyle Photo 7", url: "/attached_assets/prints/PT7.png", minEarning: "6.00", maxEarning: "10.00", week: 1 },
  { id: 8, type: "photo", title: "Lifestyle Photo 8", url: "/attached_assets/prints/PT8.png", minEarning: "6.00", maxEarning: "10.00", week: 1 },
  
  // Week 1 - Videos (2)
  { id: 9, type: "video", title: "Video Content 1", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4", minEarning: "20.00", maxEarning: "40.00", week: 1 },
  { id: 10, type: "video", title: "Video Content 2", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4", minEarning: "20.00", maxEarning: "40.00", week: 1 },

  // Week 2 - Photos (8)
  { id: 11, type: "photo", title: "Lifestyle Photo 9", url: "/attached_assets/prints/PT10.png", minEarning: "6.00", maxEarning: "10.00", week: 2 },
  { id: 12, type: "photo", title: "Lifestyle Photo 10", url: "/attached_assets/prints/PT11.png", minEarning: "6.00", maxEarning: "10.00", week: 2 },
  { id: 13, type: "photo", title: "Lifestyle Photo 11", url: "/attached_assets/prints/PT12.png", minEarning: "6.00", maxEarning: "10.00", week: 2 },
  { id: 14, type: "photo", title: "Lifestyle Photo 12", url: "/attached_assets/prints/PT13.png", minEarning: "6.00", maxEarning: "10.00", week: 2 },
  { id: 15, type: "photo", title: "Lifestyle Photo 13", url: "/attached_assets/prints/PT14.png", minEarning: "6.00", maxEarning: "10.00", week: 2 },
  { id: 16, type: "photo", title: "Lifestyle Photo 14", url: "/attached_assets/prints/PT15.png", minEarning: "6.00", maxEarning: "10.00", week: 2 },
  { id: 17, type: "photo", title: "Lifestyle Photo 15", url: "/attached_assets/prints/PT16.png", minEarning: "6.00", maxEarning: "10.00", week: 2 },
  { id: 18, type: "photo", title: "Lifestyle Photo 16", url: "/attached_assets/prints/PT17.png", minEarning: "6.00", maxEarning: "10.00", week: 2 },
  
  // Week 2 - Videos (2)
  { id: 19, type: "video", title: "Video Content 3", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4", minEarning: "20.00", maxEarning: "40.00", week: 2 },
  { id: 20, type: "video", title: "Video Content 4", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4", minEarning: "20.00", maxEarning: "40.00", week: 2 },
];

// Calculate current week based on app start date
const getContentWeek = (): number => {
  const appStartDate = new Date('2025-01-01'); // Set your app start date
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - appStartDate.getTime()) / (1000 * 60 * 60 * 24));
  return Math.floor(daysDiff / CONTENT_ROTATION_DAYS) % 2 + 1; // Rotates between week 1 and 2
};

export const getAvailableContent = (): AppContent[] => {
  const currentWeek = getContentWeek();
  return contentPool.filter(content => content.week === currentWeek);
};

export const getContent = (id: number): AppContent | undefined => {
  return contentPool.find(content => content.id === id);
};

export const getTodaysContent = (): AppContent[] => {
  const available = getAvailableContent();
  const photos = available.filter(c => c.type === "photo").slice(0, 8);
  const videos = available.filter(c => c.type === "video").slice(0, 2);
  return [...photos, ...videos];
};