import { useState, useMemo, useRef, useEffect } from 'react';
import type { Key, ReactNode } from 'react';
import {
  Typography, Card, Row, Col, Table, Tag, Select, Input, Space,
  Statistic, Collapse, Descriptions, Alert, Divider, Button,
} from 'antd';
import type { TableColumnsType } from 'antd';
import {
  SearchOutlined, BookOutlined, LinkOutlined,
  ThunderboltOutlined, DatabaseOutlined, AimOutlined,
  ExperimentOutlined,
  CheckCircleOutlined, CloudServerOutlined, ExportOutlined,
  AppstoreOutlined, ReloadOutlined,
} from '@ant-design/icons';
import {
  textbookPoems, schoolStageStandards,
  getPoemsByStage,
  getPoemsByKeyword, stageStats, topAuthors, allKeywords,
} from '../../data/textbookDatabase';
import type { TextbookPoem } from '../../data/textbookDatabase';
import { InkLoader, EmptyState, SealMark } from '../../components/common';

const { Title, Text, Paragraph } = Typography;

const stageColors = ['', '#ffa94d', '#74c0fc', '#845ef7'];
const typeColors: Record<string, string> = {
  '古诗': '#c43a31', '词': '#b8860b', '文言文': '#5b8c5a', '蒙学': '#2e5984', '寓言': '#845ef7',
};
const stageLabels = ['', '第一学段', '第二学段', '第三学段'];
const stageFullLabels = ['', '第一学段(1-2年级)', '第二学段(3-4年级)', '第三学段(5-6年级)'];
const allTypes = Array.from(new Set(textbookPoems.map(p => p.type)));

type RowStatus = 'pending' | 'processing' | 'done';
type StatusKey = 'all' | RowStatus;

interface AITask {
  id: string;
  title: string;
  targetIds: string[];
  progress: number;
  status: 'processing' | 'done';
  kind: 'ai' | 'export';
}

const STATUS_OPTIONS: { key: StatusKey; label: string; dot: string }[] = [
  { key: 'all', label: '全部', dot: '' },
  { key: 'pending', label: '待处理', dot: 'gj-dot-vermilion' },
  { key: 'processing', label: '处理中', dot: 'gj-dot-vermilion' },
  { key: 'done', label: '已完成', dot: 'gj-dot-jade' },
];

const STATUS_VIEW: Record<RowStatus, { label: string; dot: string }> = {
  pending: { label: '待处理', dot: 'gj-dot-vermilion' },
  processing: { label: '处理中', dot: 'gj-dot-vermilion' },
  done: { label: '已完成', dot: 'gj-dot-jade' },
};

