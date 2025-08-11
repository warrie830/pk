import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Tabs,
  Form,
  Input,
  InputNumber,
  Button,
  Table,
  Space,
  Modal,
  message,
  Popconfirm,
  Switch,
  Select,
  Row,
  Col,
  Statistic,
  Alert,
  Upload,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  ReloadOutlined,
  SettingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  usePKProgress,
  useMilestones,
  useLottery,
  useFlagProgress,
  useLeaderboard,
} from "../hooks/useData";
import { redTeamMembersApi } from "../services/api";
import { generateId } from "../utils";
import type {
  PKProgress,
  PKMilestone,
  Prize,
  FlagProgress,
  LeaderboardUser,
} from "../types";

const { Header, Content } = Layout;
const { TabPane } = Tabs;
const { Option } = Select;

const AdminPage: React.FC = () => {
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<string>("");
  const [form] = Form.useForm();

  // 使用自定义hooks
  const { data: pkProgress, updateData: updatePKProgress } = usePKProgress();
  const {
    data: milestones,
    createMilestone,
    updateMilestone,
    deleteMilestone,
  } = useMilestones();
  const { prizes, records, createPrize, updatePrize, deletePrize } =
    useLottery();
  const {
    data: flagProgresses,
    createProgress,
    updateProgress,
    deleteProgress,
  } = useFlagProgress();
  const {
    data: leaderboard,
    addUser,
    updateUser,
    deleteUser,
  } = useLeaderboard();

  // 红队成员状态
  const [redTeamMembers, setRedTeamMembers] = useState<any[]>([]);
  const [loadingRedTeamMembers, setLoadingRedTeamMembers] = useState(false);

  // 组件加载时加载红队成员数据
  useEffect(() => {
    loadRedTeamMembers();
  }, []);

  // 红队成员CRUD操作
  const loadRedTeamMembers = async () => {
    setLoadingRedTeamMembers(true);
    try {
      const response = await redTeamMembersApi.getAll();
      setRedTeamMembers(response.data);
    } catch (error) {
      message.error("加载红队成员失败");
    } finally {
      setLoadingRedTeamMembers(false);
    }
  };

  const createRedTeamMember = async (member: any) => {
    try {
      await redTeamMembersApi.create(member);
      message.success("红队成员创建成功");
      loadRedTeamMembers();
    } catch (error) {
      message.error("创建红队成员失败");
    }
  };

  const updateRedTeamMember = async (id: string, member: any) => {
    try {
      await redTeamMembersApi.update(id, member);
      message.success("红队成员更新成功");
      loadRedTeamMembers();
    } catch (error) {
      message.error("更新红队成员失败");
    }
  };

  const deleteRedTeamMember = async (id: string) => {
    try {
      await redTeamMembersApi.delete(id);
      message.success("红队成员删除成功");
      loadRedTeamMembers();
    } catch (error) {
      message.error("删除红队成员失败");
    }
  };

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    try {
      switch (modalType) {
        case "pk-progress":
          await updatePKProgress(values);
          break;
        case "milestone":
          if (editingItem) {
            await updateMilestone(editingItem.id, values);
          } else {
            await createMilestone({ ...values, id: generateId() });
          }
          break;
        case "prize":
          if (editingItem) {
            await updatePrize(editingItem.id, values);
          } else {
            await createPrize({ ...values, id: generateId() });
          }
          break;
        case "flag-progress":
          if (editingItem) {
            await updateProgress(editingItem.id, values);
          } else {
            await createProgress({
              ...values,
              id: generateId(),
              participants: [],
            });
          }
          break;
        case "leaderboard":
          if (editingItem) {
            await updateUser(editingItem.id, values);
          } else {
            await addUser({
              ...values,
              id: generateId(),
              rank: leaderboard.length + 1,
            });
          }
          break;
        case "red-team-member":
          if (editingItem) {
            await updateRedTeamMember(editingItem.id, values);
          } else {
            await createRedTeamMember({
              ...values,
              id: generateId(),
            });
          }
          break;
      }

      message.success("操作成功");
      setIsModalVisible(false);
      setEditingItem(null);
      form.resetFields();
    } catch (error) {
      message.error("操作失败");
    }
  };

  // 打开编辑模态框
  const openEditModal = (type: string, item?: any) => {
    setModalType(type);
    setEditingItem(item);
    setIsModalVisible(true);

    if (item) {
      form.setFieldsValue(item);
    } else {
      form.resetFields();
    }
  };

  // 删除项目
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
          await deleteRedTeamMember(id);
          break;
      }
      message.success("删除成功");
    } catch (error) {
      message.error("删除失败");
    }
  };

  // 表格列定义
  const milestoneColumns = [
    { title: "名称", dataIndex: "name", key: "name" },
    { title: "描述", dataIndex: "description", key: "description" },
    {
      title: "目标金额",
      dataIndex: "targetAmount",
      key: "targetAmount",
      render: (val: number) => `¥${val}`,
    },
    { title: "奖励", dataIndex: "reward", key: "reward" },
    {
      title: "已解锁",
      dataIndex: "isUnlocked",
      key: "isUnlocked",
      render: (val: boolean) => (val ? "是" : "否"),
    },
    {
      title: "操作",
      key: "action",
      render: (_, record: PKMilestone) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openEditModal("milestone", record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除吗？"
            onConfirm={() => handleDelete("milestone", record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const prizeColumns = [
    { title: "名称", dataIndex: "name", key: "name" },
    { title: "描述", dataIndex: "description", key: "description" },
    {
      title: "图片",
      dataIndex: "image",
      key: "image",
      render: (val: string) =>
        val ? (
          <img
            src={val}
            alt="奖品图片"
            style={{
              width: 50,
              height: 50,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
        ) : (
          <div
            style={{
              width: 50,
              height: 50,
              background: "#f0f0f0",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#999",
            }}
          >
            无图
          </div>
        ),
    },
    {
      title: "概率",
      dataIndex: "probability",
      key: "probability",
      render: (val: number) => `${val}%`,
    },
    {
      title: "特殊奖品",
      dataIndex: "isSpecial",
      key: "isSpecial",
      render: (val: boolean) => (val ? "是" : "否"),
    },
    {
      title: "操作",
      key: "action",
      render: (_, record: Prize) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openEditModal("prize", record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除吗？"
            onConfirm={() => handleDelete("prize", record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const flagProgressColumns = [
    { title: "标题", dataIndex: "title", key: "title" },
    { title: "当前人数", dataIndex: "currentCount", key: "currentCount" },
    { title: "目标人数", dataIndex: "targetCount", key: "targetCount" },
    {
      title: "金额",
      dataIndex: "amount",
      key: "amount",
      render: (val: number) => `¥${val}`,
    },
    { title: "插旗者ID", dataIndex: "flaggerId", key: "flaggerId" },
    {
      title: "微博链接",
      dataIndex: "flagUrl",
      key: "flagUrl",
      render: (val: string) =>
        val ? (
          <a href={val} target="_blank" rel="noopener noreferrer">
            查看微博
          </a>
        ) : (
          "-"
        ),
    },
    {
      title: "已完成",
      dataIndex: "isCompleted",
      key: "isCompleted",
      render: (val: boolean) => (val ? "是" : "否"),
    },
    {
      title: "操作",
      key: "action",
      render: (_, record: FlagProgress) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openEditModal("flag-progress", record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除吗？"
            onConfirm={() => handleDelete("flag-progress", record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const leaderboardColumns = [
    { title: "姓名", dataIndex: "name", key: "name" },
    {
      title: "金额",
      dataIndex: "amount",
      key: "amount",
      render: (val: number) => `¥${val}`,
    },
    { title: "排名", dataIndex: "rank", key: "rank" },
    {
      title: "玫瑰群",
      dataIndex: "hasRoseCrown",
      key: "hasRoseCrown",
      render: (val: boolean) => (val ? "是" : "否"),
    },
    {
      title: "操作",
      key: "action",
      render: (_, record: LeaderboardUser) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openEditModal("leaderboard", record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除吗？"
            onConfirm={() => handleDelete("leaderboard", record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const redTeamMemberColumns = [
    { title: "姓名", dataIndex: "name", key: "name" },
    {
      title: "金额",
      dataIndex: "amount",
      key: "amount",
      render: (val: number) => `¥${val}`,
    },
    {
      title: "人数",
      dataIndex: "memberCount",
      key: "memberCount",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record: any) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openEditModal("red-team-member", record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除吗？"
            onConfirm={() => handleDelete("red-team-member", record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Header className="bg-gradient-to-r from-red-600 to-orange-600 shadow-lg px-4 md:px-6">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-2 md:space-x-4">
            <SettingOutlined className="text-white text-lg md:text-xl" />
            <div className="text-white text-lg md:text-2xl font-bold">
              管理后台
            </div>
            <div className="text-white text-xs md:text-sm opacity-80 hidden sm:block">
              数据管理界面
            </div>
          </div>
        </div>
      </Header>

      <Content className="p-3 md:p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
          {/* 统计信息 */}
          <Row gutter={[8, 8]} className="mb-4">
            <Col xs={12} sm={6}>
              <Card className="text-center hover:shadow-lg transition-all duration-300">
                <Statistic title="里程碑数量" value={milestones.length} />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="text-center hover:shadow-lg transition-all duration-300">
                <Statistic title="奖品种类" value={prizes.length} />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="text-center hover:shadow-lg transition-all duration-300">
                <Statistic title="插旗进度" value={flagProgresses.length} />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="text-center hover:shadow-lg transition-all duration-300">
                <Statistic title="排行榜用户" value={leaderboard.length} />
              </Card>
            </Col>
          </Row>

          <Tabs defaultActiveKey="pk-progress" type="card">
            {/* PK进度管理 */}
            <TabPane tab="PK进度管理" key="pk-progress">
              <Card>
                <Alert
                  message="红队数据说明"
                  description="红队的总金额和成员数量现在由红队成员管理自动计算，请到'红队成员管理'标签页管理红队成员数据。"
                  type="info"
                  showIcon
                  className="mb-4"
                />
                <Form
                  layout="vertical"
                  initialValues={pkProgress}
                  onFinish={handleSubmit}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <h3 className="text-lg font-bold mb-4 text-red-600">
                        红队数据（自动计算）
                      </h3>
                      <Form.Item label="总金额">
                        <InputNumber
                          value={redTeamMembers.reduce(
                            (sum, member) => sum + member.amount,
                            0
                          )}
                          disabled
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                      <Form.Item label="点赞数" name={["redTeam", "likes"]}>
                        <InputNumber min={0} style={{ width: "100%" }} />
                      </Form.Item>
                      <Form.Item label="成员数量">
                        <InputNumber
                          value={redTeamMembers.reduce(
                            (sum, member) => sum + member.memberCount,
                            0
                          )}
                          disabled
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <h3 className="text-lg font-bold mb-4 text-blue-600">
                        蓝队数据
                      </h3>
                      <Form.Item
                        label="总金额"
                        name={["blueTeam", "totalAmount"]}
                      >
                        <InputNumber min={0} style={{ width: "100%" }} />
                      </Form.Item>
                      <Form.Item
                        label="成员数量"
                        name={["blueTeam", "memberCount"]}
                      >
                        <InputNumber min={0} style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item>
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      htmlType="submit"
                    >
                      保存PK进度
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </TabPane>

            {/* 里程碑管理 */}
            <TabPane tab="里程碑管理" key="milestones">
              <Card
                title="里程碑列表"
                extra={
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => openEditModal("milestone")}
                  >
                    添加里程碑
                  </Button>
                }
              >
                <Table
                  columns={milestoneColumns}
                  dataSource={milestones}
                  rowKey="id"
                />
              </Card>
            </TabPane>

            {/* 奖品管理 */}
            <TabPane tab="奖品管理" key="prizes">
              <Card
                title="奖品列表"
                extra={
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => openEditModal("prize")}
                  >
                    添加奖品
                  </Button>
                }
              >
                <Table columns={prizeColumns} dataSource={prizes} rowKey="id" />
              </Card>
            </TabPane>

            {/* 插旗进度管理 */}
            <TabPane tab="插旗进度管理" key="flag-progress">
              <Card
                title="插旗进度列表"
                extra={
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => openEditModal("flag-progress")}
                  >
                    添加插旗进度
                  </Button>
                }
              >
                <Table
                  columns={flagProgressColumns}
                  dataSource={flagProgresses}
                  rowKey="id"
                />
              </Card>
            </TabPane>

            {/* 排行榜管理 */}
            <TabPane tab="排行榜管理" key="leaderboard">
              <Card
                title="排行榜列表"
                extra={
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => openEditModal("leaderboard")}
                  >
                    添加用户
                  </Button>
                }
              >
                <Table
                  columns={leaderboardColumns}
                  dataSource={leaderboard}
                  rowKey="id"
                />
              </Card>
            </TabPane>

            {/* 红队成员管理 */}
            <TabPane tab="红队成员管理" key="red-team-members">
              <Card
                title="红队成员管理"
                extra={
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => openEditModal("red-team-member")}
                  >
                    添加成员
                  </Button>
                }
              >
                <Table
                  columns={redTeamMemberColumns}
                  dataSource={redTeamMembers}
                  rowKey="id"
                  loading={loadingRedTeamMembers}
                />
              </Card>
            </TabPane>
          </Tabs>
        </div>

        {/* 编辑模态框 */}
        <Modal
          title={`${editingItem ? "编辑" : "添加"}${getModalTitle(modalType)}`}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setEditingItem(null);
            form.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            {renderFormFields(modalType)}
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  htmlType="submit"
                >
                  保存
                </Button>
                <Button
                  onClick={() => {
                    setIsModalVisible(false);
                    setEditingItem(null);
                    form.resetFields();
                  }}
                >
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

// 获取模态框标题
function getModalTitle(type: string): string {
  switch (type) {
    case "milestone":
      return "里程碑";
    case "prize":
      return "奖品";
    case "flag-progress":
      return "插旗进度";
    case "leaderboard":
      return "用户";
    case "red-team-member":
      return "红队成员";
    default:
      return "";
  }
}

// 渲染表单字段
function renderFormFields(type: string) {
  switch (type) {
    case "milestone":
      return (
        <>
          <Form.Item label="名称" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="描述"
            name="description"
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="目标金额"
            name="targetAmount"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="奖励" name="reward">
            <Input />
          </Form.Item>
          <Form.Item label="已解锁" name="isUnlocked" valuePropName="checked">
            <Switch />
          </Form.Item>
        </>
      );
    case "prize":
      return (
        <>
          <Form.Item label="名称" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="描述"
            name="description"
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="概率"
            name="probability"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="奖品图片" name="image">
            <Input placeholder="请输入图片URL地址" />
          </Form.Item>
          <Form.Item label="特殊奖品" name="isSpecial" valuePropName="checked">
            <Switch />
          </Form.Item>
        </>
      );
    case "flag-progress":
      return (
        <>
          <Form.Item label="标题" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="当前人数"
            name="currentCount"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="目标人数"
            name="targetCount"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="金额" name="amount" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="插旗者ID" name="flaggerId">
            <Input placeholder="请输入插旗者的ID" />
          </Form.Item>
          <Form.Item label="微博链接" name="flagUrl">
            <Input placeholder="请输入微博链接" />
          </Form.Item>
          <Form.Item label="已完成" name="isCompleted" valuePropName="checked">
            <Switch />
          </Form.Item>
        </>
      );
    case "leaderboard":
      return (
        <>
          <Form.Item label="姓名" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="金额" name="amount" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="玫瑰群" name="hasRoseCrown" valuePropName="checked">
            <Switch />
          </Form.Item>
        </>
      );
    case "red-team-member":
      return (
        <>
          <Form.Item label="姓名" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="金额" name="amount" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="人数"
            name="memberCount"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
        </>
      );
    default:
      return null;
  }
}

export default AdminPage;
