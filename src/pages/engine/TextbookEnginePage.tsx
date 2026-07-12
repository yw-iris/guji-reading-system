import { useState, useMemo } from 'react';
import {
  Typography, Card, Row, Col, Table, Tag, Select, Input, Space,
  Statistic, Tabs, Collapse, Descriptions, Alert, Divider,
} from 'antd';
import {
  SearchOutlined, BookOutlined, LinkOutlined,
  ThunderboltOutlined, DatabaseOutlined, AimOutlined,
  ReadOutlined, TrophyOutlined, ExperimentOutlined,
} from '@ant-design/icons';
import {
  textbookPoems, schoolStageStandards,
  getPoemsByStage, getExamKeyPoems,
  getPoemsByKeyword, stageStats, topAuthors, allKeywords,
} from '../../data/textbookDatabase';
import type { TextbookPoem } from '../../data/textbookDatabase';

const { Title, Text, Paragraph } = Typography;

const stageColors = ['', '#ffa94d', '#74c0fc', '#845ef7'];
const typeColors: Record<string, string> = {
  '古诗': '#c43a31', '词': '#b8860b', '文言文': '#5b8c5a', '蒙学': '#2e5984', '寓言': '#845ef7',
};

export default function TextbookEnginePage() {
  const [searchText, setSearchText] = useState('');
  const [filterGrade, setFilterGrade] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [selectedPoem, setSelectedPoem] = useState<TextbookPoem | null>(null);

  const filteredPoems = useMemo(() => {
    let result = [...textbookPoems];
    if (searchText) {
      result = getPoemsByKeyword(searchText);
    }
    if (filterGrade) {
      result = result.filter(p => p.grade === filterGrade);
    }
    if (filterType) {
      result = result.filter(p => p.type === filterType);
    }
    return result;
  }, [searchText, filterGrade, filterType]);

  const columns = [
    {
      title: '篇目', dataIndex: 'title', key: 'title', width: 150,
      render: (t: string, r: TextbookPoem) => (
        <Space>
          <Text strong style={{ cursor: 'pointer', color: '#c43a31' }}
            onClick={() => setSelectedPoem(r)}>{t}</Text>
          {r.isExamKey && <Tag color="red">考点</Tag>}
        </Space>
      ),
    },
    { title: '作者', dataIndex: 'author', key: 'author', width: 80 },
    {
      title: '年级', dataIndex: 'grade', key: 'grade', width: 80,
      render: (g: number) => <Tag color={stageColors[g <= 2 ? 1 : g <= 4 ? 2 : 3]}>{g}年级</Tag>,
    },
    {
      title: '类型', dataIndex: 'type', key: 'type', width: 80,
      render: (t: string) => <Tag color={typeColors[t] || '#8b6914'}>{t}</Tag>,
    },
    {
      title: '学段', dataIndex: 'stage', key: 'stage', width: 80,
      render: (s: number) => <Tag>{['', '第一学段', '第二学段', '第三学段'][s]}</Tag>,
    },
    {
      title: '关键词', dataIndex: 'keywords', key: 'keywords',
      render: (kw: string[]) => <Space wrap>{kw.map(k => <Tag key={k} style={{ fontSize: 11 }}>{k}</Tag>)}</Space>,
    },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto' }}>
      {/* 标题 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ color: '#2c1810', marginBottom: 4 }}>
          <DatabaseOutlined /> 课标匹配引擎 · 底层数据库
        </Title>
        <Text type="secondary">
          基于2022版义务教育语文课程标准 + 统编人教版1-6年级完整古诗文总库（112首古诗 + 14篇文言文）
        </Text>
      </div>

      {/* 核心统计 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card className="parchment-card">
            <Statistic title="课内篇目总数" value={stageStats.total} prefix={<BookOutlined />} valueStyle={{ color: '#c43a31' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="parchment-card">
            <Statistic title="考试重点篇目" value={getExamKeyPoems().length} prefix={<TrophyOutlined />} valueStyle={{ color: '#b8860b' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="parchment-card">
            <Statistic title="匹配关键词" value={allKeywords.length} prefix={<AimOutlined />} valueStyle={{ color: '#5b8c5a' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="parchment-card">
            <Statistic title="课标背诵总量" value={160} suffix="篇" prefix={<ReadOutlined />} valueStyle={{ color: '#2e5984' }} />
          </Card>
        </Col>
      </Row>

      <Tabs
        defaultActiveKey="database"
        items={[
          // ===== Tab 1: 完整数据库 =====
          {
            key: 'database',
            label: <span><DatabaseOutlined /> 完整古诗文数据库</span>,
            children: (
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <Card className="parchment-card">
                    <Space wrap style={{ marginBottom: 16 }}>
                      <Input
                        placeholder="搜索篇目、作者、关键词..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        style={{ width: 220 }}
                        allowClear
                      />
                      <Select
                        placeholder="筛选年级" allowClear style={{ width: 120 }}
                        value={filterGrade} onChange={setFilterGrade}
                        options={[1,2,3,4,5,6].map(g => ({ label: `${g}年级`, value: g }))}
                      />
                      <Select
                        placeholder="筛选类型" allowClear style={{ width: 120 }}
                        value={filterType} onChange={setFilterType}
                        options={['古诗', '词', '文言文', '寓言'].map(t => ({ label: t, value: t }))}
                      />
                      <Text type="secondary">共 {filteredPoems.length} 篇</Text>
                    </Space>
                    <Table
                      columns={columns} dataSource={filteredPoems}
                      rowKey="id" size="small" pagination={{ pageSize: 20 }}
                      scroll={{ y: 500 }}
                      onRow={(record) => ({
                        onClick: () => setSelectedPoem(record),
                        style: { cursor: 'pointer', background: selectedPoem?.id === record.id ? '#fdf6f5' : undefined },
                      })}
                    />
                  </Card>
                </Col>

                {/* 选中篇目的CADAL匹配详情 */}
                {selectedPoem && (
                  <Col xs={24}>
                    <Card
                      title={<span><LinkOutlined /> CADAL 古籍匹配方案：{selectedPoem.title}</span>}
                      className="parchment-card"
                      style={{ borderLeft: '4px solid #c43a31' }}
                    >
                      <Descriptions bordered size="small" column={2}>
                        <Descriptions.Item label="篇目">{selectedPoem.title}</Descriptions.Item>
                        <Descriptions.Item label="作者/出处">{selectedPoem.author} · {selectedPoem.dynasty}</Descriptions.Item>
                        <Descriptions.Item label="年级">{selectedPoem.grade}年级{selectedPoem.semester}学期</Descriptions.Item>
                        <Descriptions.Item label="学段">
                          <Tag color={stageColors[selectedPoem.stage]}>
                            {['', '第一学段(1-2年级)', '第二学段(3-4年级)', '第三学段(5-6年级)'][selectedPoem.stage]}
                          </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="类型">
                          <Tag color={typeColors[selectedPoem.type]}>{selectedPoem.type}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="考试重点">
                          {selectedPoem.isExamKey ? <Tag color="red">是</Tag> : <Tag>否</Tag>}
                        </Descriptions.Item>
                        <Descriptions.Item label="核心关键词" span={2}>
                          <Space wrap>
                            {selectedPoem.keywords.map(k => <Tag key={k} color="green">{k}</Tag>)}
                          </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="CADAL匹配方向" span={2}>
                          <Alert
                            type="info"
                            message={
                              <Space wrap>
                                {selectedPoem.cadalMatchHints.map((hint, i) => (
                                  <Tag key={i} color="blue" style={{ fontSize: 13, padding: '4px 10px' }}>
                                    <ExperimentOutlined /> {hint}
                                  </Tag>
                                ))}
                              </Space>
                            }
                          />
                        </Descriptions.Item>
                        <Descriptions.Item label="推荐系统层级" span={2}>
                          {selectedPoem.stage === 1 && <Tag color="blue">C级 · 白话通识版（只诵读、感受韵律）</Tag>}
                          {selectedPoem.stage === 2 && <Tag color="green">B级 · 简化适配版（读懂诗意、简单注释）</Tag>}
                          {selectedPoem.stage === 3 && (
                            <Space>
                              <Tag color="orange">A级 · 原版繁体 + 考点标注</Tag>
                              <Tag color="green">B级 · 简化适配版</Tag>
                            </Space>
                          )}
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </Col>
                )}
              </Row>
            ),
          },

          // ===== Tab 2: 三学段分级标准 =====
          {
            key: 'standards',
            label: <span><ThunderboltOutlined /> 三学段分级标准</span>,
            children: (
              <Row gutter={[16, 16]}>
                {schoolStageStandards.map(std => (
                  <Col xs={24} sm={8} key={std.stage}>
                    <Card
                      className="parchment-card"
                      title={
                        <Space>
                          <Tag color={stageColors[std.stage]} style={{ fontSize: 14 }}>{std.name}</Tag>
                          <Text strong>{std.grades}</Text>
                        </Space>
                      }
                      style={{ height: '100%', borderTop: `4px solid ${stageColors[std.stage]}` }}
                    >
                      <Paragraph strong>学习目标：</Paragraph>
                      <Paragraph type="secondary" style={{ fontSize: 13 }}>{std.goal}</Paragraph>

                      <Divider style={{ margin: '12px 0' }} />

                      <Paragraph strong>系统层级：</Paragraph>
                      <Tag color={std.stage === 1 ? 'blue' : std.stage === 2 ? 'green' : 'orange'} style={{ fontSize: 13 }}>
                        {std.systemLevel}
                      </Tag>

                      <Divider style={{ margin: '12px 0' }} />

                      <Paragraph strong>核心能力：</Paragraph>
                      <Space wrap>
                        {std.keySkills.map(s => <Tag key={s}>{s}</Tag>)}
                      </Space>

                      <Divider style={{ margin: '12px 0' }} />

                      <Text type="secondary">累计背诵：{std.reciteCount}篇优秀诗文</Text>
                      <br />
                      <Text type="secondary">本学段课内篇目：{getPoemsByStage(std.stage).length}篇</Text>
                    </Card>
                  </Col>
                ))}
              </Row>
            ),
          },

          // ===== Tab 3: 关键词匹配逻辑 =====
          {
            key: 'keywords',
            label: <span><AimOutlined /> 关键词匹配逻辑</span>,
            children: (
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Card title="🔑 核心关键词词云（用于CADAL检索）" className="parchment-card">
                    <Space wrap>
                      {allKeywords.map(kw => {
                        const count = textbookPoems.filter(p => p.keywords.includes(kw)).length;
                        const size = Math.max(11, Math.min(22, 11 + count * 2));
                        const colors = ['#c43a31', '#b8860b', '#5b8c5a', '#2e5984', '#845ef7', '#e8493a'];
                        return (
                          <Tag key={kw} color={colors[count % colors.length]}
                            style={{ fontSize: size, padding: '4px 10px', margin: 4 }}>
                            {kw} ({count})
                          </Tag>
                        );
                      })}
                    </Space>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card title="👨‍🎓 高频作者（优先匹配CADAL别集）" className="parchment-card">
                    {topAuthors.map((author, i) => (
                      <div key={author.name} style={{ marginBottom: 12 }}>
                        <Space>
                          <Tag color={['#c43a31', '#b8860b', '#5b8c5a', '#2e5984'][i]}>{i + 1}</Tag>
                          <Text strong>{author.name}</Text>
                          <Text type="secondary">课内出现 {author.count} 次</Text>
                        </Space>
                        <div style={{
                          height: 6, background: '#f0e6d3', borderRadius: 3, marginTop: 4,
                          overflow: 'hidden',
                        }}>
                          <div style={{
                            height: '100%', width: `${(author.count / topAuthors[0].count) * 100}%`,
                            background: ['#c43a31', '#b8860b', '#5b8c5a', '#2e5984'][i],
                            borderRadius: 3,
                          }} />
                        </div>
                      </div>
                    ))}
                  </Card>

                  <Card title="📊 类型分布" className="parchment-card" style={{ marginTop: 16 }}>
                    {[
                      { type: '古诗', count: textbookPoems.filter(p => p.type === '古诗').length, color: '#c43a31' },
                      { type: '词', count: textbookPoems.filter(p => p.type === '词').length, color: '#b8860b' },
                      { type: '文言文', count: textbookPoems.filter(p => p.type === '文言文').length, color: '#5b8c5a' },
                      { type: '寓言', count: textbookPoems.filter(p => p.type === '寓言').length, color: '#845ef7' },
                    ].map(item => (
                      <div key={item.type} style={{ marginBottom: 8 }}>
                        <Space>
                          <Tag color={item.color}>{item.type}</Tag>
                          <Text>{item.count}篇</Text>
                        </Space>
                      </div>
                    ))}
                  </Card>
                </Col>

                <Col xs={24}>
                  <Card title="🎯 CADAL 匹配逻辑说明（给浙大队友的接口文档）" className="parchment-card">
                    <Collapse items={[
                      {
                        key: '1', label: '1. 课标分级标签库',
                        children: (
                          <Paragraph>
                            把1-2 / 3-4 / 5-6年级分成三类标签，程序读取CADAL古籍时自动打上学段标签，实现一键筛选对应年级拓展阅读。
                            系统已内置 126 篇课内篇目的完整学段标签，每条记录包含 stage 字段（1/2/3）。
                          </Paragraph>
                        ),
                      },
                      {
                        key: '2', label: '2. 篇目关键词匹配逻辑',
                        children: (
                          <div>
                            <Paragraph>
                              每首诗文提取标题、作者、核心意象（月亮、乡村、边塞、读书等），作为检索词，自动在CADAL数据库抓取同源古籍拓展素材。
                            </Paragraph>
                            <Alert
                              type="success"
                              message={
                                <span>
                                  <strong>例：</strong>检索五年级《杨氏之子》 → 自动匹配《世说新语》CADAL原版古籍、同类孩童轶事古文
                                </span>
                              }
                            />
                          </div>
                        ),
                      },
                      {
                        key: '3', label: '3. 三层文本难度划分规则',
                        children: (
                          <Row gutter={[8, 8]}>
                            {[
                              { tier: 'C通识层（1-2年级）', color: 'blue', desc: '纯大白话，去掉生僻字、复杂句式，只讲画面故事。对应第一学段。' },
                              { tier: 'B适配层（3-4年级）', color: 'green', desc: '保留原文短句，生僻字注音、简单注释，简化复杂典故。对应第二学段。' },
                              { tier: 'A原版层（5-6年级）', color: 'orange', desc: 'CADAL繁体古籍原文，标注考试生字、古今异义、课内考点。对应第三学段。' },
                            ].map(item => (
                              <Col xs={24} sm={8} key={item.tier}>
                                <Card size="small" style={{ background: '#faf5eb' }}>
                                  <Tag color={item.color} style={{ marginBottom: 8 }}>{item.tier}</Tag>
                                  <Paragraph style={{ fontSize: 12, marginBottom: 0 }}>{item.desc}</Paragraph>
                                </Card>
                              </Col>
                            ))}
                          </Row>
                        ),
                      },
                      {
                        key: '4', label: '4. CADAL资源对应关系',
                        children: (
                          <Descriptions bordered size="small" column={1}>
                            <Descriptions.Item label="低段诗词">
                              → CADAL 蒙学读物、童谣古籍、古代儿童插画方志
                            </Descriptions.Item>
                            <Descriptions.Item label="中段唐宋诗词">
                              → CADAL 全唐诗、宋诗钞、历代文人别集
                            </Descriptions.Item>
                            <Descriptions.Item label="高段文言文（世说新语、论语等）">
                              → CADAL 完整古籍善本、明清刻本原版图像 + OCR 文字
                            </Descriptions.Item>
                          </Descriptions>
                        ),
                      },
                    ]} />
                  </Card>
                </Col>
              </Row>
            ),
          },
        ]}
      />
    </div>
  );
}
