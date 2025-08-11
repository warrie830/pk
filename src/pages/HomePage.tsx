import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Layout, Spin } from "antd";
import {
  usePKProgress,
  useMilestones,
  useLottery,
  useLeaderboard,
} from "../hooks/useData";
import PKProgressBar from "../components/PKProgressBar";
import MilestoneSection from "../components/MilestoneSection";
import LotterySection from "../components/LotterySection";
import FlagProgressSection from "../components/FlagProgressSection";
import LeaderboardSection from "../components/LeaderboardSection";
import styles from "./HomePage.module.scss";

const { Content } = Layout;

const HomePage: React.FC = () => {
  const [showRefreshIndicator, setShowRefreshIndicator] = useState(false);

  const {
    data: pkProgress,
    loading: pkLoading,
    refetch: refetchPK,
  } = usePKProgress();
  const {
    data: milestones,
    loading: milestonesLoading,
    refetch: refetchMilestones,
  } = useMilestones();
  const {
    prizes,
    records,
    loading: lotteryLoading,
    spin,
    refetchPrizes,
    refetchRecords,
  } = useLottery();
  // FlagProgressSection现在自己管理数据，不再需要从HomePage传递
  const {
    data: leaderboard,
    loading: leaderboardLoading,
    refetch: refetchLeaderboard,
  } = useLeaderboard();

  // 计算当前总金额
  const currentAmount =
    pkProgress.redTeam.totalAmount +
    pkProgress.redTeam.likes +
    pkProgress.blueTeam.totalAmount;

  // 处理抽奖
  const handleSpin = async () => {
    try {
      await spin();
      // 抽奖后刷新相关数据
      refetchRecords();
    } catch (error) {
      console.error("抽奖失败:", error);
    }
  };

  // 优化的数据刷新函数 - 减少视觉闪烁
  const refreshData = useCallback(async () => {
    // 使用计数器而不是布尔值来避免状态频繁切换
    setShowRefreshIndicator(true);

    try {
      // 并行执行所有数据刷新，后台静默刷新
      await Promise.allSettled([
        refetchPK(false),
        refetchMilestones(false),
        refetchPrizes(false),
        refetchRecords(),
        refetchLeaderboard(false),
      ]);
    } catch (error) {
      console.error("数据刷新失败:", error);
    }
  }, [
    refetchPK,
    refetchMilestones,
    refetchPrizes,
    refetchRecords,
    refetchLeaderboard,
  ]);

  // 自动隐藏刷新指示器
  useEffect(() => {
    if (showRefreshIndicator) {
      const timer = setTimeout(() => {
        setShowRefreshIndicator(false);
      }, 3000); // 3秒后自动隐藏

      return () => clearTimeout(timer);
    }
  }, [showRefreshIndicator]);

  // 定期刷新数据
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 30000); // 每30秒刷新一次

    return () => clearInterval(interval);
  }, [refreshData]);

  // 只在初始加载时显示全屏加载，刷新时不显示
  const isInitialLoading =
    pkLoading || milestonesLoading || lotteryLoading || leaderboardLoading;

  // 使用 useMemo 优化组件渲染
  const mainContent = useMemo(
    () => (
      <div className={styles.mainContent}>
        {/* PK进度条 */}
        <PKProgressBar data={pkProgress} />

        {/* PK里程碑 */}
        <MilestoneSection
          milestones={milestones}
          currentAmount={currentAmount}
        />

        {/* 底部两个组件 */}
        <div className={styles.contentGrid}>
          <FlagProgressSection />
          <LeaderboardSection users={leaderboard} />
        </div>

        {/* 抽抽乐 */}
        <LotterySection prizes={prizes} records={records} onSpin={handleSpin} />
      </div>
    ),
    [
      pkProgress,
      milestones,
      currentAmount,
      leaderboard,
      prizes,
      records,
      handleSpin,
    ]
  );

  return (
    <Layout className={styles.homeContainer}>
      <Content className={styles.content}>
        {isInitialLoading && (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}>
              <Spin size="large" />
            </div>
            <div className={styles.loadingText}>加载中...</div>
          </div>
        )}

        {!isInitialLoading && mainContent}

        {/* 刷新状态指示器 - 固定在右上角 */}
        {showRefreshIndicator && (
          <div className={styles.refreshIndicator}>
            <div className={styles.refreshBadge}>
              <Spin size="small" className={styles.refreshIcon} />
              数据已更新
            </div>
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default HomePage;
