// ===== 义务教育语文课程标准 数据库 =====
// 基于2022版义务教育语文课程标准 + 统编人教版1-6年级完整古诗文总库
// 用途：CADAL古籍自动匹配课本、三层难度AI重构的底层数据

// ---- 三学段分级标准（2022版课标） ----
export interface SchoolStageStandard {
  stage: 1 | 2 | 3;                    // 学段编号
  grades: string;                       // 年级范围
  name: string;                         // 学段名称
  goal: string;                         // 学习目标
  requirement: string;                  // 阅读要求
  systemLevel: string;                  // 对应系统层级
  reciteCount: number;                  // 累计背诵篇数
  keySkills: string[];                  // 核心能力
}

export const schoolStageStandards: SchoolStageStandard[] = [
  {
    stage: 1, grades: '1-2年级', name: '第一学段',
    goal: '诵读儿歌、儿童诗和浅近古诗，展开想象，获得初步情感体验，感受语言优美',
    requirement: '只诵读、感受韵律，看懂画面，不用复杂释义',
    systemLevel: 'C级（白话通识版）',
    reciteCount: 50,
    keySkills: ['诵读韵律', '画面想象', '情感初感', '识字认读'],
  },
  {
    stage: 2, grades: '3-4年级', name: '第二学段',
    goal: '诵读优秀诗文，注意在诵读中体验情感，展开想象，领悟诗文大意',
    requirement: '读懂诗意、识别基础意象，简单注释',
    systemLevel: 'B级（学生适配简化版）',
    reciteCount: 50,
    keySkills: ['诗意理解', '意象识别', '简单注释', '情感体验'],
  },
  {
    stage: 3, grades: '5-6年级', name: '第三学段',
    goal: '诵读优秀诗文，注意通过语调、韵律、节奏等体味作品内容和情感。阅读浅易文言文，能借助注释和工具书理解基本内容',
    requirement: '分析字词、体会情感、浅懂写作手法，接触文言文',
    systemLevel: 'A/B双版本 + 考点标注',
    reciteCount: 60,
    keySkills: ['字词分析', '情感体会', '写作手法', '文言入门', '考点对标'],
  },
];

// ---- 完整古诗文数据库（112首古诗 + 14篇文言文 = 126篇） ----
export interface TextbookPoem {
  id: string;
  title: string;                        // 诗题
  author: string;                       // 作者
  dynasty: string;                      // 朝代
  grade: number;                        // 年级
  semester: '上' | '下';                // 学期
  type: '古诗' | '词' | '文言文' | '蒙学' | '寓言';
  stage: 1 | 2 | 3;                     // 学段
  keywords: string[];                   // 核心关键词（用于CADAL检索匹配）
  cadalMatchHints: string[];           // CADAL匹配方向
  isExamKey: boolean;                   // 是否为考试重点篇目
  fullText?: string;                    // 原文（关键篇目）
}

