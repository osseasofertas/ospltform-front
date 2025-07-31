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

  // Day 7 - Photos (8)
  {
    id: 61,
    type: "photo",
    title: "Lifestyle Photo 49",
    url: "/5163637540312427090.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 7,
  },
  {
    id: 62,
    type: "photo",
    title: "Lifestyle Photo 50",
    url: "/4900035159471008654.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 7,
  },
  {
    id: 63,
    type: "photo",
    title: "Lifestyle Photo 51",
    url: "/5357541621371089099.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 7,
  },
  {
    id: 64,
    type: "photo",
    title: "Lifestyle Photo 52",
    url: "/5296393643696959305.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 7,
  },
  {
    id: 65,
    type: "photo",
    title: "Lifestyle Photo 53",
    url: "/5296393643696959303.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 7,
  },
  {
    id: 66,
    type: "photo",
    title: "Lifestyle Photo 54",
    url: "/5118636530842315675.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 7,
  },
  {
    id: 67,
    type: "photo",
    title: "Lifestyle Photo 55",
    url: "/5147677660883823487.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 7,
  },
  {
    id: 68,
    type: "photo",
    title: "Lifestyle Photo 56",
    url: "/73Fpa7mA_720p.mp4",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 7,
  },

  // Day 7 - Videos (2)
  {
    id: 69,
    type: "video",
    title: "Video Content 13",
    url: "/morra (4).mp4",
    minEarning: "20.00",
    maxEarning: "40.00",
    week: 7,
  },
  {
    id: 70,
    type: "video",
    title: "Video Content 14",
    url: "/hoJI7ckL_720p.mp4",
    minEarning: "20.00",
    maxEarning: "40.00",
    week: 7,
  },

  // Day 8 - Photos (8)
  {
    id: 71,
    type: "photo",
    title: "Lifestyle Photo 57",
    url: "/novias (2).mp4",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 8,
  },
  {
    id: 72,
    type: "photo",
    title: "Lifestyle Photo 58",
    url: "/VID_20230610_023950_116.mp4",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 8,
  },
  {
    id: 73,
    type: "photo",
    title: "Lifestyle Photo 59",
    url: "/orlmSEeA_720p.mp4",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 8,
  },
  {
    id: 74,
    type: "photo",
    title: "Lifestyle Photo 60",
    url: "/VID_20230428_114146_792.mp4",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 8,
  },
  {
    id: 75,
    type: "photo",
    title: "Lifestyle Photo 61",
    url: "/73Fpa7mA_720p.mp4",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 8,
  },
  {
    id: 76,
    type: "photo",
    title: "Lifestyle Photo 62",
    url: "/morra (4).mp4",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 8,
  },
  {
    id: 77,
    type: "photo",
    title: "Lifestyle Photo 63",
    url: "/hoJI7ckL_720p.mp4",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 8,
  },
  {
    id: 78,
    type: "photo",
    title: "Lifestyle Photo 64",
    url: "/novias (2).mp4",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 8,
  },

  // Day 8 - Videos (2)
  {
    id: 79,
    type: "video",
    title: "Video Content 15",
    url: "/VID_20230610_023950_116.mp4",
    minEarning: "20.00",
    maxEarning: "40.00",
    week: 8,
  },
  {
    id: 80,
    type: "video",
    title: "Video Content 16",
    url: "/novias (2).mp4",
    minEarning: "20.00",
    maxEarning: "40.00",
    week: 8,
  },

  // Day 9 - Photos (8) - Additional content for users with >10 evaluations
  {
    id: 81,
    type: "photo",
    title: "Lifestyle Photo 65",
    url: "/5118636530842315678.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 9,
  },
  {
    id: 82,
    type: "photo",
    title: "Lifestyle Photo 66",
    url: "/5136402710306860133.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 9,
  },
  {
    id: 83,
    type: "photo",
    title: "Lifestyle Photo 67",
    url: "/5136545475019779304.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 9,
  },
  {
    id: 84,
    type: "photo",
    title: "Lifestyle Photo 68",
    url: "/5145550466661329818.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 9,
  },
  {
    id: 85,
    type: "photo",
    title: "Lifestyle Photo 69",
    url: "/5186328200429546452.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 9,
  },
  {
    id: 86,
    type: "photo",
    title: "Lifestyle Photo 70",
    url: "/5213073953919188680.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 9,
  },
  {
    id: 87,
    type: "photo",
    title: "Lifestyle Photo 71",
    url: "/5031041780941958553.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 9,
  },
  {
    id: 88,
    type: "photo",
    title: "Lifestyle Photo 72",
    url: "/5048844351664401978.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 9,
  },

  // Day 9 - Videos (2)
  {
    id: 89,
    type: "video",
    title: "Video Content 17",
    url: "/video_2023-11-14_20-56-35 (2).mp4",
    minEarning: "20.00",
    maxEarning: "40.00",
    week: 9,
  },
  {
    id: 90,
    type: "video",
    title: "Video Content 18",
    url: "/video4922615369752905396.mp4",
    minEarning: "20.00",
    maxEarning: "40.00",
    week: 9,
  },

  // Day 10 - Photos (8) - Additional content for users with >10 evaluations
  {
    id: 91,
    type: "photo",
    title: "Lifestyle Photo 73",
    url: "/5114366259608267970.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 10,
  },
  {
    id: 92,
    type: "photo",
    title: "Lifestyle Photo 74",
    url: "/5116545710697851820.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 10,
  },
  {
    id: 93,
    type: "photo",
    title: "Lifestyle Photo 75",
    url: "/4925039673089306356.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 10,
  },
  {
    id: 94,
    type: "photo",
    title: "Lifestyle Photo 76",
    url: "/4920311639945883436.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 10,
  },
  {
    id: 95,
    type: "photo",
    title: "Lifestyle Photo 77",
    url: "/4900035159471008654.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 10,
  },
  {
    id: 96,
    type: "photo",
    title: "Lifestyle Photo 78",
    url: "/4900035159471008655.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 10,
  },
  {
    id: 97,
    type: "photo",
    title: "Lifestyle Photo 79",
    url: "/4900035159471008656.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 10,
  },
  {
    id: 98,
    type: "photo",
    title: "Lifestyle Photo 80",
    url: "/4900035159471008657.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 10,
  },

  // Day 10 - Videos (2)
  {
    id: 99,
    type: "video",
    title: "Video Content 19",
    url: "/73Fpa7mA_720p.mp4",
    minEarning: "20.00",
    maxEarning: "40.00",
    week: 10,
  },
  {
    id: 100,
    type: "video",
    title: "Video Content 20",
    url: "/98HIIH9s_720p.mp4",
    minEarning: "20.00",
    maxEarning: "40.00",
    week: 10,
  },

  // Day 11 - Photos (8)
  {
    id: 101,
    type: "photo",
    title: "Lifestyle Photo 101",
    url: "/5118797510511537026.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 11,
  },
  {
    id: 102,
    type: "photo",
    title: "Lifestyle Photo 102",
    url: "/5134259933943016401.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 11,
  },
  {
    id: 103,
    type: "photo",
    title: "Lifestyle Photo 103",
    url: "/5242530935579211607.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 11,
  },
  {
    id: 104,
    type: "photo",
    title: "Lifestyle Photo 104",
    url: "/5206346274197061063.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 11,
  },
  {
    id: 105,
    type: "photo",
    title: "Lifestyle Photo 105",
    url: "/5086911226629434068.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 11,
  },
  {
    id: 106,
    type: "photo",
    title: "Lifestyle Photo 106",
    url: "/4933806156606975055.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 11,
  },
  {
    id: 107,
    type: "photo",
    title: "Lifestyle Photo 107",
    url: "/4997286164083878546.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 11,
  },
  {
    id: 108,
    type: "photo",
    title: "Lifestyle Photo 108",
    url: "/4997286164083878551.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 11,
  },

  // Day 11 - Videos (2)
  {
    id: 109,
    type: "video",
    title: "Video Content 101",
    url: "/zjd8wjlq_720p.mp4",
    minEarning: "20.00",
    maxEarning: "40.00",
    week: 11,
  },
  {
    id: 110,
    type: "video",
    title: "Video Content 102",
    url: "/IMG_8883.MOV",
    minEarning: "20.00",
    maxEarning: "40.00",
    week: 11,
  },

  // Day 12 - Photos (8)
  {
    id: 111,
    type: "photo",
    title: "Lifestyle Photo 109",
    url: "/5078321992117103410.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 12,
  },
  {
    id: 112,
    type: "photo",
    title: "Lifestyle Photo 110",
    url: "/5111814482098760497.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 12,
  },
  {
    id: 113,
    type: "photo",
    title: "Lifestyle Photo 111",
    url: "/5111814482098760501.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 12,
  },
  {
    id: 114,
    type: "photo",
    title: "Lifestyle Photo 112",
    url: "/5111814482098760509.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 12,
  },
  {
    id: 115,
    type: "photo",
    title: "Lifestyle Photo 113",
    url: "/5111814482098760649.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 12,
  },
  {
    id: 116,
    type: "photo",
    title: "Lifestyle Photo 114",
    url: "/5111814482098760653.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 12,
  },
  {
    id: 117,
    type: "photo",
    title: "Lifestyle Photo 115",
    url: "/5111961215361461194.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 12,
  },
  {
    id: 118,
    type: "photo",
    title: "Lifestyle Photo 116",
    url: "/5114213015175146020.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 12,
  },

  // Day 12 - Videos (2)
  {
    id: 119,
    type: "video",
    title: "Video Content 103",
    url: "/YZz5VwwX_720p.mp4",
    minEarning: "20.00",
    maxEarning: "40.00",
    week: 12,
  },
  {
    id: 120,
    type: "video",
    title: "Video Content 104",
    url: "/video_2023-11-14_20-56-35 (2).mp4",
    minEarning: "20.00",
    maxEarning: "40.00",
    week: 12,
  },

  // Day 13 - Photos (8)
  {
    id: 121,
    type: "photo",
    title: "Lifestyle Photo 117",
    url: "/5114213015175146056.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 13,
  },
  {
    id: 122,
    type: "photo",
    title: "Lifestyle Photo 118",
    url: "/5121131421509987288.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 13,
  },
  {
    id: 123,
    type: "photo",
    title: "Lifestyle Photo 119",
    url: "/5121131421509987307.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 13,
  },
  {
    id: 124,
    type: "photo",
    title: "Lifestyle Photo 120",
    url: "/5154475387227581379.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 13,
  },
  {
    id: 125,
    type: "photo",
    title: "Lifestyle Photo 121",
    url: "/5154475387227581382.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 13,
  },
  {
    id: 126,
    type: "photo",
    title: "Lifestyle Photo 122",
    url: "/5154475387227581387.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 13,
  },
  {
    id: 127,
    type: "photo",
    title: "Lifestyle Photo 123",
    url: "/5154475387227581390.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 13,
  },
  {
    id: 128,
    type: "photo",
    title: "Lifestyle Photo 124",
    url: "/4990512322053255276.jpg",
    minEarning: "6.00",
    maxEarning: "10.00",
    week: 13,
  },

  // Day 13 - Videos (2)
  {
    id: 129,
    type: "video",
    title: "Video Content 105",
    url: "/video4922615369752905396.mp4",
    minEarning: "20.00",
    maxEarning: "40.00",
    week: 13,
  },
  {
    id: 130,
    type: "video",
    title: "Video Content 106",
    url: "/VID_20230610_023950_116.mp4",
    minEarning: "20.00",
    maxEarning: "40.00",
    week: 13,
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
  return (daysDiff % 13) + 1; // Rotates between day 1 and 13 daily
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
  userLoginDate: string | null,
  dailyEvaluations: number = 10
): AppContent[] => {
  const available = getAvailableContent(userLoginDate);
  
  // If user has 10 or fewer evaluations, show base content (8 photos + 2 videos)
  if (dailyEvaluations <= 10) {
    const photos = available.filter((c) => c.type === "photo").slice(0, 8);
    const videos = available.filter((c) => c.type === "video").slice(0, 2);
    return [...photos, ...videos];
  }
  
  // If user has more than 10 evaluations, distribute content intelligently
  // This ensures no repetition by:
  // 1. Prioritizing current day content first
  // 2. Adding content from days furthest from current day (maximizing variety)
  // 3. Tracking used IDs to prevent duplicates
  // 4. Distributing content evenly across 7 days
  const currentDay = getContentDay(userLoginDate);
  
  // Calculate how many items we need from each day to reach the total
  const itemsPerDay = Math.ceil(dailyEvaluations / 7); // Distribute across 7 days
  const remainingItems = dailyEvaluations % 7;
  
  let result: AppContent[] = [];
  const usedIds = new Set<number>();
  
  // Start with current day content
  const currentDayContent = available;
  const currentDayPhotos = currentDayContent.filter((c) => c.type === "photo");
  const currentDayVideos = currentDayContent.filter((c) => c.type === "video");
  
  // Add current day content (prioritize current day)
  const currentDayItems = Math.min(itemsPerDay + (remainingItems > 0 ? 1 : 0), currentDayPhotos.length + currentDayVideos.length);
  const currentDayPhotosToAdd = currentDayPhotos.slice(0, Math.min(Math.floor(currentDayItems * 0.8), currentDayPhotos.length));
  const currentDayVideosToAdd = currentDayVideos.slice(0, Math.min(Math.floor(currentDayItems * 0.2), currentDayVideos.length));
  
  result = [...currentDayPhotosToAdd, ...currentDayVideosToAdd];
  
  // Track used IDs to avoid duplicates
  result.forEach(item => usedIds.add(item.id));
  
  // If we still need more content, add from other days in a smart order
  if (result.length < dailyEvaluations) {
    const remainingNeeded = dailyEvaluations - result.length;
    
    // Create a smart order of days to pull content from
    // Start with days that are furthest from current day to avoid repetition
    const dayOrder = [];
    for (let i = 1; i <= 13; i++) {
      if (i !== currentDay) {
        const distance = Math.min(Math.abs(i - currentDay), Math.abs(i - currentDay + 13), Math.abs(i - currentDay - 13));
        dayOrder.push({ day: i, distance });
      }
    }
    
    // Sort by distance (furthest first) to maximize variety
    dayOrder.sort((a, b) => b.distance - a.distance);
    
    let itemsAdded = 0;
    let dayIndex = 0;
    
    while (itemsAdded < remainingNeeded && dayIndex < dayOrder.length) {
      const targetDay = dayOrder[dayIndex].day;
      const dayContent = contentPool.filter((content) => content.week === targetDay);
      
      if (dayContent.length > 0) {
        // Filter out already used content
        const unusedContent = dayContent.filter((c) => !usedIds.has(c.id));
        const dayPhotos = unusedContent.filter((c) => c.type === "photo");
        const dayVideos = unusedContent.filter((c) => c.type === "video");
        
        // Calculate how many items to take from this day
        const itemsFromThisDay = Math.min(
          itemsPerDay,
          remainingNeeded - itemsAdded,
          dayPhotos.length + dayVideos.length
        );
        
        if (itemsFromThisDay > 0) {
          const photosToAdd = dayPhotos.slice(0, Math.min(Math.floor(itemsFromThisDay * 0.8), dayPhotos.length));
          const videosToAdd = dayVideos.slice(0, Math.min(Math.floor(itemsFromThisDay * 0.2), dayVideos.length));
          
          const newItems = [...photosToAdd, ...videosToAdd];
          result = [...result, ...newItems];
          
          // Track new IDs
          newItems.forEach(item => usedIds.add(item.id));
          itemsAdded += newItems.length;
        }
      }
      
      dayIndex++;
    }
  }
  
  // Ensure we don't return more items than the user's daily limit
  return result.slice(0, dailyEvaluations);
};