/* 顶部核心指标卡 */
function MetricCard({
  title, value, suffix, prefix, color, dotClass, accent,
}: {
  title: string; value: number | string; suffix?: string; prefix?: ReactNode;
  color: string; dotClass: string; accent?: string;
}) {
  return (
    <Card className="gj-card-dark gj-fade-up" style={{ color: 'var(--ink-black)', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Statistic title={title} value={value} suffix={suffix} prefix={prefix}
          valueStyle={{ color, fontSize: 26, fontWeight: 700 }} />
        <span className={`gj-dot ${dotClass}`} style={{ marginTop: 8 }} />
      </div>
      {accent && <div style={{ marginTop: 6, fontSize: 12, color: 'var(--warm-brown)' }}>{accent}</div>}
    </Card>
  );
}

export default function TextbookEnginePage() {
  const [searchText, setSearchText] = useState('');
  const [filterGrade, setFilterGrade] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [selectedPoem, setSelectedPoem] = useState<TextbookPoem | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusKey>('all');
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [tasks, setTasks] = useState<AITask[]>([]);
  const [inkLoading, setInkLoading] = useState(false);

  // 处理状态：由用户批量操作产生的真实任务状态驱动，不编造静态 mock
  const processingIds = useMemo(
    () => new Set(tasks.filter(t => t.status === 'processing').flatMap(t => t.targetIds)),
    [tasks],
  );
  const processedIds = useMemo(
    () => new Set(tasks.filter(t => t.status === 'done').flatMap(t => t.targetIds)),
    [tasks],
  );
  const statusOf = (p: TextbookPoem): RowStatus =>
    processingIds.has(p.id) ? 'processing' : processedIds.has(p.id) ? 'done' : 'pending';

  const counts = useMemo(() => ({
    all: textbookPoems.length,
    pending: textbookPoems.length - processedIds.size,
    processing: processingIds.size,
    done: processedIds.size,
  }), [processedIds, processingIds]);

  const filteredPoems = useMemo(() => {
    let result = searchText ? getPoemsByKeyword(searchText) : [...textbookPoems];
    if (filterGrade) result = result.filter(p => p.grade === filterGrade);
    if (filterType) result = result.filter(p => p.type === filterType);
    if (statusFilter !== 'all') result = result.filter(p => statusOf(p) === statusFilter);
    return result;
  }, [searchText, filterGrade, filterType, statusFilter, processingIds, processedIds]);

  const activeTasks = useMemo(() => tasks.filter(t => t.status === 'processing'), [tasks]);
  const overallProgress = activeTasks.length
    ? Math.round(activeTasks.reduce((a, t) => a + t.progress, 0) / activeTasks.length)
    : 0;
  const isBusy = activeTasks.length > 0;

  // 批量任务进度模拟（用户触发，非预置 mock）
  const intervalsRef = useRef<Record<string, ReturnType<typeof setInterval>>>({});
  useEffect(() => () => {
    Object.values(intervalsRef.current).forEach(clearInterval);
  }, []);

  const runTask = (task: AITask) => {
    setTasks(prev => [...prev, task]);
    let p = 0;
    const id = setInterval(() => {
      p += 6;
      if (p >= 100) {
        clearInterval(id);
        delete intervalsRef.current[task.id];
        setTasks(prev => prev.map(t => (t.id === task.id ? { ...t, progress: 100, status: 'done' } : t)));
      } else {
        setTasks(prev => prev.map(t => (t.id === task.id ? { ...t, progress: p } : t)));
      }
    }, 200);
    intervalsRef.current[task.id] = id;
  };

  const handleBatch = (kind: 'ai' | 'export') => {
    const keys = selectedRowKeys;
    if (!keys.length) return;
    runTask({
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: kind === 'ai' ? `AI 解读 · ${keys.length} 篇` : `导出 CADAL · ${keys.length} 篇`,
      targetIds: [...keys],
      progress: 0,
      status: 'processing',
      kind,
    });
    setSelectedRowKeys([]);
  };

  // 状态切换：水墨晕染过渡
  const handleStatusChange = (key: StatusKey) => {
    if (key === statusFilter) return;
    setInkLoading(true);
    setStatusFilter(key);
    window.setTimeout(() => setInkLoading(false), 380);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: Key[]) => setSelectedRowKeys(keys as string[]),
    preserveSelectedRowKeys: false,
  };

  const columns: TableColumnsType<TextbookPoem> = [
    {
      title: '篇目', dataIndex: 'title', key: 'title', width: 160,
      render: (t: string, r: TextbookPoem) => (
        <Space>
          <Text strong style={{ cursor: 'pointer', color: 'var(--vermilion)' }}
            onClick={() => setSelectedPoem(r)}>{t}</Text>
          {r.isExamKey && <Tag color="red">考点</Tag>}
        </Space>
      ),
    },
    { title: '作者', dataIndex: 'author', key: 'author', width: 84 },
    {
      title: '年级', dataIndex: 'grade', key: 'grade', width: 78,
      render: (g: number) => <Tag color={stageColors[g <= 2 ? 1 : g <= 4 ? 2 : 3]}>{g}年级</Tag>,
    },
    {
      title: '类型', dataIndex: 'type', key: 'type', width: 84,
      render: (t: string) => <Tag color={typeColors[t] || '#8b6914'}>{t}</Tag>,
    },
    {
      title: '学段', dataIndex: 'stage', key: 'stage', width: 88,
      render: (s: number) => <Tag>{stageLabels[s]}</Tag>,
    },
    {
      title: '状态', key: 'status', width: 96,
      render: (_: unknown, r: TextbookPoem) => {
        const v = STATUS_VIEW[statusOf(r)];
        return (
          <Space size={4}>
            <span className={`gj-dot ${v.dot}`} />
            <Text style={{ fontSize: 12 }}>{v.label}</Text>
          </Space>
        );
      },
    },
    {
      title: '关键词', dataIndex: 'keywords', key: 'keywords',
      render: (kw: string[]) => <Space wrap>{kw.map(k => <Tag key={k} style={{ fontSize: 11 }}>{k}</Tag>)}</Space>,
    },
  ];

  const sectionTitle = (text: string) => (
    <div className="gj-section-title" style={{ color: '#f3e9d8' }}>{text}</div>
  );

  const cardBody = { color: 'var(--ink-black)' } as const;

  return (
    <div className="gj-engine-bg">
      <div style={{ position: 'relative', zIndex: 1, padding: 24, maxWidth: 1400, margin: '0 auto' }}>

        {/* ===== 页头 ===== */}
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <Title level={2} style={{ color: '#f3e9d8', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
              <DatabaseOutlined style={{ color: 'var(--vermilion)' }} /> 书阁机关 · 课标匹配引擎
            </Title>
            <Text style={{ color: 'rgba(243,233,216,0.7)' }}>
              基于2022版义务教育语文课程标准 + 统编人教版1-6年级完整古诗文总库（112首古诗 + 14篇文言文）
            </Text>
          </div>
          <SealMark text="枢" color="var(--vermilion)" size={52} />
        </div>

        {/* ===== 核心指标卡 ===== */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={12} md={6}>
            <MetricCard title="课内篇目总数" value={stageStats.total} prefix={<BookOutlined />}
              color="var(--vermilion)" dotClass="gj-dot-vermilion" accent="已建学段标签" />
          </Col>
          <Col xs={12} md={6}>
            <MetricCard title="待处理篇目" value={counts.pending} prefix={<AimOutlined />}
              color="var(--gold)" dotClass="gj-dot-gold" accent="待 AI 解读 / 导出" />
          </Col>
          <Col xs={12} md={6}>
            <MetricCard title="AI 任务队列" value={tasks.length} prefix={<ThunderboltOutlined />}
              color="var(--jade)" dotClass="gj-dot-jade" accent={isBusy ? `${activeTasks.length} 项进行中` : '队列空闲'} />
          </Col>
          <Col xs={12} md={6}>
            <MetricCard title="系统状态" value={isBusy ? '繁忙' : '正常'} prefix={<CheckCircleOutlined />}
              color={isBusy ? 'var(--vermilion)' : 'var(--jade)'}
              dotClass={isBusy ? 'gj-dot-vermilion' : 'gj-dot-jade'}
              accent={isBusy ? '长卷展开中' : '运行平稳'} />
          </Col>
        </Row>

        {/* ===== 引擎中枢：左篇章管理 / 右 AI 任务监控 ===== */}
        <div style={{ marginBottom: 12 }}>{sectionTitle('引擎中枢')}</div>
        <div className="gj-cloud-border" style={{ padding: 14, marginBottom: 28, borderRadius: 14 }}>
          <Row gutter={[16, 16]}>
            {/* 左：篇章管理 */}
            <Col xs={24} lg={14}>
              <Card className="gj-card-dark gj-fade-up" style={cardBody}
                title={<span className="gj-section-title"><AppstoreOutlined /> 篇章管理</span>}>
                {/* 状态过滤 + 检索 */}
                <Space wrap size={[8, 8]} style={{ marginBottom: 12 }}>
                  {STATUS_OPTIONS.map(opt => (
                    <button key={opt.key} type="button" onClick={() => handleStatusChange(opt.key)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '3px 12px', borderRadius: 14, cursor: 'pointer',
                        fontFamily: 'inherit', fontSize: 13, color: 'var(--ink-black)',
                        border: `1px solid ${statusFilter === opt.key ? 'var(--vermilion)' : 'var(--border-ink)'}`,
                        background: statusFilter === opt.key ? 'var(--vermilion-soft)' : 'transparent',
                        transition: 'all .25s var(--gj-ease)',
                      }}>
                      {opt.dot && <span className={`gj-dot ${opt.dot}`} />}
                      {opt.label} <b>{counts[opt.key]}</b>
                    </button>
                  ))}
                  {inkLoading && <InkLoader size={14} />}
                </Space>

                <Space wrap size={[8, 8]} style={{ marginBottom: 12 }}>
                  <Input placeholder="搜索篇目、作者、关键词..." prefix={<SearchOutlined />}
                    value={searchText} onChange={e => setSearchText(e.target.value)}
                    style={{ width: 220 }} allowClear />
                  <Select placeholder="筛选年级" allowClear style={{ width: 110 }}
                    value={filterGrade} onChange={setFilterGrade}
                    options={[1, 2, 3, 4, 5, 6].map(g => ({ label: `${g}年级`, value: g }))} />
                  <Select placeholder="筛选类型" allowClear style={{ width: 110 }}
                    value={filterType} onChange={setFilterType}
                    options={allTypes.map(t => ({ label: t, value: t }))} />
                  <Text type="secondary">共 {filteredPoems.length} 篇</Text>
                </Space>

                {/* 批量操作条 */}
                {selectedRowKeys.length > 0 && (
                  <div className="gj-note" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                    <Text strong style={{ color: 'var(--ink-black)' }}>已选 {selectedRowKeys.length} 篇</Text>
                    <Button size="small" style={{ background: 'var(--vermilion)', borderColor: 'var(--vermilion)', color: '#fff' }}
                      onClick={() => handleBatch('ai')}>AI 解读</Button>
                    <Button size="small" style={{ background: 'var(--jade)', borderColor: 'var(--jade)', color: '#fff' }}
                      onClick={() => handleBatch('export')}><ExportOutlined /> 导出 CADAL</Button>
                    <Button size="small" type="text" icon={<ReloadOutlined />}
                      onClick={() => setSelectedRowKeys([])}>清空</Button>
                  </div>
                )}

                {/* 列表（水墨晕染过渡） */}
                <div className={`gj-ink-filter ${inkLoading ? 'is-loading' : ''}`}>
                  {filteredPoems.length === 0 ? (
                    <EmptyState text="未匹配到篇章，试换筛选条件" />
                  ) : (
                    <Table
                      columns={columns} dataSource={filteredPoems}
                      rowKey="id" size="small" pagination={{ pageSize: 12 }}
                      scroll={{ y: 460 }} rowSelection={rowSelection}
                      onRow={(record) => ({
                        onClick: () => setSelectedPoem(record),
                        style: {
                          cursor: 'pointer',
                          background: selectedPoem?.id === record.id ? 'var(--vermilion-soft)' : undefined,
                        },
                      })}
                    />
                  )}
                </div>
              </Card>

              {/* 选中篇目 CADAL 匹配方案 */}
              {selectedPoem && (
                <Card className="gj-card-dark gj-fade-up" style={{ ...cardBody, marginTop: 16, borderLeft: '4px solid var(--vermilion)' }}
                  title={<span className="gj-section-title"><LinkOutlined /> CADAL 古籍匹配方案：{selectedPoem.title}</span>}>
                  <Descriptions bordered size="small" column={2}>
                    <Descriptions.Item label="篇目">{selectedPoem.title}</Descriptions.Item>
                    <Descriptions.Item label="作者/出处">{selectedPoem.author} · {selectedPoem.dynasty}</Descriptions.Item>
                    <Descriptions.Item label="年级">{selectedPoem.grade}年级{selectedPoem.semester}学期</Descriptions.Item>
                    <Descriptions.Item label="学段">
                      <Tag color={stageColors[selectedPoem.stage]}>{stageFullLabels[selectedPoem.stage]}</Tag>
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
                      <Alert type="info" message={
                        <Space wrap>
                          {selectedPoem.cadalMatchHints.map(hint => (
                            <Tag key={hint} color="blue" style={{ fontSize: 13, padding: '4px 10px' }}>
                              <ExperimentOutlined /> {hint}
                            </Tag>
                          ))}
                        </Space>
                      } />
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
              )}
            </Col>

            {/* 右：AI 任务监控 */}
            <Col xs={24} lg={10}>
              <Card className="gj-card-dark gj-fade-up" style={{ ...cardBody, height: '100%' }}
                title={<span className="gj-section-title"><CloudServerOutlined /> AI 任务监控</span>}>
                {/* 卷轴展开式进度提示 */}
                {isBusy && (
                  <div className="gj-note" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <InkLoader size={16} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: 'var(--ink-black)' }}>
                        长卷展开中 · {activeTasks.length} 项任务
                      </div>
                      <div className="gj-scroll-progress" style={{ marginTop: 6 }}>
                        <i style={{ width: `${overallProgress}%` }} />
                      </div>
                    </div>
                  </div>
                )}

                {tasks.length === 0 ? (
                  <EmptyState text="尚无 AI 任务，勾选左侧篇章批量触发解读或导出" />
                ) : (
                  <div style={{ maxHeight: 560, overflowY: 'auto', paddingRight: 4 }}>
                    {tasks.map(task => (
                      <div key={task.id} className="gj-card gj-lift"
                        style={{ padding: 12, marginBottom: 12, border: '1px solid var(--border-ink)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                          <Space size={8}>
                            <SealMark text={task.kind === 'ai' ? '读' : '出'}
                              color="var(--vermilion)" bg="var(--vermilion-soft)" size={32} />
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--ink-black)' }}>{task.title}</div>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {task.targetIds.length} 篇 · {task.status === 'processing' ? '处理中' : '已完成'}
                              </Text>
                            </div>
                          </Space>
                          <Tag color={task.status === 'processing' ? 'red' : 'green'}>
                            {task.status === 'processing' ? '处理中' : '已完成'}
                          </Tag>
                        </div>
                        <div className="gj-scroll-progress" style={{ marginTop: 10 }}>
                          <i style={{ width: `${task.progress}%` }} />
                        </div>
                        <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: 'block' }}>
                          水墨长卷展开 {task.progress}%
                        </Text>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </div>

        {/* ===== 三学段分级标准 ===== */}
        <div style={{ marginBottom: 12 }}>{sectionTitle('三学段分级标准')}</div>
        <Row gutter={[16, 16]} style={{ marginBottom: 28 }}>
          {schoolStageStandards.map(std => (
            <Col xs={24} sm={8} key={std.stage}>
              <Card className="gj-card-dark gj-fade-up" style={{ ...cardBody, height: '100%', borderTop: `4px solid ${stageColors[std.stage]}` }}
                title={
                  <Space>
                    <Tag color={stageColors[std.stage]} style={{ fontSize: 14 }}>{std.name}</Tag>
                    <Text strong>{std.grades}</Text>
                  </Space>
                }>
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

        {/* ===== 关键词匹配逻辑 ===== */}
        <div style={{ marginBottom: 12 }}>{sectionTitle('关键词匹配逻辑')}</div>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card className="gj-card-dark gj-fade-up" style={cardBody} title="核心关键词词云（用于CADAL检索）">
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
            <Card className="gj-card-dark gj-fade-up" style={cardBody} title="高频作者（优先匹配CADAL别集）">
              {topAuthors.map((author, i) => (
                <div key={author.name} style={{ marginBottom: 12 }}>
                  <Space>
                    <Tag color={['#c43a31', '#b8860b', '#5b8c5a', '#2e5984'][i]}>{i + 1}</Tag>
                    <Text strong>{author.name}</Text>
                    <Text type="secondary">课内出现 {author.count} 次</Text>
                  </Space>
                  <div style={{ height: 6, background: '#f0e6d3', borderRadius: 3, marginTop: 4, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${(author.count / (topAuthors[0]?.count || 1)) * 100}%`,
                      background: ['#c43a31', '#b8860b', '#5b8c5a', '#2e5984'][i], borderRadius: 3,
                    }} />
                  </div>
                </div>
              ))}
            </Card>
            <Card className="gj-card-dark gj-fade-up" style={{ ...cardBody, marginTop: 16 }} title="类型分布">
              {[
                { type: '古诗', count: textbookPoems.filter(p => p.type === '古诗').length, color: '#c43a31' },
                { type: '词', count: textbookPoems.filter(p => p.type === '词').length, color: '#b8860b' },
                { type: '文言文', count: textbookPoems.filter(p => p.type === '文言文').length, color: '#5b8c5a' },
                { type: '蒙学', count: textbookPoems.filter(p => p.type === '蒙学').length, color: '#2e5984' },
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
            <Card className="gj-card-dark gj-fade-up" style={cardBody} title="CADAL 匹配逻辑说明（给浙大队友的接口文档）">
              <Collapse
                items={[
                  {
                    key: '1', label: '1. 课标分级标签库',
                    children: (
                      <Paragraph>
                        把1-2 / 3-4 / 5-6年级分成三类标签，程序读取CADAL古籍时自动打上学段标签，实现一键筛选对应年级拓展阅读。
                        系统已内置 {textbookPoems.length} 篇课内篇目的完整学段标签，每条记录包含 stage 字段（1/2/3）。
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
                        <Alert type="success" message={
                          <span><strong>例：</strong>检索五年级《杨氏之子》 → 自动匹配《世说新语》CADAL原版古籍、同类孩童轶事古文</span>
                        } />
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
                        <Descriptions.Item label="低段诗词">→ CADAL 蒙学读物、童谣古籍、古代儿童插画方志</Descriptions.Item>
                        <Descriptions.Item label="中段唐宋诗词">→ CADAL 全唐诗、宋诗钞、历代文人别集</Descriptions.Item>
                        <Descriptions.Item label="高段文言文（世说新语、论语等）">→ CADAL 完整古籍善本、明清刻本原版图像 + OCR 文字</Descriptions.Item>
                      </Descriptions>
                    ),
                  },
                ]}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
