import { useState, useEffect, useCallback, useRef } from "react";
import { message } from "antd";
import type {
  PKProgress,
  PKMilestone,
  Prize,
  LotteryRecord,
  FlagProgress,
  LeaderboardUser,
} from "../types";
import {
  pkProgressApi,
  milestoneApi,
  lotteryApi,
  flagProgressApi,
  leaderboardApi,
} from "../services/api";

export function usePKProgress() {
  const [data, setData] = useState<PKProgress>({
    redTeam: { totalAmount: 0, likes: 0, memberCount: 0 },
    blueTeam: { totalAmount: 0, memberCount: 0 },
  });
  const [loading, setLoading] = useState(false);
  const isInitialized = useRef(false);

  const fetchData = useCallback(async (showLoading = true) => {
    if (showLoading && !isInitialized.current) setLoading(true);

    // 添加超时处理
    const timeoutId = setTimeout(() => {
      if (!isInitialized.current) {
        console.warn("PK进度API调用超时，强制结束loading状态");
        isInitialized.current = true;
        setLoading(false);
      }
    }, 10000); // 10秒超时

    try {
      const response = await pkProgressApi.getProgress();
      clearTimeout(timeoutId);
      if (response.success) {
        setData(response.data);
        isInitialized.current = true;
      }
    } catch (error) {
      clearTimeout(timeoutId);
      message.error("获取PK进度失败");
      console.error("获取PK进度失败:", error);
      // 即使失败也要标记为已初始化，避免无限loading
      isInitialized.current = true;
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  const updateData = useCallback(async (newData: PKProgress) => {
    setLoading(true);
    try {
      const response = await pkProgressApi.updateProgress(newData);
      if (response.success) {
        setData(response.data);
        message.success("更新PK进度成功");
      }
    } catch (error) {
      message.error("更新PK进度失败");
      console.error("更新PK进度失败:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isInitialized.current) {
      fetchData();
    }
  }, [fetchData]);

  return { data, loading, updateData, refetch: fetchData };
}

export function useMilestones() {
  const [data, setData] = useState<PKMilestone[]>([]);
  const [loading, setLoading] = useState(false);
  const isInitialized = useRef(false);

  const fetchData = useCallback(async (showLoading = true) => {
    if (showLoading && !isInitialized.current) setLoading(true);
    try {
      const response = await milestoneApi.getAll();
      if (response.success) {
        setData(response.data);
        isInitialized.current = true;
      }
    } catch (error) {
      message.error("获取里程碑失败");
      console.error("获取里程碑失败:", error);
      // 即使失败也要标记为已初始化，避免无限loading
      isInitialized.current = true;
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  const createMilestone = useCallback(
    async (milestone: Omit<PKMilestone, "id">) => {
      try {
        const response = await milestoneApi.create(milestone);
        if (response.success) {
          setData((prev) => [...prev, response.data]);
          message.success("创建里程碑成功");
          return response.data;
        }
      } catch (error) {
        message.error("创建里程碑失败");
        console.error("创建里程碑失败:", error);
      }
    },
    []
  );

  const updateMilestone = useCallback(
    async (id: string, milestone: Partial<PKMilestone>) => {
      try {
        const response = await milestoneApi.update(id, milestone);
        if (response.success) {
          setData((prev) =>
            prev.map((item) => (item.id === id ? response.data : item))
          );
          message.success("更新里程碑成功");
          return response.data;
        }
      } catch (error) {
        message.error("更新里程碑失败");
        console.error("更新里程碑失败:", error);
      }
    },
    []
  );

  const deleteMilestone = useCallback(async (id: string) => {
    try {
      const response = await milestoneApi.delete(id);
      if (response.success) {
        setData((prev) => prev.filter((item) => item.id !== id));
        message.success("删除里程碑成功");
      }
    } catch (error) {
      message.error("删除里程碑失败");
      console.error("删除里程碑失败:", error);
    }
  }, []);

  useEffect(() => {
    if (!isInitialized.current) {
      fetchData();
    }
  }, [fetchData]);

  return {
    data,
    loading,
    createMilestone,
    updateMilestone,
    deleteMilestone,
    refetch: fetchData,
  };
}

export function useLottery() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [records, setRecords] = useState<LotteryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const isInitialized = useRef(false);

  const fetchPrizes = useCallback(async (showLoading = true) => {
    if (showLoading && !isInitialized.current) setLoading(true);
    try {
      const response = await lotteryApi.getPrizes();
      if (response.success) {
        setPrizes(response.data);
        isInitialized.current = true;
      }
    } catch (error) {
      message.error("获取奖品失败");
      console.error("获取奖品失败:", error);
    } finally {
      if (showLoading && !isInitialized.current) setLoading(false);
    }
  }, []);

  const fetchRecords = useCallback(async (showLoading = true) => {
    try {
      const response = await lotteryApi.getRecords();
      if (response.success) {
        setRecords(response.data);
      }
    } catch (error) {
      message.error("获取抽奖记录失败");
      console.error("获取抽奖记录失败:", error);
    }
  }, []);

  const createPrize = useCallback(async (prize: Omit<Prize, "id">) => {
    try {
      const response = await lotteryApi.createPrize(prize);
      if (response.success) {
        setPrizes((prev) => [...prev, response.data]);
        message.success("创建奖品成功");
        return response.data;
      }
    } catch (error) {
      message.error("创建奖品失败");
      console.error("创建奖品失败:", error);
    }
  }, []);

  const updatePrize = useCallback(async (id: string, prize: Partial<Prize>) => {
    try {
      const response = await lotteryApi.updatePrize(id, prize);
      if (response.success) {
        setPrizes((prev) =>
          prev.map((item) => (item.id === id ? response.data : item))
        );
        message.success("更新奖品成功");
        return response.data;
      }
    } catch (error) {
      message.error("更新奖品失败");
      console.error("更新奖品失败:", error);
    }
  }, []);

  const deletePrize = useCallback(async (id: string) => {
    try {
      const response = await lotteryApi.deletePrize(id);
      if (response.success) {
        setPrizes((prev) => prev.filter((item) => item.id !== id));
        message.success("删除奖品成功");
      }
    } catch (error) {
      message.error("删除奖品失败");
      console.error("删除奖品失败:", error);
    }
  }, []);

  const spin = useCallback(async () => {
    try {
      const response = await lotteryApi.spin();
      if (response.success) {
        setRecords((prev) => [response.data, ...prev]);
        message.success("抽奖成功！");
        return response.data;
      }
    } catch (error) {
      message.error("抽奖失败");
      console.error("抽奖失败:", error);
    }
  }, []);

  // 初始化数据
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchPrizes(false), fetchRecords(false)]);
        isInitialized.current = true;
      } catch (error) {
        console.error("初始化数据失败:", error);
        // 即使失败也要标记为已初始化，避免无限loading
        isInitialized.current = true;
      } finally {
        setLoading(false);
      }
    };

    if (!isInitialized.current) {
      initializeData();
    }
  }, [fetchPrizes, fetchRecords]);

  return {
    prizes,
    records,
    loading,
    createPrize,
    updatePrize,
    deletePrize,
    spin,
    refetchPrizes: fetchPrizes,
    refetchRecords: fetchRecords,
  };
}

