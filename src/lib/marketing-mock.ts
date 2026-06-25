export type Platform = "instagram" | "tiktok" | "facebook";

export interface PlatformStats {
  followers: number;
  followerGrowth: number;
  totalLikes: number;
  totalPosts: number;
  avgEngagement: number;
}

export interface ClipPlatformMetrics {
  views: number;
  reach: number;
  avgWatchTimeSec: number;
  newFollows: number;
  shares: number;
  likes: number;
  comments: number;
  engagementRate: number;
}

export interface TimeSnapshot {
  label: string;
  instagram: Pick<ClipPlatformMetrics, "views" | "reach" | "engagementRate">;
  tiktok: Pick<ClipPlatformMetrics, "views" | "reach" | "engagementRate">;
  facebook: Pick<ClipPlatformMetrics, "views" | "reach" | "engagementRate">;
}

export interface Clip {
  id: string;
  title: string;
  publishedAt: string;
  description: string;
  primaryPlatform: Platform;
  instagram: ClipPlatformMetrics;
  tiktok: ClipPlatformMetrics;
  facebook: ClipPlatformMetrics;
  timeLog: TimeSnapshot[];
  viewsTimeline: number[];
}

// Platform overview stats
export const PLATFORM_STATS: Record<Platform, PlatformStats> = {
  instagram: {
    followers: 128400,
    followerGrowth: 3.2,
    totalLikes: 2100000,
    totalPosts: 248,
    avgEngagement: 7.3,
  },
  tiktok: {
    followers: 94800,
    followerGrowth: 8.7,
    totalLikes: 3400000,
    totalPosts: 184,
    avgEngagement: 10.2,
  },
  facebook: {
    followers: 61200,
    followerGrowth: -0.4,
    totalLikes: 892000,
    totalPosts: 312,
    avgEngagement: 4.9,
  },
};

// 30-day view totals per day (for chart)
export const MONTHLY_VIEWS: Record<Platform, number[]> = {
  instagram: [12000,14500,11200,18000,15400,22000,19800,27000,23000,31000,28000,35000,29000,33000,31000,38000,35000,29000,36000,32000,40000,37000,34000,42000,38000,36000,44000,41000,39000,48000],
  tiktok: [8000,11000,9500,14000,12000,18000,15000,22000,19000,26000,23000,30000,25000,29000,27000,34000,30000,25000,32000,28000,36000,33000,30000,38000,34000,32000,40000,37000,35000,44000],
  facebook: [3000,3800,2900,4200,3600,5100,4500,6000,5200,7100,6400,8200,6800,7800,7300,9000,8100,6800,8600,7400,9800,8900,8200,10500,9200,8800,11000,10200,9600,12000],
};

