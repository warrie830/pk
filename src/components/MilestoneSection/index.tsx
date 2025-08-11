import React, { useState, useEffect } from "react";
import { Card, Progress, Badge, Tag } from "antd";
import {
  TrophyOutlined,
  LockOutlined,
  UnlockOutlined,
  FireOutlined,
  StarOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import type { MilestoneSectionProps } from "../../types";
import { formatCurrency, calculatePercentage } from "../../utils";
import styles from "./index.module.scss";

const MilestoneSection: React.FC<MilestoneSectionProps> = ({ milestones }) => {
  const [redTeamMembers] = useState<any[]>([
    { id: "1", name: "Alyce", amount: 1500, memberCount: 86 },
    { id: "2", name: "Ivy", amount: 9000, memberCount: 70 },
  ]);

  // 获取红队成员数据
  useEffect(() => {
    const loadRedTeamMembers = async () => {
      try {
        // 暂时注释掉API调用，因为redTeamMembersApi可能不存在
        // const response = await redTeamMembersApi.getAll();
        // if (response.success) {
        //   setRedTeamMembers(response.data);
        // }
      } catch (error) {
        console.error("获取红队成员失败:", error);
      }
    };

    loadRedTeamMembers();
  }, []);

  // 获取Alyce的金额
  const alyceMember = redTeamMembers.find((member) => member.name === "Alyce");
  const alyceAmount = alyceMember ? alyceMember.amount : 0;

  // 按目标金额排序
  const sortedMilestones = [...milestones].sort(
    (a, b) => a.targetAmount - b.targetAmount
  );

  // 根据Alyce金额判断里程碑是否解锁
  const updatedMilestones = sortedMilestones.map((milestone) => ({
    ...milestone,
    isUnlocked: alyceAmount >= milestone.targetAmount,
  }));

  // 计算下一个里程碑（使用Alyce的金额）
  const nextMilestone = updatedMilestones.find((m) => !m.isUnlocked);
  const unlockedCount = updatedMilestones.filter((m) => m.isUnlocked).length;
  const totalCount = updatedMilestones.length;

  // 计算进度条上里程碑标记的位置
  const maxAmount = Math.max(
    ...updatedMilestones.map((m) => m.targetAmount),
    alyceAmount
  );
  const getMarkerPosition = (amount: number) => (amount / maxAmount) * 100;

  return (
    <Card
      title={
        <div className={styles.titleContainer}>
          <TrophyOutlined className={styles.titleIcon} />
          <span className={styles.titleText}>PK里程碑</span>
          <Badge count={unlockedCount} showZero className={styles.badge} />
        </div>
      }
      className={styles.milestoneWrap}
      styles={{
        header: {
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          color: "white",
          border: "none",
        },
      }}
    >
      <div className={styles.content}>
        {/* 总体进度 */}
        <div className={styles.progressSection}>
          <div className={styles.currentProgress}>
            Alyce进度: {formatCurrency(alyceAmount)}
          </div>
          <div className={styles.progressText}>
            已解锁 {unlockedCount}/{totalCount} 个里程碑
          </div>
          {nextMilestone && (
            <>
              <div className={styles.nextMilestoneContent}>
                <FireOutlined className={styles.nextMilestoneIcon} />
                <span className={styles.nextMilestoneText}>
                  下一个里程碑: {nextMilestone.name} (
                  {formatCurrency(nextMilestone.targetAmount)})
                </span>
              </div>
              <div className={styles.nextMilestoneAmount}>
                还需 {formatCurrency(nextMilestone.targetAmount - alyceAmount)}{" "}
                即可解锁
              </div>
            </>
          )}

          <div className={styles.progressBar}>
            <Progress
              percent={calculatePercentage(unlockedCount, totalCount)}
              strokeColor={{
                "0%": "#f093fb",
                "100%": "#f5576c",
              }}
              size={[0, 20]}
              showInfo={false}
            />
            {/* 里程碑标记 */}
            <div className={styles.milestoneMarkers}>
              {updatedMilestones.map((milestone) => {
                const position = getMarkerPosition(milestone.targetAmount);
                const isCurrent =
                  alyceAmount >= milestone.targetAmount &&
                  (nextMilestone
                    ? alyceAmount < nextMilestone.targetAmount
                    : true);

                return (
                  <div
                    key={milestone.id}
                    className={`${styles.milestoneMarker} ${
                      milestone.isUnlocked ? styles.unlocked : ""
                    } ${isCurrent ? styles.current : ""}`}
                    style={{ left: `${position}%` }}
                    title={`${milestone.name}: ${formatCurrency(
                      milestone.targetAmount
                    )}`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* 里程碑卡片列表 */}
        <div className={styles.milestonesContainer}>
          {updatedMilestones.map((milestone) => {
            const isUnlocked = milestone.isUnlocked;
            const progress = calculatePercentage(
              alyceAmount,
              milestone.targetAmount
            );
            const position = getMarkerPosition(milestone.targetAmount);

            return (
              <Card
                key={milestone.id}
                style={{ left: `calc(${position}% - 150px)` }}
                size="small"
                className={`${styles.milestoneItem} ${styles.milestoneCard} ${
                  isUnlocked ? styles.unlocked : styles.locked
                }`}
                title={
                  <div className={styles.milestoneHeader}>
                    <div className={styles.milestoneTitle}>
                      {isUnlocked ? (
                        <UnlockOutlined
                          className={`${styles.milestoneIcon} ${styles.unlocked}`}
                        />
                      ) : (
                        <LockOutlined
                          className={`${styles.milestoneIcon} ${styles.locked}`}
                        />
                      )}
                      <span
                        className={`${styles.milestoneName} ${
                          isUnlocked ? styles.unlocked : styles.locked
                        }`}
                      >
                        {milestone.name}
                      </span>
                    </div>
                    <Tag
                      color={isUnlocked ? "green" : "default"}
                      className={styles.milestoneAmount}
                    >
                      {formatCurrency(milestone.targetAmount)}
                    </Tag>
                  </div>
                }
              >
                <div className={styles.milestoneContent}>
                  {/* 描述 */}
                  <div className={styles.milestoneDescription}>
                    {milestone.description}
                  </div>

                  {/* 进度条 */}
                  <div className={styles.progressContainer}>
                    <div className={styles.progressLabel}>
                      <span>进度</span>
                      <span>{Math.min(progress, 100)}%</span>
                    </div>
                    <Progress
                      percent={Math.min(progress, 100)}
                      strokeColor={isUnlocked ? "#52c41a" : "#d9d9d9"}
                      showInfo={false}
                      size={[0, 6]}
                      className={`${styles.progressBar} ${
                        isUnlocked ? styles.unlocked : styles.locked
                      }`}
                    />
                  </div>

                  {/* 奖励 */}
                  {milestone.reward && (
                    <div className={styles.rewardContainer}>
                      <GiftOutlined className={styles.rewardIcon} />
                      <span className={styles.rewardText}>
                        {milestone.reward}
                      </span>
                    </div>
                  )}

                  {/* 状态指示器 */}
                  <div
                    className={`${styles.statusContainer} ${
                      isUnlocked ? styles.unlocked : styles.locked
                    }`}
                  >
                    {isUnlocked ? (
                      <>
                        <StarOutlined className={styles.statusIcon} />
                        <span className={styles.statusText}>已解锁</span>
                      </>
                    ) : (
                      <>
                        <FireOutlined className={styles.statusIcon} />
                        <span className={styles.statusText}>待解锁</span>
                      </>
                    )}
                  </div>

                  {/* 解锁特效 */}
                  {isUnlocked && <div className={styles.unlockEffect}></div>}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default MilestoneSection;
