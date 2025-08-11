import React from "react";
import { Card, List, Avatar, Badge, Row, Col, Tag } from "antd";
import {
  TrophyOutlined,
  UserOutlined,
  CrownOutlined,
  StarOutlined,
  FireOutlined,
} from "@ant-design/icons";
import type { LeaderboardSectionProps } from "../../types";
import { formatCurrency } from "../../utils";
import styles from "./index.module.scss";

const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({ users }) => {
  const totalUsers = users.length;
  const averageAmount =
    users.length > 0
      ? users.reduce((sum, user) => sum + user.amount, 0) / users.length
      : 0;

  // 获取排名样式类
  const getRankClass = (index: number, amount: number) => {
    if (index === 0) return styles.top1;
    if (index === 1) return styles.top2;
    if (index === 2) return styles.top3;
    if (amount >= 1000) return styles.roseGroup;
    return "";
  };

  // 获取排名徽章样式类
  const getRankBadgeClass = (index: number) => {
    if (index === 0) return styles.rank1;
    if (index === 1) return styles.rank2;
    if (index === 2) return styles.rank3;
    return styles.rankOther;
  };

  return (
    <Card
      title={
        <div className={styles.titleContainer}>
          <TrophyOutlined className={styles.titleIcon} />
          <span className={styles.titleText}>PK排行榜</span>
          <Badge count={totalUsers} showZero className={styles.badge} />
        </div>
      }
      className={styles.leaderboardCard}
      styles={{
        header: {
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          color: "white",
          border: "none",
        },
      }}
    >
      <div className={styles.content}>
        {/* 统计信息 */}
        <Row gutter={16} className={styles.statsRow}>
          <Col span={8}>
            <Card size="small" className={`${styles.statCard} ${styles.total}`}>
              <div className={`${styles.statNumber} ${styles.total}`}>
                {totalUsers}
              </div>
              <div className={styles.statLabel}>总参与人数</div>
            </Card>
          </Col>
          {/* <Col span={8}>
            <Card
              size="small"
              className={`${styles.statCard} ${styles.roseGroup}`}
            >
              <div className={`${styles.statNumber} ${styles.roseGroup}`}>
                {roseGroupUsers}
              </div>
              <div className={styles.statLabel}>玫瑰群成员</div>
            </Card>
          </Col> */}
          <Col span={8}>
            <Card
              size="small"
              className={`${styles.statCard} ${styles.average}`}
            >
              <div className={`${styles.statNumber} ${styles.average}`}>
                {formatCurrency(averageAmount)}
              </div>
              <div className={styles.statLabel}>平均金额</div>
            </Card>
          </Col>
        </Row>

        {/* 排行榜列表 */}
        {users.length > 0 ? (
          <div className={styles.leaderboardList}>
            <List
              dataSource={users}
              renderItem={(user, index) => (
                <List.Item
                  className={`${styles.listItem} ${getRankClass(
                    index,
                    user.amount
                  )}`}
                >
                  <div className={styles.userInfo}>
                    {/* 排名徽章 */}
                    <div
                      className={`${styles.rankBadge} ${getRankBadgeClass(
                        index
                      )}`}
                    >
                      {index + 1}
                    </div>

                    {/* 用户头像 */}
                    <div className={styles.userAvatar}>
                      <Avatar
                        size="large"
                        icon={<UserOutlined />}
                        style={{
                          backgroundColor:
                            index === 0
                              ? "#fbbf24"
                              : index === 1
                              ? "#6b7280"
                              : index === 2
                              ? "#f87171"
                              : "#3b82f6",
                        }}
                      >
                        {user.name.slice(0, 2)}
                      </Avatar>
                      {/* 玫瑰皇冠 */}
                      {user.amount >= 1000 && (
                        <div className={styles.roseCrown}>
                          {/* <HeartOutlined /> */}
                          🌹
                        </div>
                      )}
                    </div>

                    {/* 用户信息 */}
                    <div>
                      <div className={styles.userName}>{user.name}</div>
                      <div className={styles.userAmount}>
                        {/* {formatCurrency(user.amount)} */}
                      </div>
                    </div>
                  </div>

                  {/* 特殊标识 */}
                  <div>
                    {index === 0 && (
                      <Tag color="gold" icon={<CrownOutlined />}>
                        冠军
                      </Tag>
                    )}
                    {index === 1 && (
                      <Tag color="silver" icon={<StarOutlined />}>
                        亚军
                      </Tag>
                    )}
                    {index === 2 && (
                      <Tag color="bronze" icon={<FireOutlined />}>
                        季军
                      </Tag>
                    )}
                  </div>
                </List.Item>
              )}
            />
          </div>
        ) : (
          <div className={styles.emptyState}>
            <TrophyOutlined className={styles.emptyIcon} />
            <div className={styles.emptyTitle}>暂无排行榜数据</div>
            <div className={styles.emptyDescription}>等待用户参与PK...</div>
          </div>
        )}

        {/* 规则说明 */}
        {/* <Card size="small" className={styles.ruleCard}>
          <div>
            <div className={styles.ruleTitle}>排行榜规则说明:</div>
            <ul className={styles.ruleList}>
              <li>按用户下单金额进行排名</li>
              <li>前三名获得特殊标识和奖励</li>
              <li>金额满1000元解锁玫瑰群资格</li>
              <li>玫瑰群成员获得专属皇冠标识</li>
            </ul>
          </div>
        </Card> */}
      </div>
    </Card>
  );
};

export default LeaderboardSection;
