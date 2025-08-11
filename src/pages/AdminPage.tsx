import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Space,
  message,
  Typography,
  Row,
  Col,
  Statistic,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type {
  PKMilestone,
  Prize,
  FlagProgress,
  LeaderboardUser,
} from "../types";
import {
  usePKProgress,
  useMilestones,
  useLottery,
  useFlagProgress,
  useLeaderboard,
} from "../hooks/useData";
import styles from "./AdminPage.module.scss";

const { Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

const AdminPage: React.FC = () => {
  const [redTeamMembers] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<string>("");
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [form] = Form.useForm();

  const { data: pkProgress } = usePKProgress();
  const {
    data: milestones,
    loading: milestonesLoading,
    createMilestone,
    updateMilestone,
    deleteMilestone,
  } = useMilestones();
  const { prizes, createPrize, updatePrize, deletePrize } = useLottery();
  const {
    data: flagProgresses,
    loading: flagProgressesLoading,
    createProgress,
    updateProgress,
    deleteProgress,
  } = useFlagProgress();
  const {
    data: leaderboard,
    loading: leaderboardLoading,
    addUser,
    updateUser,
    deleteUser,
  } = useLeaderboard();

  // 获取红队成员数据
  useEffect(() => {
    const loadRedTeamMembers = async () => {
      try {
        // 暂时注释掉API调用
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

  // 创建红队成员
  const createRedTeamMember = async () => {
    try {
      // 暂时注释掉API调用
      // await redTeamMembersApi.create(member);
      message.success("创建红队成员成功");
    } catch (error) {
      message.error("创建红队成员失败");
      console.error("创建红队成员失败:", error);
    }
  };

  // 更新红队成员
  const updateRedTeamMember = async () => {
    try {
      // 暂时注释掉API调用
      // await redTeamMembersApi.update(id, member);
      message.success("更新红队成员成功");
    } catch (error) {
      message.error("更新红队成员失败");
      console.error("更新红队成员失败:", error);
    }
  };

  // 删除红队成员
  const deleteRedTeamMember = async () => {
    try {
      // 暂时注释掉API调用
      // await redTeamMembersApi.delete(id);
      message.success("删除红队成员成功");
    } catch (error) {
      message.error("删除红队成员失败");
      console.error("删除红队成员失败:", error);
    }
  };

  // 生成ID的简单函数
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // 处理表单提交
  const handleFormSubmit = async (values: any) => {
    try {
      switch (modalType) {
        case "milestone":
          if (editingRecord) {
            await updateMilestone(editingRecord.id, values);
          } else {
            await createMilestone({ ...values, id: generateId() });
          }
          break;
        case "prize":
          if (editingRecord) {
            await updatePrize(editingRecord.id, values);
          } else {
            await createPrize({ ...values, id: generateId() });
          }
          break;
        case "flag-progress":
          if (editingRecord) {
            await updateProgress(editingRecord.id, values);
          } else {
            await createProgress({
              title: values.name,
              currentCount: values.currentCount || 0,
              targetCount: values.targetCount,
              amount: 0,
              isCompleted: false,
              participants: values.participants || [],
            });
          }
          break;
        case "leaderboard":
          if (editingRecord) {
            await updateUser(editingRecord.id, values);
          } else {
            await addUser({
              name: values.name,
              amount: values.amount,
              avatar: values.avatar,
              hasRoseCrown: values.amount >= 1000,
            });
          }
          break;
        case "red-team-member":
          if (editingRecord) {
            await updateRedTeamMember();
          } else {
            await createRedTeamMember();
          }
          break;
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingRecord(null);
    } catch (error) {
      console.error("操作失败:", error);
    }
  };

  // 打开模态框
  const showModal = (type: string, record?: any) => {
    setModalType(type);
    setEditingRecord(record);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // 删除记录
  const handleDelete = async (type: string, id: string) => {
    try {
      switch (type) {
        case "milestone":
          await deleteMilestone(id);
          break;
        case "prize":
          await deletePrize(id);
          break;
        case "flag-progress":
          await deleteProgress(id);
          break;
        case "leaderboard":
          await deleteUser(id);
          break;
        case "red-team-member":
          await deleteRedTeamMember();
          break;
      }
    } catch (error) {
      console.error("删除失败:", error);
    }
  };

  // 里程碑表格列定义
  const milestoneColumns = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "目标金额",
      dataIndex: "targetAmount",
      key: "targetAmount",
      render: (value: number) => `¥${value.toLocaleString()}`,
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "奖励",
      dataIndex: "reward",
      key: "reward",
    },
    {
      title: "状态",
      dataIndex: "isUnlocked",
      key: "isUnlocked",
      render: (value: boolean) => (value ? "已解锁" : "未解锁"),
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: PKMilestone) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showModal("milestone", record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete("milestone", record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 奖品表格列定义
  const prizeColumns = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "概率",
      dataIndex: "probability",
      key: "probability",
      render: (value: number) => `${value}%`,
    },
    {
      title: "特殊",
      dataIndex: "isSpecial",
      key: "isSpecial",
      render: (value: boolean) => (value ? "是" : "否"),
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: Prize) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showModal("prize", record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete("prize", record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 插旗进度表格列定义
  const flagProgressColumns = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "目标",
      dataIndex: "targetCount",
      key: "targetCount",
    },
    {
      title: "当前",
      dataIndex: "currentCount",
      key: "currentCount",
    },
    {
      title: "状态",
      dataIndex: "isCompleted",
      key: "isCompleted",
      render: (value: boolean) => (value ? "已完成" : "进行中"),
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: FlagProgress) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showModal("flag-progress", record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete("flag-progress", record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 排行榜表格列定义
  const leaderboardColumns = [
    {
      title: "排名",
      dataIndex: "rank",
      key: "rank",
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "金额",
      dataIndex: "amount",
      key: "amount",
      render: (value: number) => `¥${value.toLocaleString()}`,
    },
    {
      title: "玫瑰皇冠",
      dataIndex: "hasRoseCrown",
      key: "hasRoseCrown",
      render: (value: boolean) => (value ? "是" : "否"),
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: LeaderboardUser) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showModal("leaderboard", record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete("leaderboard", record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 红队成员表格列定义
  const redTeamMemberColumns = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "金额",
      dataIndex: "amount",
      key: "amount",
      render: (value: number) => `¥${value.toLocaleString()}`,
    },
    {
      title: "成员数",
      dataIndex: "memberCount",
      key: "memberCount",
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showModal("red-team-member", record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete("red-team-member", record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout className={styles.adminLayout}>
      <Content className={styles.adminContent}>
        <div className={styles.adminContainer}>
          <Title level={2}>PK进度管理系统</Title>

          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="红队总金额"
                  value={pkProgress.redTeam.totalAmount}
                  prefix="¥"
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="蓝队总金额"
                  value={pkProgress.blueTeam.totalAmount}
                  prefix="¥"
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title="里程碑数量" value={milestones.length} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title="奖品数量" value={prizes.length} />
              </Card>
            </Col>
          </Row>

          <Card title="里程碑管理" style={{ marginTop: 16 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal("milestone")}
              style={{ marginBottom: 16 }}
            >
              添加里程碑
            </Button>
            <Table
              columns={milestoneColumns}
              dataSource={milestones}
              rowKey="id"
              loading={milestonesLoading}
            />
          </Card>

          <Card title="奖品管理" style={{ marginTop: 16 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal("prize")}
              style={{ marginBottom: 16 }}
            >
              添加奖品
            </Button>
            <Table columns={prizeColumns} dataSource={prizes} rowKey="id" />
          </Card>

          <Card title="插旗进度管理" style={{ marginTop: 16 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal("flag-progress")}
              style={{ marginBottom: 16 }}
            >
              添加插旗进度
            </Button>
            <Table
              columns={flagProgressColumns}
              dataSource={flagProgresses}
              rowKey="id"
              loading={flagProgressesLoading}
            />
          </Card>

          <Card title="排行榜管理" style={{ marginTop: 16 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal("leaderboard")}
              style={{ marginBottom: 16 }}
            >
              添加用户
            </Button>
            <Table
              columns={leaderboardColumns}
              dataSource={leaderboard}
              rowKey="id"
              loading={leaderboardLoading}
            />
          </Card>

          <Card title="红队成员管理" style={{ marginTop: 16 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal("red-team-member")}
              style={{ marginBottom: 16 }}
            >
              添加成员
            </Button>
            <Table
              columns={redTeamMemberColumns}
              dataSource={redTeamMembers}
              rowKey="id"
            />
          </Card>
        </div>

        <Modal
          title={editingRecord ? "编辑" : "添加"}
          open={isModalVisible}
          onOk={form.submit}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
            setEditingRecord(null);
          }}
          width={600}
        >
          <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
            {modalType === "milestone" && (
              <>
                <Form.Item
                  name="name"
                  label="名称"
                  rules={[{ required: true, message: "请输入名称" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="targetAmount"
                  label="目标金额"
                  rules={[{ required: true, message: "请输入目标金额" }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="description" label="描述">
                  <TextArea rows={3} />
                </Form.Item>
                <Form.Item name="reward" label="奖励">
                  <Input />
                </Form.Item>
              </>
            )}

            {modalType === "prize" && (
              <>
                <Form.Item
                  name="name"
                  label="名称"
                  rules={[{ required: true, message: "请输入名称" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item name="description" label="描述">
                  <TextArea rows={3} />
                </Form.Item>
                <Form.Item
                  name="probability"
                  label="概率"
                  rules={[{ required: true, message: "请输入概率" }]}
                >
                  <InputNumber min={0} max={100} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                  name="isSpecial"
                  label="特殊奖品"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </>
            )}

            {modalType === "flag-progress" && (
              <>
                <Form.Item
                  name="name"
                  label="名称"
                  rules={[{ required: true, message: "请输入名称" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item name="description" label="描述">
                  <TextArea rows={3} />
                </Form.Item>
                <Form.Item
                  name="targetCount"
                  label="目标数量"
                  rules={[{ required: true, message: "请输入目标数量" }]}
                >
                  <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>
              </>
            )}

            {modalType === "leaderboard" && (
              <>
                <Form.Item
                  name="name"
                  label="姓名"
                  rules={[{ required: true, message: "请输入姓名" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="amount"
                  label="金额"
                  rules={[{ required: true, message: "请输入金额" }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </>
            )}

            {modalType === "red-team-member" && (
              <>
                <Form.Item
                  name="name"
                  label="姓名"
                  rules={[{ required: true, message: "请输入姓名" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="amount"
                  label="金额"
                  rules={[{ required: true, message: "请输入金额" }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                  name="memberCount"
                  label="成员数"
                  rules={[{ required: true, message: "请输入成员数" }]}
                >
                  <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>
              </>
            )}
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default AdminPage;
