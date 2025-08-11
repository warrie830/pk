import React, { useState, useEffect } from "react";
import {
  Card,
  Progress,
  Badge,
  Row,
  Col,
  Tag,
  Avatar,
  Spin,
  message,
} from "antd";
import {
  FlagOutlined,
  CheckCircleOutlined,
  UserOutlined,
  TrophyOutlined,
  FireOutlined,
  StarOutlined,
} from "@ant-design/icons";
import type { FlagProgress } from "../../types";
import { formatCurrency, calculatePercentage } from "../../utils";
import { flagProgressApi } from "../../services/api";
import styles from "./index.module.scss";

const FlagProgressSection: React.FC = () => {
  const [progresses, setProgresses] = useState<FlagProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [completedProgresses, setCompletedProgresses] = useState<string[]>([]);

  // 获取插旗进度数据
  useEffect(() => {
    const fetchFlagProgress = async () => {
      setLoading(true);
      try {
        const response = await flagProgressApi.getAll();
        if (response.success) {
          setProgresses(response.data);
        } else {
          message.error("获取插旗进度失败");
        }
      } catch (error) {
        console.error("获取插旗进度失败:", error);
        message.error("获取插旗进度失败");
      } finally {
        setLoading(false);
      }
    };

    fetchFlagProgress();
  }, []);

  // 分离进行中和已完成的进度
  const activeProgresses = progresses.filter(
    (p: FlagProgress) => !p.isCompleted
  );
  const finishedProgresses = progresses.filter(
    (p: FlagProgress) => p.isCompleted
  );

  // 处理完成特效
  useEffect(() => {
    const newCompleted = progresses
      .filter((p) => p.isCompleted && !completedProgresses.includes(p.id))
      .map((p) => p.id);

    if (newCompleted.length > 0) {
      setCompletedProgresses((prev) => [...prev, ...newCompleted]);

      // 3秒后移除特效
      setTimeout(() => {
        setCompletedProgresses((prev) =>
          prev.filter((id) => !newCompleted.includes(id))
        );
      }, 3000);
    }
  }, [progresses, completedProgresses]);

  const renderProgressCard = (
    progress: FlagProgress,
    isCompleted: boolean = false
  ) => {
    const hasEffect = completedProgresses.includes(progress.id);
    const progressPercent = calculatePercentage(
      progress.currentCount,
      progress.targetCount
    );

    return (
      <Card
        key={progress.id}
        size="small"
        className={`${styles.progressCard} ${
          isCompleted ? styles.completed : styles.active
        } ${hasEffect ? styles.withEffect : ""}`}
        title={
          <div className={styles.cardTitle}>
            <div className={styles.titleLeft}>
              {isCompleted ? (
                <CheckCircleOutlined
                  className={`${styles.titleIcon} ${styles.completed}`}
                />
              ) : (
                <FlagOutlined
                  className={`${styles.titleIcon} ${styles.active}`}
                />
              )}
              <span
                className={`${styles.titleText} ${
                  isCompleted ? styles.completed : styles.active
                }`}
              >
                {progress.title}
              </span>
              {hasEffect && <StarOutlined className={styles.effectIcon} />}
            </div>
            <div className={styles.titleRight}>
              <Tag color={isCompleted ? "green" : "blue"}>
                {progress.currentCount}/{progress.targetCount}
              </Tag>
              <Tag color="orange">{formatCurrency(progress.amount)}</Tag>
            </div>
          </div>
        }
      >
        <div className={styles.cardContent}>
          <div className={styles.flagInfo}>
            <UserOutlined className={styles.flagIcon} />
            {progress.flagUrl ? (
              <a
                href={progress.flagUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.weiboLink}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(progress.flagUrl, "_blank");
                }}
              >
                {progress.flaggerId}
              </a>
            ) : (
              <span className={styles.value}>{progress.flaggerId}</span>
            )}
          </div>

          {/* 进度条 */}
          <div className={styles.progressContainer}>
            <div className={styles.progressLabel}>
              <span>插旗进度</span>
              <span>{progressPercent}%</span>
            </div>
            <Progress
              percent={progressPercent}
              strokeColor={isCompleted ? "#52c41a" : "#1890ff"}
              showInfo={false}
              size={[0, 8]}
              className={`${styles.progressBar} ${
                isCompleted ? styles.completed : styles.active
              }`}
            />
          </div>

          {/* 参与者列表 */}
          <div className={styles.participantsContainer}>
            {/* <div className={styles.participantsTitle}>
              参与者 ({progress.participants.length}人):
            </div> */}
            <div className={styles.participantsList}>
              {progress.participants
                .slice(0, 5)
                .map((participant: string, index: number) => (
                  <Avatar
                    key={index}
                    size="small"
                    icon={<UserOutlined />}
                    className={styles.participantAvatar}
                  >
                    {participant.slice(0, 2)}
                  </Avatar>
                ))}
              {progress.participants.length > 5 && (
                <Badge
                  count={`+${progress.participants.length - 5}`}
                  size="small"
                />
              )}
            </div>
          </div>

          {/* 状态指示器 */}
          <div
            className={`${styles.statusContainer} ${
              isCompleted ? styles.completed : styles.active
            }`}
          >
            {/* {isCompleted ? (
              <>
                <TrophyOutlined className={styles.statusIcon} />
                <span className={styles.statusText}>已完成</span>
              </>
            ) : (
              <>
                <ClockCircleOutlined className={styles.statusIcon} />
                <span className={styles.statusText}>进行中</span>
              </>
            )} */}
          </div>

          {/* 完成特效 */}
          {hasEffect && (
            <div className={styles.completionEffect}>
              <div className={styles.effectBackground}></div>
              <div className={styles.effectIcon}>🎉</div>
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <Card
      title={
        <div className={styles.titleContainer}>
          <FlagOutlined className={styles.titleIcon} />
          <span className={styles.titleText}>插旗进度</span>
          <Badge
            count={activeProgresses.length}
            showZero
            className={styles.badge}
          />
        </div>
      }
      className={styles.flagCard}
      styles={{
        header: {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          border: "none",
        },
      }}
      // 移除切换按钮，因为已完成的插旗现在总是显示
    >
      <div className={styles.content}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <Spin size="large" />
            <div style={{ marginTop: "1rem", color: "#6b7280" }}>
              加载插旗进度中...
            </div>
          </div>
        ) : (
          <>
            {/* 进行中的插旗进度 */}
            {activeProgresses.length > 0 && (
              <div className={styles.progressSection}>
                <div className={`${styles.sectionTitle} ${styles.active}`}>
                  <FireOutlined />
                  进行中的插旗
                </div>
                <Row gutter={[16, 16]}>
                  {activeProgresses.map((progress) => (
                    <Col xs={24} sm={12} lg={8} key={progress.id}>
                      {progress.flagUrl ? (
                        <a
                          href={progress.flagUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          // className={styles.weiboLink}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(progress.flagUrl, "_blank");
                          }}
                        >
                          {renderProgressCard(progress)}
                        </a>
                      ) : (
                        renderProgressCard(progress)
                      )}
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {/* 已完成的插旗进度 */}
            {finishedProgresses.length > 0 && (
              <div className={styles.progressSection}>
                <div className={`${styles.sectionTitle} ${styles.completed}`}>
                  <TrophyOutlined />
                  已完成的插旗
                </div>
                <Row gutter={[16, 16]}>
                  {finishedProgresses.map((progress) => (
                    <Col xs={24} sm={12} lg={8} key={progress.id}>
                      {renderProgressCard(progress, true)}
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {/* 空状态 */}
            {progresses.length === 0 && (
              <div className={styles.emptyState}>
                <FlagOutlined className={styles.emptyIcon} />
                <div className={styles.emptyTitle}>暂无插旗进度</div>
                <div className={styles.emptyDescription}>
                  等待新的插旗挑战...
                </div>
              </div>
            )}

            {/* 示例说明 */}
            {/* <Card size="small" className={styles.ruleCard}>
              <div>
                <div className={styles.ruleTitle}>插旗规则说明:</div>
                <ul className={styles.ruleList}>
                  <li>每个插旗条代表一个挑战目标</li>
                  <li>参与者达到目标人数后插旗完成</li>
                  <li>完成时会有特效庆祝</li>
                  <li>完成的插旗会移入已完成列表</li>
                </ul>
              </div>
            </Card> */}
          </>
        )}
      </div>
    </Card>
  );
};

export default FlagProgressSection;
