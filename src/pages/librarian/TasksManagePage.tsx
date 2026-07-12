import { Typography, Card, Row, Col, Button, Tag, Space, Modal, Form, Input, Select } from 'antd';
import { PlusOutlined, SendOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { mockStudyTasks } from '../../utils/mockData';
import { useAppStore } from '../../stores/appStore';
import type { StudyTask } from '../../types';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function TasksManagePage() {
  const { studyTasks, addStudyTask } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const allTasks = studyTasks.length > 0 ? studyTasks : mockStudyTasks;

  const handleCreateTask = () => {
    form.validateFields().then((values) => {
      const newTask: StudyTask = {
        id: `task-${Date.now()}`,
        title: values.title,
        description: values.description,
        targetGrade: values.targetGrade,
        textIds: [],
        exercises: [],
        createdAt: new Date().toISOString().split('T')[0],
        assignedCount: 0,
        completedCount: 0,
      };
      addStudyTask(newTask);
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ color: '#2c1810', marginBottom: 4 }}>
            📋 研学管理
          </Title>
          <Text type="secondary">创建和管理古籍研学任务单，一键分发至学生端</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ background: '#5b8c5a', borderColor: '#5b8c5a' }}
          onClick={() => setIsModalOpen(true)}
        >
          创建研学任务
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {allTasks.map((task) => (
          <Col xs={24} sm={12} lg={8} key={task.id}>
            <Card
              className="parchment-card"
              title={task.title}
              extra={
                <Space>
                  <Button size="small" icon={<EditOutlined />} type="link" />
                  <Button size="small" icon={<DeleteOutlined />} type="link" danger />
                </Space>
              }
              actions={[
                <Button type="link" icon={<SendOutlined />} key="assign">
                  分发给学生
                </Button>,
              ]}
            >
              <Paragraph type="secondary" ellipsis={{ rows: 3 }}>
                {task.description}
              </Paragraph>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text style={{ fontSize: 12 }}>目标年级：</Text>
                  {task.targetGrade.map((g) => (
                    <Tag key={g} color="green">{g}年级</Tag>
                  ))}
                </div>
                <div>
                  <Text style={{ fontSize: 12 }}>完成情况：</Text>
                  <Text strong>
                    {task.completedCount}/{task.assignedCount}
                  </Text>
                </div>
                <div>
                  <Text style={{ fontSize: 12 }}>创建时间：{task.createdAt}</Text>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 创建任务弹窗 */}
      <Modal
        title="创建研学任务单"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleCreateTask}
        okText="创建"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="任务标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="例如：唐诗中的月亮意象研学" />
          </Form.Item>
          <Form.Item name="description" label="任务描述" rules={[{ required: true, message: '请输入描述' }]}>
            <TextArea rows={3} placeholder="描述研学任务的目标和内容..." />
          </Form.Item>
          <Form.Item name="targetGrade" label="目标年级" rules={[{ required: true, message: '请选择目标年级' }]}>
            <Select mode="multiple" placeholder="选择年级">
              {[1, 2, 3, 4, 5, 6].map((g) => (
                <Select.Option key={g} value={g}>{g}年级</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
