// PK进度相关类型
export interface PKProgress {
  redTeam: {
    totalAmount: number;
    likes: number;
    memberCount: number;
  };
  blueTeam: {
    totalAmount: number;
    memberCount: number;
  };
}

// PK里程碑类型
export interface PKMilestone {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  isUnlocked: boolean;
  reward?: string;
  icon?: string;
}

// 抽奖奖品类型
export interface Prize {
  id: string;
  name: string;
  description: string;
  image?: string;
  probability: number;
  isSpecial: boolean;
}

// 抽奖记录类型
export interface LotteryRecord {
  id: string;
  prizeId: string;
  prizeName: string;
  timestamp: string;
  isSpecial: boolean;
}

// 插旗进度类型
export interface FlagProgress {
  id: string;
  title: string;
  currentCount: number;
  targetCount: number;
  amount: number;
  isCompleted: boolean;
  participants: string[];
  flaggerId?: string;
  flagUrl?: string;
}

// 排行榜用户类型
export interface LeaderboardUser {
  id: string;
  name: string;
  amount: number;
  hasRoseCrown: boolean;
  rank: number;
  avatar?: string;
}

// 管理界面数据类型
export interface AdminData {
  pkProgress: PKProgress;
  milestones: PKMilestone[];
  prizes: Prize[];
  flagProgresses: FlagProgress[];
  leaderboard: LeaderboardUser[];
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// 组件Props类型
export interface PKProgressBarProps {
  data: PKProgress;
  onUpdate?: (data: PKProgress) => void;
}

export interface MilestoneSectionProps {
  milestones: PKMilestone[];
  currentAmount: number;
}

export interface LotterySectionProps {
  prizes: Prize[];
  records: LotteryRecord[];
  onSpin?: () => void;
}

export interface FlagProgressSectionProps {
  progresses: FlagProgress[];
}

export interface LeaderboardSectionProps {
  users: LeaderboardUser[];
}
