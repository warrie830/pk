import React, { useState, useEffect } from "react";
import { Card, Row, Col, Progress } from "antd";
import {
  DollarOutlined,
  UserOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import type { PKProgressBarProps } from "../../types";
import { formatCurrency, calculatePercentage } from "../../utils";
import { redTeamMembersApi } from "../../services/api";
import styles from "./index.module.scss";

const PKProgressBar: React.FC<PKProgressBarProps> = ({ data }) => {
  const [redTeamMembers, setRedTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 默认的红队成员数据
  const defaultRedTeamMembers = [
    { id: "1", name: "Alyce", amount: 1500, memberCount: 86 },
    { id: "2", name: "Ivy", amount: 9000, memberCount: 70 },
  ];

  // 获取红队成员数据
  useEffect(() => {
    const loadRedTeamMembers = async () => {
      setLoading(true);
      try {
        const response = await redTeamMembersApi.getAll();
        if (response.success && response.data.length > 0) {
          setRedTeamMembers(response.data);
        } else {
          // 如果API返回空数据或失败，使用默认数据
          console.warn("红队成员API返回空数据，使用默认数据");
          setRedTeamMembers(defaultRedTeamMembers);
        }
      } catch (error) {
        console.error("加载红队成员失败，使用默认数据:", error);
        // API调用失败时使用默认数据
        setRedTeamMembers(defaultRedTeamMembers);
      } finally {
        setLoading(false);
      }
    };

    loadRedTeamMembers();
  }, []);

  // 计算红队总金额（来自红队成员数据）
  const redTeamMembersTotal = redTeamMembers.reduce(
    (sum, member) => sum + member.amount,
    0
  );
  const redTeamTotal = redTeamMembersTotal + data.redTeam.likes * 10;
  const blueTeamTotal = data.blueTeam.totalAmount;
  const totalAmount = redTeamTotal + blueTeamTotal;

  const redTeamPercentage = calculatePercentage(redTeamTotal, totalAmount);
  const blueTeamPercentage = calculatePercentage(blueTeamTotal, totalAmount);

  // 判断哪一队领先
  const redTeamLeading = redTeamTotal > blueTeamTotal;
  const blueTeamLeading = blueTeamTotal > redTeamTotal;

  return (
    <div className={styles.pkContainer}>
      <Card
        // title="2V1 PK对战"
        className={styles.card}
      >
        <div className={styles.content}>
          {/* PK对战条 */}
          <div className={styles.pkBarContainer}>
            <div className={styles.redAvatar}>
              {/* 红队领先奖杯 */}
              {redTeamLeading && (
                <div className={styles.winnerTrophy}>
                  <TrophyOutlined className={styles.trophyIcon} />
                </div>
              )}
            </div>
            <div className={styles.pkBar}>
              {/* 红队区域（左侧） */}
              <div
                className={`${styles.redSection} ${
                  redTeamLeading ? styles.leading : styles.notLeading
                }`}
                style={{ width: `${redTeamPercentage}%` }}
              >
                <div className={`${styles.numberDisplay} ${styles.left}`}>
                  {Math.round(redTeamTotal)}
                </div>
              </div>

              {/* 蓝队区域（右侧） */}
              <div
                className={`${styles.blueSection} ${
                  blueTeamLeading ? styles.leading : styles.notLeading
                }`}
                style={{ width: `${blueTeamPercentage}%` }}
              >
                <div className={`${styles.numberDisplay} ${styles.right}`}>
                  {Math.round(blueTeamTotal)}
                </div>
              </div>

              {/* 中央PK标志 */}
              <div className={styles.pkCenter}>
                <div className={styles.pkBall}>
                  <div className={styles.pkText}>PK</div>
                </div>
              </div>
            </div>
            <div className={styles.blueAvatar}>
              {/* 蓝队领先奖杯 */}
              {blueTeamLeading && (
                <div className={styles.winnerTrophy}>
                  <TrophyOutlined className={styles.trophyIcon} />
                </div>
              )}
            </div>
          </div>

          {/* 详细数据 */}
          <div className={styles.detailCards}>
            <Row gutter={[16, 16]}>
              {/* 红队成员详情 */}
              <Col span={12}>
                <Card
                  title="红队成员详情"
                  size="small"
                  className={styles.redCard}
                >
                  {loading ? (
                    <div>加载中...</div>
                  ) : redTeamMembers.length > 0 ? (
                    <div className={styles.membersList}>
                      {redTeamMembers.map((member) => {
                        const percentage = calculatePercentage(
                          member.amount,
                          redTeamMembersTotal
                        );
                        return (
                          <div key={member.id} className={styles.memberItem}>
                            <div className={styles.memberInfo}>
                              <div className={styles.memberName}>
                                {member.name}
                              </div>
                              <div className={styles.memberStats}>
                                <span>
                                  ¥{member.amount} ({member.memberCount}人参与)
                                </span>
                                <span className={styles.memberTotal}>
                                  ¥{member.amount}
                                </span>
                              </div>
                            </div>
                            <div className={styles.memberBar}>
                              <Progress
                                percent={percentage}
                                showInfo={false}
                                strokeColor="#ff4d4f"
                                trailColor="#ffccc7"
                                size={[0, 8]}
                                style={{ marginTop: "8px" }}
                              />
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "#666",
                                  marginTop: "4px",
                                }}
                              >
                                占比: {percentage}%
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className={styles.noMembers}>暂无红队成员数据</div>
                  )}
                </Card>
              </Col>

              {/* 蓝队详情 */}
              <Col span={12}>
                <Card title="蓝队详情" size="small" className={styles.blueCard}>
                  <div className={styles.blueTeamInfo}>
                    <div className={styles.blueTeamStats}>
                      <div className={styles.statItem}>
                        <DollarOutlined className={styles.statIcon} />
                        <span>总金额: ¥{formatCurrency(blueTeamTotal)}</span>
                      </div>
                      <div className={styles.statItem}>
                        <UserOutlined className={styles.statIcon} />
                        <span>成员数: {data.blueTeam.memberCount}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PKProgressBar;
