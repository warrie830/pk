import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  List,
  Avatar,
  Badge,
  Row,
  Col,
  Spin,
  message,
} from "antd";
import {
  GiftOutlined,
  RotateLeftOutlined,
  TrophyOutlined,
  StarOutlined,
  FireOutlined,
  ClockCircleOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import type { LotterySectionProps } from "../../types";
import { formatTime, getRelativeTime } from "../../utils";
import styles from "./index.module.scss";

const LotterySection: React.FC<LotterySectionProps> = ({ prizes, records }) => {
  const [currentPrizeIndex, setCurrentPrizeIndex] = useState(0);

  // 移除自动滚动到最新记录的功能
  // useEffect(() => {
  //   recordsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [records]);

  // 自动轮播奖品
  useEffect(() => {
    if (prizes.length === 0) return;

    const interval = setInterval(() => {
      setCurrentPrizeIndex((prev) => (prev + 1) % prizes.length);
    }, 4000); // 每4秒切换一个奖品

    return () => clearInterval(interval);
  }, [prizes.length]);

  // 手动切换轮播图
  const handlePrev = () => {
    if (prizes.length === 0) return;
    setCurrentPrizeIndex((prev) => (prev - 1 + prizes.length) % prizes.length);
  };

  const handleNext = () => {
    if (prizes.length === 0) return;
    setCurrentPrizeIndex((prev) => (prev + 1) % prizes.length);
  };

  // 获取显示的三个奖品索引
  const getDisplayIndices = () => {
    if (prizes.length === 0) return [];
    if (prizes.length === 1) return [0, 0, 0];
    if (prizes.length === 2) return [1, 0, 1];

    const prev = (currentPrizeIndex - 1 + prizes.length) % prizes.length;
    const next = (currentPrizeIndex + 1) % prizes.length;
    return [prev, currentPrizeIndex, next];
  };

  const displayIndices = getDisplayIndices();

  // 如果没有奖品，显示空状态
  if (prizes.length === 0) {
    return (
      <Card
        title={
          <div className={styles.titleContainer}>
            <GiftOutlined className={styles.titleIcon} />
            <span className={styles.titleText}>奖品陈列馆</span>
            <Badge count={0} showZero className={styles.badge} />
          </div>
        }
        className={styles.lotteryCard}
        styles={{
          header: {
            background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
            color: "white",
            border: "none",
          },
        }}
      >
        <div className={styles.content}>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <GiftOutlined
              style={{ fontSize: "3rem", color: "#ccc", marginBottom: "1rem" }}
            />
            <p style={{ color: "#666" }}>暂无奖品数据</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={
        <div className={styles.titleContainer}>
          <GiftOutlined className={styles.titleIcon} />
          <span className={styles.titleText}>奖品陈列馆</span>
          <Badge count={prizes.length} showZero className={styles.badge} />
        </div>
      }
      className={styles.lotteryCard}
      styles={{
        header: {
          background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
          color: "white",
          border: "none",
        },
      }}
    >
      <div className={styles.content}>
        <Row gutter={24}>
          {/* 左侧滚动表 */}
          <Col xs={8} lg={8}>
            <Card
              title={<span className={styles.recordsTitle}>开奖记录</span>}
              size="small"
              className={styles.recordsCard}
              extra={
                <div className={styles.recordsCount}>
                  共 {records.length} 条记录
                </div>
              }
            >
              <div className={styles.recordsList}>
                <List
                  dataSource={records}
                  renderItem={(record, index) => (
                    <List.Item
                      className={`${styles.recordItem} ${
                        index === 0 ? styles.latest : ""
                      }`}
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            icon={
                              record.isSpecial ? (
                                <StarOutlined />
                              ) : (
                                <GiftOutlined />
                              )
                            }
                            className={`${styles.recordAvatar} ${
                              record.isSpecial ? styles.special : styles.normal
                            }`}
                          />
                        }
                        title={
                          <div className={styles.recordTitle}>
                            <span>{record.prizeName}</span>
                            {record.isSpecial && (
                              <Badge color="red" text="特殊" />
                            )}
                          </div>
                        }
                        description={
                          <div className={styles.recordDescription}>
                            <ClockCircleOutlined />
                            {getRelativeTime(record.timestamp)}
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
                {/* 移除自动滚动引用 */}
              </div>
            </Card>
          </Col>

          {/* 右侧轮播图 */}
          <Col xs={16} lg={16}>
            <Card title="奖品展示" size="small" className={styles.wheelCard}>
              <div className={styles.carouselContainer}>
                {/* 自定义轮播图 */}
                <div className={styles.carouselWrapper}>
                  <Button
                    type="text"
                    icon={<LeftOutlined />}
                    className={styles.carouselButton}
                    onClick={handlePrev}
                  />

                  <div className={styles.customCarousel}>
                    {displayIndices.map((index, position) => {
                      const prize = prizes[index];
                      if (!prize) return null; // 安全检查

                      const isCenter = position === 1;

                      return (
                        <div
                          key={`${prize.id}-${position}`}
                          className={`${styles.carouselItem} ${
                            isCenter ? styles.centerItem : styles.sideItem
                          }`}
                        >
                          <div className={styles.prizeDisplay}>
                            {/* 奖品图片 */}
                            <div className={styles.prizeImageContainer}>
                              {prize.image ? (
                                <img
                                  src={prize.image}
                                  alt={prize.name}
                                  className={styles.prizeImage}
                                />
                              ) : (
                                <div className={styles.prizeImagePlaceholder}>
                                  <GiftOutlined
                                    className={styles.placeholderIcon}
                                  />
                                </div>
                              )}
                            </div>

                            {/* 奖品信息 */}
                            <div className={styles.prizeInfo}>
                              <div className={styles.prizeName}>
                                {prize.name}
                              </div>
                              {isCenter && (
                                <>
                                  <div className={styles.prizeDescription}>
                                    {prize.description || "精美奖品"}
                                  </div>
                                  <div className={styles.prizeProbability}>
                                    中奖概率: {prize.probability}%
                                  </div>
                                  {prize.isSpecial && (
                                    <Badge
                                      color="red"
                                      text="特殊奖品"
                                      className={styles.specialBadge}
                                    />
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Button
                    type="text"
                    icon={<RightOutlined />}
                    className={styles.carouselButton}
                    onClick={handleNext}
                  />
                </div>

                {/* 轮播指示器 */}
                <div className={styles.carouselIndicators}>
                  {prizes.map((prize, index) => (
                    <div
                      key={prize.id}
                      className={`${styles.indicator} ${
                        index === currentPrizeIndex
                          ? styles.activeIndicator
                          : ""
                      }`}
                      onClick={() => {
                        setCurrentPrizeIndex(index);
                      }}
                    >
                      <Avatar
                        size="small"
                        icon={
                          prize.isSpecial ? <StarOutlined /> : <GiftOutlined />
                        }
                        className={`${styles.indicatorAvatar} ${
                          prize.isSpecial ? styles.special : styles.normal
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default LotterySection;