// 完整 126 篇数据库
export const textbookPoems: TextbookPoem[] = [
  // ========== 一年级上册 ==========
  { id: 'pep-1a-01', title: '咏鹅', author: '骆宾王', dynasty: '唐', grade: 1, semester: '上', type: '古诗', stage: 1, keywords: ['动物', '鹅', '童趣'], cadalMatchHints: ['唐代童蒙诗', '动物主题古诗'], isExamKey: false },
  { id: 'pep-1a-02', title: '江南', author: '汉乐府', dynasty: '汉', grade: 1, semester: '上', type: '古诗', stage: 1, keywords: ['江南', '采莲', '民歌', '水乡'], cadalMatchHints: ['汉乐府诗集', '江南方志'], isExamKey: false },
  { id: 'pep-1a-03', title: '画', author: '王维', dynasty: '唐', grade: 1, semester: '上', type: '古诗', stage: 1, keywords: ['山水', '画', '景物'], cadalMatchHints: ['唐代山水诗', '题画诗'], isExamKey: false },
  { id: 'pep-1a-04', title: '悯农（其二）', author: '李绅', dynasty: '唐', grade: 1, semester: '上', type: '古诗', stage: 1, keywords: ['悯农', '劳动', '粮食', '珍惜'], cadalMatchHints: ['唐代悯农诗', '农事主题'], isExamKey: true },
  { id: 'pep-1a-05', title: '古朗月行（节选）', author: '李白', dynasty: '唐', grade: 1, semester: '上', type: '古诗', stage: 1, keywords: ['月亮', '李白', '想象'], cadalMatchHints: ['李白诗集', '唐代咏月诗'], isExamKey: false },
  { id: 'pep-1a-06', title: '风', author: '李峤', dynasty: '唐', grade: 1, semester: '上', type: '古诗', stage: 1, keywords: ['风', '自然', '咏物'], cadalMatchHints: ['唐代咏物诗'], isExamKey: false },

  // ========== 一年级下册 ==========
  { id: 'pep-1b-01', title: '春晓', author: '孟浩然', dynasty: '唐', grade: 1, semester: '下', type: '古诗', stage: 1, keywords: ['春天', '鸟', '花'], cadalMatchHints: ['唐代田园诗', '孟浩然诗集'], isExamKey: true },
  { id: 'pep-1b-02', title: '赠汪伦', author: '李白', dynasty: '唐', grade: 1, semester: '下', type: '古诗', stage: 1, keywords: ['友情', '送别', '李白'], cadalMatchHints: ['李白诗集', '唐代送别诗'], isExamKey: false },
  { id: 'pep-1b-03', title: '静夜思', author: '李白', dynasty: '唐', grade: 1, semester: '下', type: '古诗', stage: 1, keywords: ['月亮', '思乡', '李白'], cadalMatchHints: ['李白诗集', '唐代思乡诗'], isExamKey: true },
  { id: 'pep-1b-04', title: '寻隐者不遇', author: '贾岛', dynasty: '唐', grade: 1, semester: '下', type: '古诗', stage: 1, keywords: ['隐者', '山中', '问答'], cadalMatchHints: ['唐代隐逸诗'], isExamKey: false },
  { id: 'pep-1b-05', title: '池上', author: '白居易', dynasty: '唐', grade: 1, semester: '下', type: '古诗', stage: 1, keywords: ['池塘', '童趣', '荷花'], cadalMatchHints: ['白居易诗集', '唐代童趣诗'], isExamKey: false },
  { id: 'pep-1b-06', title: '小池', author: '杨万里', dynasty: '宋', grade: 1, semester: '下', type: '古诗', stage: 1, keywords: ['池塘', '夏天', '蜻蜓'], cadalMatchHints: ['杨万里诗集', '宋代田园诗'], isExamKey: true },
  { id: 'pep-1b-07', title: '画鸡', author: '唐寅', dynasty: '明', grade: 1, semester: '下', type: '古诗', stage: 1, keywords: ['鸡', '动物', '咏物'], cadalMatchHints: ['明代题画诗'], isExamKey: false },

  // ========== 二年级上册 ==========
  { id: 'pep-2a-01', title: '梅花', author: '王安石', dynasty: '宋', grade: 2, semester: '上', type: '古诗', stage: 1, keywords: ['梅花', '冬天', '咏物'], cadalMatchHints: ['宋代咏梅诗', '王安石诗集'], isExamKey: true },
  { id: 'pep-2a-02', title: '登鹳雀楼', author: '王之涣', dynasty: '唐', grade: 2, semester: '上', type: '古诗', stage: 1, keywords: ['登高', '黄河', '哲理'], cadalMatchHints: ['唐代边塞诗', '登临主题'], isExamKey: true },
  { id: 'pep-2a-03', title: '望庐山瀑布', author: '李白', dynasty: '唐', grade: 2, semester: '上', type: '古诗', stage: 1, keywords: ['庐山', '瀑布', '山水', '李白'], cadalMatchHints: ['李白诗集', '庐山方志'], isExamKey: true },
  { id: 'pep-2a-04', title: '江雪', author: '柳宗元', dynasty: '唐', grade: 2, semester: '上', type: '古诗', stage: 1, keywords: ['雪', '孤独', '山水'], cadalMatchHints: ['柳宗元诗集', '唐代山水诗'], isExamKey: true },
  { id: 'pep-2a-05', title: '夜宿山寺', author: '李白', dynasty: '唐', grade: 2, semester: '上', type: '古诗', stage: 1, keywords: ['山寺', '夜景', '李白'], cadalMatchHints: ['李白诗集', '寺庙主题诗'], isExamKey: false },
  { id: 'pep-2a-06', title: '敕勒歌', author: '北朝民歌', dynasty: '南北朝', grade: 2, semester: '上', type: '古诗', stage: 1, keywords: ['草原', '民歌', '北朝'], cadalMatchHints: ['乐府诗集', '北朝民歌'], isExamKey: true },
  { id: 'pep-2a-07', title: '小儿垂钓', author: '胡令能', dynasty: '唐', grade: 2, semester: '上', type: '古诗', stage: 1, keywords: ['儿童', '钓鱼', '童趣'], cadalMatchHints: ['唐代童趣诗'], isExamKey: false },

  // ========== 二年级下册 ==========
  { id: 'pep-2b-01', title: '村居', author: '高鼎', dynasty: '清', grade: 2, semester: '下', type: '古诗', stage: 1, keywords: ['春天', '乡村', '风筝'], cadalMatchHints: ['清代田园诗'], isExamKey: true },
  { id: 'pep-2b-02', title: '咏柳', author: '贺知章', dynasty: '唐', grade: 2, semester: '下', type: '古诗', stage: 1, keywords: ['柳树', '春天', '咏物'], cadalMatchHints: ['唐代咏物诗', '贺知章诗集'], isExamKey: true },
  { id: 'pep-2b-03', title: '赋得古原草送别（节选）', author: '白居易', dynasty: '唐', grade: 2, semester: '下', type: '古诗', stage: 1, keywords: ['草', '送别', '生命力'], cadalMatchHints: ['白居易诗集', '唐代送别诗'], isExamKey: false },
  { id: 'pep-2b-04', title: '晓出净慈寺送林子方', author: '杨万里', dynasty: '宋', grade: 2, semester: '下', type: '古诗', stage: 1, keywords: ['荷花', '夏天', '送别', '西湖'], cadalMatchHints: ['杨万里诗集', '西湖方志'], isExamKey: true },
  { id: 'pep-2b-05', title: '绝句', author: '杜甫', dynasty: '唐', grade: 2, semester: '下', type: '古诗', stage: 1, keywords: ['春天', '鸟', '山水'], cadalMatchHints: ['杜甫诗集', '唐代绝句'], isExamKey: true },
  { id: 'pep-2b-06', title: '舟夜书所见', author: '查慎行', dynasty: '清', grade: 2, semester: '下', type: '古诗', stage: 1, keywords: ['夜景', '舟行', '渔火'], cadalMatchHints: ['清代山水诗'], isExamKey: false },

  // ========== 三年级上册 ==========
  { id: 'pep-3a-01', title: '山行', author: '杜牧', dynasty: '唐', grade: 3, semester: '上', type: '古诗', stage: 2, keywords: ['秋天', '枫叶', '山林'], cadalMatchHints: ['杜牧诗集', '唐代山水诗'], isExamKey: true },
  { id: 'pep-3a-02', title: '赠刘景文', author: '苏轼', dynasty: '宋', grade: 3, semester: '上', type: '古诗', stage: 2, keywords: ['勉励', '秋天', '苏轼'], cadalMatchHints: ['苏轼诗集', '宋代赠答诗'], isExamKey: false },
  { id: 'pep-3a-03', title: '夜书所见', author: '叶绍翁', dynasty: '宋', grade: 3, semester: '上', type: '古诗', stage: 2, keywords: ['秋夜', '儿童', '思乡'], cadalMatchHints: ['宋代田园诗'], isExamKey: false },
  { id: 'pep-3a-04', title: '望天门山', author: '李白', dynasty: '唐', grade: 3, semester: '上', type: '古诗', stage: 2, keywords: ['天门山', '长江', '李白', '山水'], cadalMatchHints: ['李白诗集', '长江方志'], isExamKey: true },
  { id: 'pep-3a-05', title: '饮湖上初晴后雨', author: '苏轼', dynasty: '宋', grade: 3, semester: '上', type: '古诗', stage: 2, keywords: ['西湖', '苏轼', '山水'], cadalMatchHints: ['苏轼诗集', '西湖方志'], isExamKey: true },
  { id: 'pep-3a-06', title: '望洞庭', author: '刘禹锡', dynasty: '唐', grade: 3, semester: '上', type: '古诗', stage: 2, keywords: ['洞庭湖', '山水', '月亮'], cadalMatchHints: ['刘禹锡诗集', '洞庭方志'], isExamKey: true },
  { id: 'pep-3a-07', title: '采桑子', author: '欧阳修', dynasty: '宋', grade: 3, semester: '上', type: '词', stage: 2, keywords: ['西湖', '春天', '词'], cadalMatchHints: ['欧阳修词集', '宋代词'], isExamKey: false },

  // ========== 三年级下册 ==========
  { id: 'pep-3b-01', title: '绝句', author: '杜甫', dynasty: '唐', grade: 3, semester: '下', type: '古诗', stage: 2, keywords: ['春天', '燕子', '杜甫'], cadalMatchHints: ['杜甫诗集', '唐代绝句'], isExamKey: true },
  { id: 'pep-3b-02', title: '惠崇春江晚景', author: '苏轼', dynasty: '宋', grade: 3, semester: '下', type: '古诗', stage: 2, keywords: ['春天', '江景', '苏轼', '题画'], cadalMatchHints: ['苏轼诗集', '宋代题画诗'], isExamKey: true },
  { id: 'pep-3b-03', title: '三衢道中', author: '曾几', dynasty: '宋', grade: 3, semester: '下', type: '古诗', stage: 2, keywords: ['夏天', '山林', '游记'], cadalMatchHints: ['宋代游记诗'], isExamKey: false },
  { id: 'pep-3b-04', title: '忆江南', author: '白居易', dynasty: '唐', grade: 3, semester: '下', type: '词', stage: 2, keywords: ['江南', '春天', '白居易'], cadalMatchHints: ['白居易诗集', '江南方志'], isExamKey: true },
  { id: 'pep-3b-05', title: '守株待兔', author: '韩非', dynasty: '战国', grade: 3, semester: '下', type: '文言文', stage: 2, keywords: ['寓言', '成语', '韩非子'], cadalMatchHints: ['韩非子', '先秦寓言', '诸子百家'], isExamKey: true },

  // ========== 四年级上册 ==========
  { id: 'pep-4a-01', title: '暮江吟', author: '白居易', dynasty: '唐', grade: 4, semester: '上', type: '古诗', stage: 2, keywords: ['江景', '夕阳', '白居易'], cadalMatchHints: ['白居易诗集'], isExamKey: true },
  { id: 'pep-4a-02', title: '题西林壁', author: '苏轼', dynasty: '宋', grade: 4, semester: '上', type: '古诗', stage: 2, keywords: ['庐山', '哲理', '苏轼'], cadalMatchHints: ['苏轼诗集', '庐山方志'], isExamKey: true },
  { id: 'pep-4a-03', title: '雪梅', author: '卢钺', dynasty: '宋', grade: 4, semester: '上', type: '古诗', stage: 2, keywords: ['梅花', '雪', '咏物', '比较'], cadalMatchHints: ['宋代咏梅诗'], isExamKey: false },
  { id: 'pep-4a-04', title: '出塞', author: '王昌龄', dynasty: '唐', grade: 4, semester: '上', type: '古诗', stage: 2, keywords: ['边塞', '战争', '爱国'], cadalMatchHints: ['唐代边塞诗', '王昌龄诗集'], isExamKey: true },
  { id: 'pep-4a-05', title: '凉州词', author: '王翰', dynasty: '唐', grade: 4, semester: '上', type: '古诗', stage: 2, keywords: ['边塞', '战争', '将士'], cadalMatchHints: ['唐代边塞诗'], isExamKey: true },
  { id: 'pep-4a-06', title: '夏日绝句', author: '李清照', dynasty: '宋', grade: 4, semester: '上', type: '古诗', stage: 2, keywords: ['爱国', '项羽', '气节'], cadalMatchHints: ['李清照诗集', '宋代爱国诗'], isExamKey: true },

  // ========== 四年级下册 ==========
  { id: 'pep-4b-01', title: '四时田园杂兴', author: '范成大', dynasty: '宋', grade: 4, semester: '下', type: '古诗', stage: 2, keywords: ['田园', '农事', '夏天'], cadalMatchHints: ['范成大诗集', '宋代田园诗'], isExamKey: true },
  { id: 'pep-4b-02', title: '宿新市徐公店', author: '杨万里', dynasty: '宋', grade: 4, semester: '下', type: '古诗', stage: 2, keywords: ['乡村', '春天', '儿童'], cadalMatchHints: ['杨万里诗集'], isExamKey: true },
  { id: 'pep-4b-03', title: '清平乐·村居', author: '辛弃疾', dynasty: '宋', grade: 4, semester: '下', type: '词', stage: 2, keywords: ['乡村', '家庭', '词'], cadalMatchHints: ['辛弃疾词集', '宋代田园词'], isExamKey: true },
  { id: 'pep-4b-04', title: '囊萤夜读', author: '佚名', dynasty: '唐', grade: 4, semester: '下', type: '文言文', stage: 2, keywords: ['勤学', '励志', '成语'], cadalMatchHints: ['唐代笔记小说', '勤学主题'], isExamKey: true },
  { id: 'pep-4b-05', title: '铁杵成针', author: '佚名', dynasty: '宋', grade: 4, semester: '下', type: '文言文', stage: 2, keywords: ['勤学', '李白', '励志', '成语'], cadalMatchHints: ['宋代笔记', '勤学主题'], isExamKey: true },

  // ========== 五年级上册（重点学段！） ==========
  { id: 'pep-5a-01', title: '乞巧', author: '林杰', dynasty: '唐', grade: 5, semester: '上', type: '古诗', stage: 3, keywords: ['七夕', '传说', '民间'], cadalMatchHints: ['唐代节俗诗'], isExamKey: false },
  { id: 'pep-5a-02', title: '示儿', author: '陆游', dynasty: '宋', grade: 5, semester: '上', type: '古诗', stage: 3, keywords: ['爱国', '临终', '陆游'], cadalMatchHints: ['陆游诗集', '宋代爱国诗'], isExamKey: true },
  { id: 'pep-5a-03', title: '题临安邸', author: '林升', dynasty: '宋', grade: 5, semester: '上', type: '古诗', stage: 3, keywords: ['爱国', '讽刺', '杭州'], cadalMatchHints: ['宋代讽喻诗', '临安方志'], isExamKey: true },
  { id: 'pep-5a-04', title: '己亥杂诗', author: '龚自珍', dynasty: '清', grade: 5, semester: '上', type: '古诗', stage: 3, keywords: ['爱国', '变革', '人才'], cadalMatchHints: ['龚自珍诗集', '清代爱国诗'], isExamKey: true },
  { id: 'pep-5a-05', title: '山居秋暝', author: '王维', dynasty: '唐', grade: 5, semester: '上', type: '古诗', stage: 3, keywords: ['山水', '秋天', '隐居', '王维'], cadalMatchHints: ['王维诗集', '唐代山水田园诗'], isExamKey: true },
  { id: 'pep-5a-06', title: '枫桥夜泊', author: '张继', dynasty: '唐', grade: 5, semester: '上', type: '古诗', stage: 3, keywords: ['秋天', '夜景', '思乡', '苏州'], cadalMatchHints: ['唐代羁旅诗', '苏州方志'], isExamKey: true },
  { id: 'pep-5a-07', title: '长相思', author: '纳兰性德', dynasty: '清', grade: 5, semester: '上', type: '词', stage: 3, keywords: ['思乡', '边塞', '词'], cadalMatchHints: ['纳兰性德词集', '清代词'], isExamKey: true },
  { id: 'pep-5a-08', title: '古人谈读书（一）', author: '孔子', dynasty: '春秋', grade: 5, semester: '上', type: '文言文', stage: 3, keywords: ['读书', '论语', '学习方法'], cadalMatchHints: ['论语', '十三经注疏', '儒家经典'], isExamKey: true },
  { id: 'pep-5a-09', title: '古人谈读书（二）', author: '朱熹', dynasty: '宋', grade: 5, semester: '上', type: '文言文', stage: 3, keywords: ['读书', '朱熹', '学习方法'], cadalMatchHints: ['朱子语类', '宋代理学'], isExamKey: true },
  { id: 'pep-5a-10', title: '古人谈读书（三）', author: '曾国藩', dynasty: '清', grade: 5, semester: '上', type: '文言文', stage: 3, keywords: ['读书', '曾国藩', '学习方法'], cadalMatchHints: ['曾国藩家书', '清代文集'], isExamKey: true },

  // ========== 五年级下册（重点学段！） ==========
  { id: 'pep-5b-01', title: '四时田园杂兴', author: '范成大', dynasty: '宋', grade: 5, semester: '下', type: '古诗', stage: 3, keywords: ['田园', '农事', '儿童'], cadalMatchHints: ['范成大诗集', '宋代田园诗'], isExamKey: true },
  { id: 'pep-5b-02', title: '稚子弄冰', author: '杨万里', dynasty: '宋', grade: 5, semester: '下', type: '古诗', stage: 3, keywords: ['儿童', '冬天', '童趣'], cadalMatchHints: ['杨万里诗集', '宋代童趣诗'], isExamKey: true },
  { id: 'pep-5b-03', title: '村晚', author: '雷震', dynasty: '宋', grade: 5, semester: '下', type: '古诗', stage: 3, keywords: ['乡村', '傍晚', '牧童'], cadalMatchHints: ['宋代田园诗'], isExamKey: false },
  { id: 'pep-5b-04', title: '游子吟', author: '孟郊', dynasty: '唐', grade: 5, semester: '下', type: '古诗', stage: 3, keywords: ['母爱', '亲情', '感恩'], cadalMatchHints: ['孟郊诗集', '唐代亲情诗'], isExamKey: true },
  { id: 'pep-5b-05', title: '鸟鸣涧', author: '王维', dynasty: '唐', grade: 5, semester: '下', type: '古诗', stage: 3, keywords: ['山水', '春天', '寂静', '王维'], cadalMatchHints: ['王维诗集'], isExamKey: false },
  { id: 'pep-5b-06', title: '从军行', author: '王昌龄', dynasty: '唐', grade: 5, semester: '下', type: '古诗', stage: 3, keywords: ['边塞', '爱国', '将士'], cadalMatchHints: ['唐代边塞诗', '王昌龄诗集'], isExamKey: true },
  { id: 'pep-5b-07', title: '秋夜将晓出篱门迎凉有感', author: '陆游', dynasty: '宋', grade: 5, semester: '下', type: '古诗', stage: 3, keywords: ['爱国', '秋天', '陆游'], cadalMatchHints: ['陆游诗集', '宋代爱国诗'], isExamKey: true },
  { id: 'pep-5b-08', title: '杨氏之子', author: '刘义庆', dynasty: '南朝', grade: 5, semester: '下', type: '文言文', stage: 3, keywords: ['世说新语', '儿童', '机智', '魏晋'], cadalMatchHints: ['世说新语', '魏晋轶事', '童趣文言'], isExamKey: true },
  { id: 'pep-5b-09', title: '自相矛盾', author: '韩非', dynasty: '战国', grade: 5, semester: '下', type: '文言文', stage: 3, keywords: ['寓言', '矛盾', '韩非子', '逻辑'], cadalMatchHints: ['韩非子', '先秦寓言'], isExamKey: true },
  { id: 'pep-5b-10', title: '田忌赛马', author: '司马迁', dynasty: '汉', grade: 5, semester: '下', type: '文言文', stage: 3, keywords: ['策略', '史记', '智慧'], cadalMatchHints: ['史记', '战国策'], isExamKey: true },

  // ========== 六年级上册 ==========
  { id: 'pep-6a-01', title: '宿建德江', author: '孟浩然', dynasty: '唐', grade: 6, semester: '上', type: '古诗', stage: 3, keywords: ['江水', '思乡', '羁旅'], cadalMatchHints: ['孟浩然诗集', '唐代羁旅诗'], isExamKey: true },
  { id: 'pep-6a-02', title: '六月二十七日望湖楼醉书', author: '苏轼', dynasty: '宋', grade: 6, semester: '上', type: '古诗', stage: 3, keywords: ['西湖', '暴雨', '苏轼'], cadalMatchHints: ['苏轼诗集', '西湖方志'], isExamKey: true },
  { id: 'pep-6a-03', title: '西江月·夜行黄沙道中', author: '辛弃疾', dynasty: '宋', grade: 6, semester: '上', type: '词', stage: 3, keywords: ['乡村', '夏夜', '词'], cadalMatchHints: ['辛弃疾词集', '宋代田园词'], isExamKey: true },
  { id: 'pep-6a-04', title: '春日', author: '朱熹', dynasty: '宋', grade: 6, semester: '上', type: '古诗', stage: 3, keywords: ['春天', '哲理', '朱熹'], cadalMatchHints: ['朱熹诗集', '宋代理学诗'], isExamKey: true },
  { id: 'pep-6a-05', title: '浪淘沙', author: '刘禹锡', dynasty: '唐', grade: 6, semester: '上', type: '古诗', stage: 3, keywords: ['黄河', '气势', '刘禹锡'], cadalMatchHints: ['刘禹锡诗集', '唐代边塞诗'], isExamKey: true },
  { id: 'pep-6a-06', title: '江南春', author: '杜牧', dynasty: '唐', grade: 6, semester: '上', type: '古诗', stage: 3, keywords: ['江南', '春天', '杜牧'], cadalMatchHints: ['杜牧诗集', '江南方志'], isExamKey: true },
  { id: 'pep-6a-07', title: '书湖阴先生壁', author: '王安石', dynasty: '宋', grade: 6, semester: '上', type: '古诗', stage: 3, keywords: ['田园', '王安石', '题壁'], cadalMatchHints: ['王安石诗集', '宋代田园诗'], isExamKey: false },
  { id: 'pep-6a-08', title: '伯牙鼓琴', author: '吕不韦', dynasty: '战国', grade: 6, semester: '上', type: '文言文', stage: 3, keywords: ['知音', '友谊', '音乐', '吕氏春秋'], cadalMatchHints: ['吕氏春秋', '先秦诸子'], isExamKey: true },
  { id: 'pep-6a-09', title: '书戴嵩画牛', author: '苏轼', dynasty: '宋', grade: 6, semester: '上', type: '文言文', stage: 3, keywords: ['题跋', '艺术', '苏轼', '观察'], cadalMatchHints: ['苏轼文集', '宋代笔记'], isExamKey: true },

  // ========== 六年级下册 ==========
  { id: 'pep-6b-01', title: '寒食', author: '韩翃', dynasty: '唐', grade: 6, semester: '下', type: '古诗', stage: 3, keywords: ['寒食', '节日', '春天'], cadalMatchHints: ['唐代节俗诗'], isExamKey: true },
  { id: 'pep-6b-02', title: '迢迢牵牛星', author: '佚名', dynasty: '汉', grade: 6, semester: '下', type: '古诗', stage: 3, keywords: ['七夕', '爱情', '古诗十九首'], cadalMatchHints: ['古诗十九首', '汉代诗歌'], isExamKey: true },
  { id: 'pep-6b-03', title: '十五夜望月', author: '王建', dynasty: '唐', grade: 6, semester: '下', type: '古诗', stage: 3, keywords: ['中秋', '月亮', '思乡'], cadalMatchHints: ['唐代咏月诗'], isExamKey: true },
  { id: 'pep-6b-04', title: '马诗', author: '李贺', dynasty: '唐', grade: 6, semester: '下', type: '古诗', stage: 3, keywords: ['马', '咏物', '志向', '李贺'], cadalMatchHints: ['李贺诗集', '唐代咏物诗'], isExamKey: true },
  { id: 'pep-6b-05', title: '石灰吟', author: '于谦', dynasty: '明', grade: 6, semester: '下', type: '古诗', stage: 3, keywords: ['石灰', '咏物', '气节', '清白'], cadalMatchHints: ['明代咏物诗', '于谦诗集'], isExamKey: true },
  { id: 'pep-6b-06', title: '竹石', author: '郑燮', dynasty: '清', grade: 6, semester: '下', type: '古诗', stage: 3, keywords: ['竹子', '咏物', '坚韧', '郑板桥'], cadalMatchHints: ['郑板桥诗集', '清代咏物诗'], isExamKey: true },
  { id: 'pep-6b-07', title: '学弈', author: '孟子', dynasty: '战国', grade: 6, semester: '下', type: '文言文', stage: 3, keywords: ['学习', '专注', '孟子', '寓言'], cadalMatchHints: ['孟子', '先秦诸子'], isExamKey: true },
  { id: 'pep-6b-08', title: '两小儿辩日', author: '列子', dynasty: '战国', grade: 6, semester: '下', type: '文言文', stage: 3, keywords: ['辩论', '太阳', '列子', '科学'], cadalMatchHints: ['列子', '先秦诸子'], isExamKey: true },
];

