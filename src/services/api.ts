import axios from "axios";
import type {
  PKProgress,
  PKMilestone,
  Prize,
  LotteryRecord,
  FlagProgress,
  LeaderboardUser,
  ApiResponse,
} from "../types";

const API_BASE_URL = "http://localhost:5001/api";

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    console.log("API Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// PK进度相关API
export const pkProgressApi = {
  // 获取PK进度
  getProgress: (): Promise<ApiResponse<PKProgress>> =>
    api.get("/pk-progress").then((res) => res.data),

  // 更新PK进度
  updateProgress: (data: PKProgress): Promise<ApiResponse<PKProgress>> =>
    api.put("/pk-progress", data).then((res) => res.data),
};

// 里程碑相关API
export const milestoneApi = {
  // 获取所有里程碑
  getAll: (): Promise<ApiResponse<PKMilestone[]>> =>
    api.get("/milestones").then((res) => res.data),

  // 创建里程碑
  create: (
    milestone: Omit<PKMilestone, "id">
  ): Promise<ApiResponse<PKMilestone>> =>
    api.post("/milestones", milestone).then((res) => res.data),

  // 更新里程碑
  update: (
    id: string,
    milestone: Partial<PKMilestone>
  ): Promise<ApiResponse<PKMilestone>> =>
    api.put(`/milestones/${id}`, milestone).then((res) => res.data),

  // 删除里程碑
  delete: (id: string): Promise<ApiResponse<void>> =>
    api.delete(`/milestones/${id}`).then((res) => res.data),
};

// 抽奖相关API
export const lotteryApi = {
  // 获取所有奖品
  getPrizes: (): Promise<ApiResponse<Prize[]>> =>
    api.get("/lottery/prizes").then((res) => res.data),

  // 创建奖品
  createPrize: (prize: Omit<Prize, "id">): Promise<ApiResponse<Prize>> =>
    api.post("/lottery/prizes", prize).then((res) => res.data),

  // 更新奖品
  updatePrize: (
    id: string,
    prize: Partial<Prize>
  ): Promise<ApiResponse<Prize>> =>
    api.put(`/lottery/prizes/${id}`, prize).then((res) => res.data),

  // 删除奖品
  deletePrize: (id: string): Promise<ApiResponse<void>> =>
    api.delete(`/lottery/prizes/${id}`).then((res) => res.data),

  // 获取抽奖记录
  getRecords: (): Promise<ApiResponse<LotteryRecord[]>> =>
    api.get("/lottery/records").then((res) => res.data),

  // 执行抽奖
  spin: (): Promise<ApiResponse<LotteryRecord>> =>
    api.post("/lottery/spin").then((res) => res.data),
};

// 插旗进度相关API
export const flagProgressApi = {
  // 获取所有插旗进度
  getAll: (): Promise<ApiResponse<FlagProgress[]>> =>
    api.get("/flag-progress").then((res) => res.data),

  // 创建插旗进度
  create: (
    progress: Omit<FlagProgress, "id">
  ): Promise<ApiResponse<FlagProgress>> =>
    api.post("/flag-progress", progress).then((res) => res.data),

  // 更新插旗进度
  update: (
    id: string,
    progress: Partial<FlagProgress>
  ): Promise<ApiResponse<FlagProgress>> =>
    api.put(`/flag-progress/${id}`, progress).then((res) => res.data),

  // 删除插旗进度
  delete: (id: string): Promise<ApiResponse<void>> =>
    api.delete(`/flag-progress/${id}`).then((res) => res.data),

  // 添加参与者
  addParticipant: (
    id: string,
    participant: string
  ): Promise<ApiResponse<FlagProgress>> =>
    api
      .post(`/flag-progress/${id}/participants`, { participant })
      .then((res) => res.data),
};

// 排行榜相关API
export const leaderboardApi = {
  // 获取排行榜
  getLeaderboard: (): Promise<ApiResponse<LeaderboardUser[]>> =>
    api.get("/leaderboard").then((res) => res.data),

  // 添加用户
  addUser: (
    user: Omit<LeaderboardUser, "id" | "rank">
  ): Promise<ApiResponse<LeaderboardUser>> =>
    api.post("/leaderboard", user).then((res) => res.data),

  // 更新用户
  updateUser: (
    id: string,
    user: Partial<LeaderboardUser>
  ): Promise<ApiResponse<LeaderboardUser>> =>
    api.put(`/leaderboard/${id}`, user).then((res) => res.data),

  // 删除用户
  deleteUser: (id: string): Promise<ApiResponse<void>> =>
    api.delete(`/leaderboard/${id}`).then((res) => res.data),
};

// 红队成员相关API
export const redTeamMembersApi = {
  // 获取所有红队成员
  getAll: (): Promise<ApiResponse<any[]>> =>
    api.get("/red-team-members").then((res) => res.data),

  // 创建红队成员
  create: (member: any): Promise<ApiResponse<any>> =>
    api.post("/red-team-members", member).then((res) => res.data),

  // 更新红队成员
  update: (id: string, member: any): Promise<ApiResponse<any>> =>
    api.put(`/red-team-members/${id}`, member).then((res) => res.data),

  // 删除红队成员
  delete: (id: string): Promise<ApiResponse<void>> =>
    api.delete(`/red-team-members/${id}`).then((res) => res.data),
};

// 管理界面相关API
export const adminApi = {
  // 获取所有数据
  getAllData: (): Promise<
    ApiResponse<{
      pkProgress: PKProgress;
      milestones: PKMilestone[];
      prizes: Prize[];
      flagProgresses: FlagProgress[];
      leaderboard: LeaderboardUser[];
      redTeamMembers: any[];
    }>
  > => api.get("/admin/all-data").then((res) => res.data),

  // 重置所有数据
  resetAllData: (): Promise<ApiResponse<void>> =>
    api.post("/admin/reset").then((res) => res.data),
};

export default api;