export function useFlagProgress() {
  const [data, setData] = useState<FlagProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const isInitialized = useRef(false);

  const fetchData = useCallback(async (showLoading = true) => {
    if (showLoading && !isInitialized.current) setLoading(true);
    try {
      const response = await flagProgressApi.getAll();
      if (response.success) {
        setData(response.data);
        isInitialized.current = true;
      }
    } catch (error) {
      message.error("获取插旗进度失败");
      console.error("获取插旗进度失败:", error);
      // 即使失败也要标记为已初始化，避免无限loading
      isInitialized.current = true;
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  const createProgress = useCallback(
    async (progress: Omit<FlagProgress, "id">) => {
      try {
        const response = await flagProgressApi.create(progress);
        if (response.success) {
          setData((prev) => [...prev, response.data]);
          message.success("创建插旗进度成功");
          return response.data;
        }
      } catch (error) {
        message.error("创建插旗进度失败");
        console.error("创建插旗进度失败:", error);
      }
    },
    []
  );

  const updateProgress = useCallback(
    async (id: string, progress: Partial<FlagProgress>) => {
      try {
        const response = await flagProgressApi.update(id, progress);
        if (response.success) {
          setData((prev) =>
            prev.map((item) => (item.id === id ? response.data : item))
          );
          message.success("更新插旗进度成功");
          return response.data;
        }
      } catch (error) {
        message.error("更新插旗进度失败");
        console.error("更新插旗进度失败:", error);
      }
    },
    []
  );

  const deleteProgress = useCallback(async (id: string) => {
    try {
      const response = await flagProgressApi.delete(id);
      if (response.success) {
        setData((prev) => prev.filter((item) => item.id !== id));
        message.success("删除插旗进度成功");
      }
    } catch (error) {
      message.error("删除插旗进度失败");
      console.error("删除插旗进度失败:", error);
    }
  }, []);

  const addParticipant = useCallback(
    async (id: string, participant: string) => {
      try {
        const response = await flagProgressApi.addParticipant(id, participant);
        if (response.success) {
          setData((prev) =>
            prev.map((item) => (item.id === id ? response.data : item))
          );
          message.success("添加参与者成功");
          return response.data;
        }
      } catch (error) {
        message.error("添加参与者失败");
        console.error("添加参与者失败:", error);
      }
    },
    []
  );

  useEffect(() => {
    if (!isInitialized.current) {
      fetchData();
    }
  }, [fetchData]);

  return {
    data,
    loading,
    createProgress,
    updateProgress,
    deleteProgress,
    addParticipant,
    refetch: fetchData,
  };
}

export function useLeaderboard() {
  const [data, setData] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(false);
  const isInitialized = useRef(false);

  const fetchData = useCallback(async (showLoading = true) => {
    if (showLoading && !isInitialized.current) setLoading(true);
    try {
      const response = await leaderboardApi.getLeaderboard();
      if (response.success) {
        setData(response.data);
        isInitialized.current = true;
      }
    } catch (error) {
      message.error("获取排行榜失败");
      console.error("获取排行榜失败:", error);
      // 即使失败也要标记为已初始化，避免无限loading
      isInitialized.current = true;
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  const addUser = useCallback(
    async (user: Omit<LeaderboardUser, "id" | "rank">) => {
      try {
        const response = await leaderboardApi.addUser(user);
        if (response.success) {
          setData((prev) => [...prev, response.data]);
          message.success("添加用户成功");
          return response.data;
        }
      } catch (error) {
        message.error("添加用户失败");
        console.error("添加用户失败:", error);
      }
    },
    []
  );

  const updateUser = useCallback(
    async (id: string, user: Partial<LeaderboardUser>) => {
      try {
        const response = await leaderboardApi.updateUser(id, user);
        if (response.success) {
          setData((prev) =>
            prev.map((item) => (item.id === id ? response.data : item))
          );
          message.success("更新用户成功");
          return response.data;
        }
      } catch (error) {
        message.error("更新用户失败");
        console.error("更新用户失败:", error);
      }
    },
    []
  );

  const deleteUser = useCallback(async (id: string) => {
    try {
      const response = await leaderboardApi.deleteUser(id);
      if (response.success) {
        setData((prev) => prev.filter((item) => item.id !== id));
        message.success("删除用户成功");
      }
    } catch (error) {
      message.error("删除用户失败");
      console.error("删除用户失败:", error);
    }
  }, []);

  useEffect(() => {
    if (!isInitialized.current) {
      fetchData();
    }
  }, [fetchData]);

  return {
    data,
    loading,
    addUser,
    updateUser,
    deleteUser,
    refetch: fetchData,
  };
}
