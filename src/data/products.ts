import { AppContent } from "@/types";

// Content rotation system - changes every day
const CONTENT_ROTATION_DAYS = 1;

// All available content pool - ready for frontend-only hosting
const contentPool: AppContent[] = [
  // Day 1 - Photos (8)
  {
    id: 1,
    type: "photo",
    title: "Lifestyle Photo 1",
    url: "/PT1.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 1,
  },
  {
    id: 2,
    type: "photo",
    title: "Lifestyle Photo 2",
    url: "/PT2.png",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 1,
  },
  {
    id: 3,
    type: "photo",
    title: "Lifestyle Photo 3",
    url: "/PT3.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 1,
  },
  {
    id: 4,
    type: "photo",
    title: "Lifestyle Photo 4",
    url: "/PT4.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 1,
  },
  {
    id: 5,
    type: "photo",
    title: "Lifestyle Photo 5",
    url: "/PT5.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 1,
  },
  {
    id: 6,
    type: "photo",
    title: "Lifestyle Photo 6",
    url: "/PT6.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 1,
  },
  {
    id: 7,
    type: "photo",
    title: "Lifestyle Photo 7",
    url: "/PT7.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 1,
  },
  {
    id: 8,
    type: "photo",
    title: "Lifestyle Photo 8",
    url: "/PT8.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 1,
  },

  // Day 1 - Videos (2)
  {
    id: 9,
    type: "video",
    title: "Video Content 1",
    url: "/PT1.mp4",
    minEarning: "20.00",
    maxEarning: "40.00",
    week: 1,
  },
  {
    id: 10,
    type: "video",
    title: "Video Content 2",
    url: "/PT2.mp4",
    minEarning: "20.00",
    maxEarning: "40.00",
    week: 1,
  },

  // Day 2 - Photos (8)
  {
    id: 11,
    type: "photo",
    title: "Lifestyle Photo 9",
    url: "/PT9.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 2,
  },
  {
    id: 12,
    type: "photo",
    title: "Lifestyle Photo 10",
    url: "/PT10.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 2,
  },
  {
    id: 13,
    type: "photo",
    title: "Lifestyle Photo 11",
    url: "/PT11.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 2,
  },
  {
    id: 14,
    type: "photo",
    title: "Lifestyle Photo 12",
    url: "/PT12.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 2,
  },
  {
    id: 15,
    type: "photo",
    title: "Lifestyle Photo 13",
    url: "/PT13.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 2,
  },
  {
    id: 16,
    type: "photo",
    title: "Lifestyle Photo 14",
    url: "/PT14.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 2,
  },
  {
    id: 17,
    type: "photo",
    title: "Lifestyle Photo 15",
    url: "/PT15.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 2,
  },
  {
    id: 18,
    type: "photo",
    title: "Lifestyle Photo 16",
    url: "/PT16.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 2,
  },

  // Day 2 - Videos (2)
  {
    id: 19,
    type: "video",
    title: "Video Content 3",
    url: "/PT3.mp4",
    minEarning: "20.00",
    maxEarning: "40.00",
    week: 2,
  },
  {
    id: 20,
    type: "video",
    title: "Video Content 4",
    url: "/PT4.mp4",
    minEarning: "20.00",
    maxEarning: "40.00",
    week: 2,
  },

  // Day 3 - Photos (8)
  {
    id: 21,
    type: "photo",
    title: "Lifestyle Photo 17",
    url: "/PT17.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 3,
  },
  {
    id: 22,
    type: "photo",
    title: "Lifestyle Photo 18",
    url: "/5220062295206520047.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 3,
  },
  {
    id: 23,
    type: "photo",
    title: "Lifestyle Photo 19",
    url: "/5181575436864433849.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 3,
  },
  {
    id: 24,
    type: "photo",
    title: "Lifestyle Photo 20",
    url: "/5008065733132922372.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 3,
  },
  {
    id: 25,
    type: "photo",
    title: "Lifestyle Photo 21",
    url: "/5008065733132922371.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 3,
  },
  {
    id: 26,
    type: "photo",
    title: "Lifestyle Photo 22",
    url: "/5004042804770483713.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 3,
  },
  {
    id: 27,
    type: "photo",
    title: "Lifestyle Photo 23",
    url: "/5053449978239888485.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 3,
  },
  {
    id: 28,
    type: "photo",
    title: "Lifestyle Photo 24",
    url: "/5073604073621662881.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 3,
  },

  // Day 3 - Videos (2)
  {
    id: 29,
    type: "video",
    title: "Video Content 5",
    url: "/BabyKaitt (52).mp4",
    minEarning: "20.00",
    maxEarning: "40.00",
    week: 3,
  },
  {
    id: 30,
    type: "video",
    title: "Video Content 6",
    url: "/S21fcsSo_720p.mp4",
    minEarning: "20.00",
    maxEarning: "40.00",
    week: 3,
  },

  // Day 4 - Photos (8)
  {
    id: 31,
    type: "photo",
    title: "Lifestyle Photo 25",
    url: "/4904486051259723458.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 4,
  },
  {
    id: 32,
    type: "photo",
    title: "Lifestyle Photo 26",
    url: "/4904486051259723443.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 4,
  },
  {
    id: 33,
    type: "photo",
    title: "Lifestyle Photo 27",
    url: "/5134509475837881351.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 4,
  },
  {
    id: 34,
    type: "photo",
    title: "Lifestyle Photo 28",
    url: "/5134509475837881353.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 4,
  },
  {
    id: 35,
    type: "photo",
    title: "Lifestyle Photo 29",
    url: "/4915844977037257491.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 4,
  },
  {
    id: 36,
    type: "photo",
    title: "Lifestyle Photo 30",
    url: "/4986038447894539272.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 4,
  },
  {
    id: 37,
    type: "photo",
    title: "Lifestyle Photo 31",
    url: "/5111814482098760498.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 4,
  },
  {
    id: 38,
    type: "photo",
    title: "Lifestyle Photo 32",
    url: "/5121131421509987286.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 4,
  },

  // Day 4 - Videos (2)
  {
    id: 39,
    type: "video",
    title: "Video Content 7",
    url: "/5.mp4",
    minEarning: "20.00",
    maxEarning: "40.00",
    week: 4,
  },
  {
    id: 40,
    type: "video",
    title: "Video Content 8",
    url: "/98HIIH9s_720p.mp4",
    minEarning: "20.00",
    maxEarning: "40.00",
    week: 4,
  },

  // Day 5 - Photos (8)
  {
    id: 41,
    type: "photo",
    title: "Lifestyle Photo 33",
    url: "/5152223587413895900.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 5,
  },
  {
    id: 42,
    type: "photo",
    title: "Lifestyle Photo 34",
    url: "/5154475387227581380.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 5,
  },
  {
    id: 43,
    type: "photo",
    title: "Lifestyle Photo 35",
    url: "/5156648322851777423.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 5,
  },
  {
    id: 44,
    type: "photo",
    title: "Lifestyle Photo 36",
    url: "/4900035159471008657.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 5,
  },
  {
    id: 45,
    type: "photo",
    title: "Lifestyle Photo 37",
    url: "/4900035159471008656.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 5,
  },
  {
    id: 46,
    type: "photo",
    title: "Lifestyle Photo 38",
    url: "/4900035159471008655.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 5,
  },
  {
    id: 47,
    type: "photo",
    title: "Lifestyle Photo 39",
    url: "/5357541621371089097.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 5,
  },
  {
    id: 48,
    type: "photo",
    title: "Lifestyle Photo 40",
    url: "/5053478784585542819.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 5,
  },

  // Day 5 - Videos (2)
  {
    id: 49,
    type: "video",
    title: "Video Content 9",
    url: "/HappyDix-Lia-Daniela (7).mp4",
    minEarning: "20.00",
    maxEarning: "40.00",
    week: 5,
  },
  {
    id: 50,
    type: "video",
    title: "Video Content 10",
    url: "/ge4rWqHz_720p.mp4",
    minEarning: "20.00",
    maxEarning: "40.00",
    week: 5,
  },

  // Day 6 - Photos (8)
  {
    id: 51,
    type: "photo",
    title: "Lifestyle Photo 41",
    url: "/5053478784585542818.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 6,
  },
  {
    id: 52,
    type: "photo",
    title: "Lifestyle Photo 42",
    url: "/5118636530842315674.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 6,
  },
  {
    id: 53,
    type: "photo",
    title: "Lifestyle Photo 43",
    url: "/5053449978239888484.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 6,
  },
  {
    id: 54,
    type: "photo",
    title: "Lifestyle Photo 44",
    url: "/5938551903682152313.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 6,
  },
  {
    id: 55,
    type: "photo",
    title: "Lifestyle Photo 45",
    url: "/5037378266452833080.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 6,
  },
  {
    id: 56,
    type: "photo",
    title: "Lifestyle Photo 46",
    url: "/orlmSEeA_720p.mp4",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 6,
  },
  {
    id: 57,
    type: "photo",
    title: "Lifestyle Photo 47",
    url: "/VID_20230428_114146_792.mp4",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 6,
  },
  {
    id: 58,
    type: "photo",
    title: "Lifestyle Photo 48",
    url: "/73Fpa7mA_720p.mp4",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 6,
  },

  // Day 6 - Videos (2)
  {
    id: 59,
    type: "video",
    title: "Video Content 11",
    url: "/orlmSEeA_720p.mp4",
    minEarning: "20.00",
    maxEarning: "40.00",
    week: 6,
  },
  {
    id: 60,
    type: "video",
    title: "Video Content 12",
    url: "/VID_20230428_114146_792.mp4",
    minEarning: "20.00",
    maxEarning: "40.00",
    week: 6,
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
  return (daysDiff % 6) + 1; // Rotates between day 1 and 6 daily
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