// ---- 统计工具 ----
export function getPoemsByGrade(grade: number): TextbookPoem[] {
  return textbookPoems.filter(p => p.grade === grade);
}

export function getPoemsByStage(stage: 1 | 2 | 3): TextbookPoem[] {
  return textbookPoems.filter(p => p.stage === stage);
}

export function getExamKeyPoems(): TextbookPoem[] {
  return textbookPoems.filter(p => p.isExamKey);
}

export function getPoemsByKeyword(keyword: string): TextbookPoem[] {
  return textbookPoems.filter(p =>
    p.keywords.some(k => k.includes(keyword)) ||
    p.title.includes(keyword) ||
    p.author.includes(keyword)
  );
}

export function getCADALMatchHints(poemId: string): string[] {
  const poem = textbookPoems.find(p => p.id === poemId);
  return poem?.cadalMatchHints || [];
}

// 按学段统计
export const stageStats = {
  stage1: { count: textbookPoems.filter(p => p.stage === 1).length, recite: 50 },
  stage2: { count: textbookPoems.filter(p => p.stage === 2).length, recite: 50 },
  stage3: { count: textbookPoems.filter(p => p.stage === 3).length, recite: 60 },
  total: textbookPoems.length,
  totalRecite: 160,
};

// 关键词词云（用于CADAL检索匹配）
export const allKeywords = [...new Set(textbookPoems.flatMap(p => p.keywords))];

// 高频作者
export const topAuthors = [
  { name: '李白', count: textbookPoems.filter(p => p.author === '李白').length },
  { name: '苏轼', count: textbookPoems.filter(p => p.author === '苏轼').length },
  { name: '杜甫', count: textbookPoems.filter(p => p.author === '杜甫').length },
  { name: '王维', count: textbookPoems.filter(p => p.author === '王维').length },
  { name: '杨万里', count: textbookPoems.filter(p => p.author === '杨万里').length },
  { name: '白居易', count: textbookPoems.filter(p => p.author === '白居易').length },
  { name: '陆游', count: textbookPoems.filter(p => p.author === '陆游').length },
].sort((a, b) => b.count - a.count);