export const CLIPS: Clip[] = [
  {
    id: "1",
    title: "Morning Routine — วิถีชีวิตประจำวัน",
    publishedAt: "2026-05-20",
    description: "แชร์วิถีชีวิตตั้งแต่ตื่นนอนถึงออกจากบ้าน",
    primaryPlatform: "instagram",
    instagram: { views: 201432, reach: 183290, avgWatchTimeSec: 38, newFollows: 1842, shares: 4210, likes: 14920, comments: 892, engagementRate: 12.1 },
    tiktok:    { views: 84208,  reach: 71044,  avgWatchTimeSec: 23, newFollows: 730,  shares: 3120, likes: 6148,  comments: 312,  engagementRate: 7.3  },
    facebook:  { views: 54120,  reach: 49200,  avgWatchTimeSec: 68, newFollows: 210,  shares: 1840, likes: 3290,  comments: 418,  engagementRate: 6.8  },
    timeLog: [
      { label: "1h",  instagram: { views: 12400,  reach: 10800,  engagementRate: 9.2  }, tiktok: { views: 5200,  reach: 4400,  engagementRate: 5.8  }, facebook: { views: 2100,  reach: 1900,  engagementRate: 4.1  } },
      { label: "5h",  instagram: { views: 48200,  reach: 43100,  engagementRate: 10.4 }, tiktok: { views: 22400, reach: 18900, engagementRate: 6.4  }, facebook: { views: 12800, reach: 11600, engagementRate: 5.4  } },
      { label: "24h", instagram: { views: 148000, reach: 132000, engagementRate: 11.8 }, tiktok: { views: 63000, reach: 53000, engagementRate: 7.1  }, facebook: { views: 38400, reach: 34900, engagementRate: 6.2  } },
      { label: "48h", instagram: { views: 201432, reach: 183290, engagementRate: 12.1 }, tiktok: { views: 84208, reach: 71044, engagementRate: 7.3  }, facebook: { views: 54120, reach: 49200, engagementRate: 6.8  } },
    ],
    viewsTimeline: [8,18,36,72,95,88,80,74,70,66,62,58,62,56,50,48,44,42,40,38,36,34,32,30,28,26,24,22,20,18,16,14,13,12,11,10,9,9,8,8,7,7,6,6,6,5,5,5],
  },
  {
    id: "2",
    title: "Product Review — รีวิวสินค้า Collection ใหม่",
    publishedAt: "2026-05-18",
    description: "รีวิว Collection ใหม่ประจำซีซัน",
    primaryPlatform: "tiktok",
    instagram: { views: 54120,  reach: 48300,  avgWatchTimeSec: 29, newFollows: 480,  shares: 1240, likes: 4820,  comments: 284,  engagementRate: 6.8  },
    tiktok:    { views: 128000, reach: 112400, avgWatchTimeSec: 31, newFollows: 1240, shares: 5800, likes: 10200, comments: 648,  engagementRate: 10.4 },
    facebook:  { views: 21800,  reach: 19400,  avgWatchTimeSec: 55, newFollows: 88,   shares: 680,  likes: 1420,  comments: 176,  engagementRate: 4.4  },
    timeLog: [
      { label: "1h",  instagram: { views: 3200,  reach: 2900,  engagementRate: 5.2  }, tiktok: { views: 8400,  reach: 7200,  engagementRate: 7.8  }, facebook: { views: 820,   reach: 740,   engagementRate: 3.2  } },
      { label: "5h",  instagram: { views: 14800, reach: 13200, engagementRate: 5.9  }, tiktok: { views: 42000, reach: 37000, engagementRate: 8.8  }, facebook: { views: 6400,  reach: 5700,  engagementRate: 3.8  } },
      { label: "24h", instagram: { views: 40200, reach: 35900, engagementRate: 6.4  }, tiktok: { views: 98000, reach: 86000, engagementRate: 9.8  }, facebook: { views: 15600, reach: 13900, engagementRate: 4.1  } },
      { label: "48h", instagram: { views: 54120, reach: 48300, engagementRate: 6.8  }, tiktok: { views: 128000,reach: 112400,engagementRate: 10.4 }, facebook: { views: 21800, reach: 19400, engagementRate: 4.4  } },
    ],
    viewsTimeline: [12,28,52,88,100,94,86,78,72,66,60,55,58,52,46,43,40,37,35,32,30,28,26,24,22,20,18,17,15,14,13,12,11,10,9,8,8,7,7,6,6,5,5,5,4,4,4,3],
  },
  {
    id: "3",
    title: "Behind the scenes — งานถ่ายทำ",
    publishedAt: "2026-05-15",
    description: "เบื้องหลังการถ่ายทำคอนเทนต์ประจำเดือน",
    primaryPlatform: "facebook",
    instagram: { views: 32480,  reach: 28900,  avgWatchTimeSec: 24, newFollows: 214,  shares: 820,  likes: 2840,  comments: 142,  engagementRate: 5.2  },
    tiktok:    { views: 47200,  reach: 41000,  avgWatchTimeSec: 18, newFollows: 380,  shares: 2140, likes: 3920,  comments: 248,  engagementRate: 6.4  },
    facebook:  { views: 32540,  reach: 29100,  avgWatchTimeSec: 108,newFollows: 210,  shares: 584,  likes: 1594,  comments: 148,  engagementRate: 4.9  },
    timeLog: [
      { label: "1h",  instagram: { views: 1800,  reach: 1600,  engagementRate: 3.8  }, tiktok: { views: 2800,  reach: 2400,  engagementRate: 4.6  }, facebook: { views: 1400,  reach: 1260,  engagementRate: 3.4  } },
      { label: "5h",  instagram: { views: 8400,  reach: 7500,  engagementRate: 4.4  }, tiktok: { views: 14200, reach: 12400, engagementRate: 5.4  }, facebook: { views: 8800,  reach: 7900,  engagementRate: 3.9  } },
      { label: "24h", instagram: { views: 24000, reach: 21400, engagementRate: 4.9  }, tiktok: { views: 36000, reach: 31400, engagementRate: 6.0  }, facebook: { views: 22800, reach: 20400, engagementRate: 4.6  } },
      { label: "48h", instagram: { views: 32480, reach: 28900, engagementRate: 5.2  }, tiktok: { views: 47200, reach: 41000, engagementRate: 6.4  }, facebook: { views: 32540, reach: 29100, engagementRate: 4.9  } },
    ],
    viewsTimeline: [5,12,24,42,58,64,60,54,48,43,38,34,36,32,28,26,24,22,20,19,17,16,15,14,13,12,11,10,9,9,8,7,7,6,6,5,5,5,4,4,4,3,3,3,2,2,2,2],
  },
  {
    id: "4",
    title: "Day in my life — วันในชีวิตประจำวัน",
    publishedAt: "2026-05-12",
    description: "Follow me ทั้งวัน ตั้งแต่เช้าถึงค่ำ",
    primaryPlatform: "instagram",
    instagram: { views: 89400,  reach: 79800,  avgWatchTimeSec: 42, newFollows: 820,  shares: 2180, likes: 7840,  comments: 412,  engagementRate: 8.9  },
    tiktok:    { views: 62400,  reach: 54200,  avgWatchTimeSec: 26, newFollows: 540,  shares: 2840, likes: 5120,  comments: 324,  engagementRate: 7.8  },
    facebook:  { views: 28400,  reach: 25400,  avgWatchTimeSec: 74, newFollows: 142,  shares: 840,  likes: 1840,  comments: 218,  engagementRate: 4.2  },
    timeLog: [
      { label: "1h",  instagram: { views: 5400,  reach: 4800,  engagementRate: 6.4  }, tiktok: { views: 3800,  reach: 3300,  engagementRate: 5.8  }, facebook: { views: 1100,  reach: 980,   engagementRate: 3.0  } },
      { label: "5h",  instagram: { views: 24200, reach: 21600, engagementRate: 7.4  }, tiktok: { views: 20000, reach: 17400, engagementRate: 6.6  }, facebook: { views: 8200,  reach: 7300,  engagementRate: 3.6  } },
      { label: "24h", instagram: { views: 66000, reach: 58900, engagementRate: 8.4  }, tiktok: { views: 47400, reach: 41200, engagementRate: 7.2  }, facebook: { views: 20200, reach: 18100, engagementRate: 3.9  } },
      { label: "48h", instagram: { views: 89400, reach: 79800, engagementRate: 8.9  }, tiktok: { views: 62400, reach: 54200, engagementRate: 7.8  }, facebook: { views: 28400, reach: 25400, engagementRate: 4.2  } },
    ],
    viewsTimeline: [6,15,30,56,78,84,80,74,68,62,56,51,54,48,42,40,37,34,32,30,28,26,24,22,20,18,17,15,14,13,12,11,10,9,8,8,7,7,6,6,5,5,5,4,4,4,3,3],
  },
  {
    id: "5",
    title: "Q&A — ถามตอบกับแฟนคลับ",
    publishedAt: "2026-05-08",
    description: "ตอบคำถามจากแฟนๆ ที่ส่งมาในอาทิตย์ที่ผ่านมา",
    primaryPlatform: "tiktok",
    instagram: { views: 44200,  reach: 39400,  avgWatchTimeSec: 32, newFollows: 380,  shares: 1420, likes: 3840,  comments: 620,  engagementRate: 7.1  },
    tiktok:    { views: 98400,  reach: 86200,  avgWatchTimeSec: 28, newFollows: 940,  shares: 4820, likes: 8140,  comments: 984,  engagementRate: 9.4  },
    facebook:  { views: 18400,  reach: 16400,  avgWatchTimeSec: 62, newFollows: 98,   shares: 520,  likes: 1240,  comments: 284,  engagementRate: 4.1  },
    timeLog: [
      { label: "1h",  instagram: { views: 2600,  reach: 2320,  engagementRate: 5.2  }, tiktok: { views: 6400,  reach: 5600,  engagementRate: 7.0  }, facebook: { views: 720,   reach: 640,   engagementRate: 2.9  } },
      { label: "5h",  instagram: { views: 12800, reach: 11400, engagementRate: 6.2  }, tiktok: { views: 32000, reach: 28000, engagementRate: 8.0  }, facebook: { views: 5400,  reach: 4820,  engagementRate: 3.4  } },
      { label: "24h", instagram: { views: 33000, reach: 29400, engagementRate: 6.8  }, tiktok: { views: 74000, reach: 64800, engagementRate: 8.8  }, facebook: { views: 13200, reach: 11800, engagementRate: 3.8  } },
      { label: "48h", instagram: { views: 44200, reach: 39400, engagementRate: 7.1  }, tiktok: { views: 98400, reach: 86200, engagementRate: 9.4  }, facebook: { views: 18400, reach: 16400, engagementRate: 4.1  } },
    ],
    viewsTimeline: [9,22,44,78,96,92,84,76,70,64,58,53,56,50,44,41,38,35,33,31,29,27,25,23,21,19,18,16,15,14,13,12,11,10,9,8,8,7,6,6,5,5,4,4,4,3,3,3],
  },
];

// Helper formatters
export function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function fmtSec(sec: number): string {
  if (sec >= 60) return `${Math.floor(sec / 60)}m ${sec % 60}s`;
  return `${sec}s`;
}

export const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
};

export const PLATFORM_COLORS: Record<Platform, { bg: string; text: string; light: string; border: string; icon: string }> = {
  instagram: { bg: "bg-pink-500",  text: "text-pink-600",  light: "bg-pink-50",  border: "border-pink-100", icon: "text-pink-500" },
  tiktok:    { bg: "bg-slate-800", text: "text-slate-700", light: "bg-slate-50", border: "border-slate-200", icon: "text-slate-600" },
  facebook:  { bg: "bg-blue-600",  text: "text-blue-600",  light: "bg-blue-50",  border: "border-blue-100",  icon: "text-blue-500" },
};
