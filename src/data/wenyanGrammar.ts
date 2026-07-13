// ===== 文言文语法标注数据 =====
import type { WenyanAnnotation } from '../types';

// ---- 小学段 ----
export const wenyanGrammarPrimary: Record<string, WenyanAnnotation> = {
  // text-003 守株待兔
  'text-003': {
    textId: 'text-003',
    sentences: [
      {
        index: 1,
        original: '宋人有耕者。',
        translation: '宋国有一个耕田的农夫。',
        tokens: [
          { word: '宋人', type: '实词', modernMeaning: '宋国人', detail: '"宋"是春秋战国时期的诸侯国名。' },
          { word: '者', type: '虚词', modernMeaning: '……的人', detail: '代词，用在动词后组成名词性结构，表示"……的人"。' },
        ],
      },
      {
        index: 2,
        original: '田中有株。',
        translation: '田地里有一个树桩。',
        tokens: [
          { word: '株', type: '实词', modernMeaning: '树桩、露在地面的树根', detail: '注意与现代"一株花"中的"株"（量词）区分。' },
        ],
      },
      {
        index: 3,
        original: '兔走触株，折颈而死。',
        translation: '兔子跑过来撞在树桩上，折断脖子而死。',
        tokens: [
          { word: '走', type: '古今异义', modernMeaning: '跑', detail: '古义为"跑、奔跑"，今义为"行走"。成语"走马观花"中的"走"也保留此古义。' },
          { word: '触', type: '实词', modernMeaning: '撞到、碰', detail: '接触、碰撞。' },
          { word: '折', type: '实词', modernMeaning: '折断', detail: '此处读 zhé，义为折断。' },
          { word: '而', type: '虚词', modernMeaning: '表示承接关系，于是、就', detail: '连词，连接前后两个动作，表承接关系。' },
        ],
      },
      {
        index: 4,
        original: '因释其耒而守株，冀复得兔。',
        translation: '于是（农夫）放下他的农具，守在树桩旁，希望再得到兔子。',
        tokens: [
          { word: '因', type: '虚词', modernMeaning: '于是、就', detail: '连词，表示承接上文，相当于"于是""就"。' },
          { word: '释', type: '实词', modernMeaning: '放下、放开', detail: '成语"爱不释手"中"释"即此义。' },
          { word: '耒', type: '实词', modernMeaning: '古代的一种农具', detail: '读 lěi，形似木叉的翻土工具。' },
          { word: '冀', type: '实词', modernMeaning: '希望、期望', detail: '文言常用词，表示希望。注意与"翼"（翅膀）区分。' },
          { word: '复', type: '虚词', modernMeaning: '再、又', detail: '副词，表示动作的重复。' },
        ],
      },
    ],
  },

  // text-013 杨氏之子
  'text-013': {
    textId: 'text-013',
    sentences: [
      {
        index: 1,
        original: '梁国杨氏子九岁，甚聪惠。',
        translation: '梁国姓杨的人家有个儿子九岁，非常聪明。',
        tokens: [
          { word: '氏', type: '实词', modernMeaning: '姓氏、家族', detail: '"杨氏"即姓杨的人家。' },
          { word: '甚', type: '虚词', modernMeaning: '很、非常', detail: '程度副词，表示程度深。' },
          { word: '惠', type: '通假字', modernMeaning: '聪明', detail: '通"慧"，智慧、聪明。', relatedChar: '慧' },
        ],
      },
      {
        index: 2,
        original: '孔君平诣其父，父不在，乃呼儿出。',
        translation: '孔君平来拜访他的父亲，父亲不在家，于是叫这个孩子出来。',
        tokens: [
          { word: '诣', type: '实词', modernMeaning: '拜访、前往', detail: '读 yì，文言中"诣"表示专程前往拜访。' },
          { word: '其', type: '虚词', modernMeaning: '他的', detail: '代词，这里指杨氏之子。' },
          { word: '乃', type: '虚词', modernMeaning: '于是、就', detail: '连词，表示承接关系。' },
        ],
      },
      {
        index: 3,
        original: '为设果，果有杨梅。',
        translation: '（杨氏子）为（孔君平）摆上水果，水果中有杨梅。',
        tokens: [
          { word: '为', type: '虚词', modernMeaning: '给、替', detail: '介词，读 wèi，表示动作的受益对象。' },
          { word: '设', type: '实词', modernMeaning: '摆设、摆放', detail: '准备、布置。' },
        ],
      },
      {
        index: 4,
        original: '孔指以示儿曰："此是君家果。"',
        translation: '孔君平指着杨梅给孩子看，说："这是你家的水果。"',
        tokens: [
          { word: '指以', type: '特殊句式', modernMeaning: '指给……看', detail: '"指以示儿"即"指（之）以示儿"，省略了宾语"之"。' },
          { word: '示', type: '实词', modernMeaning: '给……看', detail: '展示、让人看。' },
          { word: '曰', type: '实词', modernMeaning: '说', detail: '文言中"曰"是常用的"说"的表达。' },
          { word: '君', type: '实词', modernMeaning: '您', detail: '对对方的尊称。孔君平用"君家果"来开玩笑，因为杨梅和杨氏同姓。' },
        ],
      },
      {
        index: 5,
        original: '儿应声答曰："未闻孔雀是夫子家禽。"',
        translation: '孩子马上回答说："没听说孔雀是先生您家的鸟。"',
        tokens: [
          { word: '应声', type: '实词', modernMeaning: '随着声音、马上', detail: '表示反应迅速、不假思索。' },
          { word: '未', type: '虚词', modernMeaning: '没有、不曾', detail: '否定副词。' },
          { word: '闻', type: '实词', modernMeaning: '听说', detail: '文言中"闻"常表示听说、得知。' },
          { word: '夫子', type: '实词', modernMeaning: '对男子的尊称', detail: '古代对老师或有学问的人的称呼，这里尊称孔君平。' },
          { word: '禽', type: '古今异义', modernMeaning: '鸟类的总称', detail: '古义指鸟兽的总称，今义多指鸟类。这里特指鸟。杨氏子巧妙地用"孔雀"对应"夫子"，以彼之道还施彼身。' },
        ],
      },
    ],
  },

  // text-014 自相矛盾
  'text-014': {
    textId: 'text-014',
    sentences: [
      {
        index: 1,
        original: '楚人有鬻盾与矛者。',
        translation: '楚国有一个卖盾和矛的人。',
        tokens: [
          { word: '鬻', type: '实词', modernMeaning: '卖', detail: '读 yù，文言常用词。成语"卖官鬻爵"中保留此义。' },
        ],
      },
      {
        index: 2,
        original: '誉之曰："吾盾之坚，物莫能陷也。"',
        translation: '（他）称赞他的盾说："我的盾的坚固程度，没有什么东西能刺穿它。"',
        tokens: [
          { word: '誉', type: '实词', modernMeaning: '称赞、夸耀', detail: '动词，赞美、夸奖。' },
          { word: '坚', type: '实词', modernMeaning: '坚固、坚硬', detail: '形容词。' },
          { word: '莫', type: '虚词', modernMeaning: '没有什么、没有谁', detail: '无定代词，表示否定性无指。' },
          { word: '陷', type: '实词', modernMeaning: '刺穿、穿透', detail: '攻破、刺入。' },
        ],
      },
      {
        index: 3,
        original: '又誉其矛曰："吾矛之利，于物无不陷也。"',
        translation: '又称赞他的矛说："我的矛的锋利程度，对于任何东西没有不能刺穿的。"',
        tokens: [
          { word: '利', type: '实词', modernMeaning: '锋利', detail: '形容词，与"坚"相对。' },
          { word: '于', type: '虚词', modernMeaning: '对于', detail: '介词，引出动作的对象。' },
        ],
      },
      {
        index: 4,
        original: '或曰："以子之矛，陷子之盾，何如？"',
        translation: '有人问："用你的矛刺你的盾，会怎么样呢？"',
        tokens: [
          { word: '或', type: '虚词', modernMeaning: '有人', detail: '无定代词，表示"有的人"。注意古今异义，今义为"或者"。' },
          { word: '以', type: '虚词', modernMeaning: '用、拿', detail: '介词，表示工具或手段。' },
          { word: '子', type: '实词', modernMeaning: '你（对对方的尊称）', detail: '古代对男子的美称或尊称。' },
          { word: '何如', type: '特殊句式', modernMeaning: '怎么样', detail: '固定结构，表示疑问，相当于"如何"。' },
        ],
      },
      {
        index: 5,
        original: '其人弗能应也。',
        translation: '那个人不能回答。',
        tokens: [
          { word: '弗', type: '虚词', modernMeaning: '不', detail: '否定副词。文言中"弗"相当于"不……之"。' },
          { word: '应', type: '实词', modernMeaning: '回答、应对', detail: '读 yìng。' },
        ],
      },
    ],
  },

  // text-015 田忌赛马
  'text-015': {
    textId: 'text-015',
    sentences: [
      {
        index: 1,
        original: '忌数与齐诸公子驰逐重射。',
        translation: '田忌多次与齐国各位公子赛马，下了很大的赌注。',
        tokens: [
          { word: '数', type: '虚词', modernMeaning: '多次、屡次', detail: '读 shuò，副词，表示频率。' },
          { word: '诸', type: '虚词', modernMeaning: '各位、众多', detail: '代词，表示复数。' },
          { word: '驰逐', type: '实词', modernMeaning: '赛马', detail: '"驰"即奔驰，"逐"即追逐。' },
          { word: '射', type: '实词', modernMeaning: '赌注', detail: '此处指比赛时的赌注。' },
        ],
      },
      {
        index: 2,
        original: '孙子见其马足不甚相远，马有上、中、下辈。',
        translation: '孙膑看到他的马匹脚力相差不太远，马分为上、中、下三个等级。',
        tokens: [
          { word: '足', type: '实词', modernMeaning: '脚力、马力', detail: '指马的奔跑能力。' },
          { word: '甚', type: '虚词', modernMeaning: '很、非常', detail: '程度副词。' },
          { word: '相远', type: '实词', modernMeaning: '相差很远', detail: '"相"表示互相，"远"表示差距大。' },
          { word: '辈', type: '实词', modernMeaning: '等级、类别', detail: '这里指马的等级分类。' },
        ],
      },
      {
        index: 3,
        original: '于是孙子谓田忌曰："君弟重射，臣能令君胜。"',
        translation: '于是孙膑对田忌说："您只管下大赌注，我能让您取胜。"',
        tokens: [
          { word: '谓……曰', type: '特殊句式', modernMeaning: '对……说', detail: '固定结构，表示说话的对象和内容。' },
          { word: '弟', type: '通假字', modernMeaning: '只管、尽管', detail: '通"第"，表示"只管、尽管"。', relatedChar: '第' },
          { word: '重射', type: '实词', modernMeaning: '下大赌注', detail: '"重"即大，"射"指赌注。' },
          { word: '令', type: '实词', modernMeaning: '使、让', detail: '动词，表示致使义。' },
        ],
      },
      {
        index: 4,
        original: '田忌信然之。',
        translation: '田忌相信并同意了他。',
        tokens: [
          { word: '信', type: '实词', modernMeaning: '相信', detail: '动词。' },
          { word: '然', type: '虚词', modernMeaning: '认为……对', detail: '意动用法，"以之为然"，即认为他说的对。' },
        ],
      },
    ],
  },

  // text-016 伯牙鼓琴
  'text-016': {
    textId: 'text-016',
    sentences: [
      {
        index: 1,
        original: '伯牙鼓琴，锺子期听之。',
        translation: '伯牙弹琴，锺子期听他弹奏。',
        tokens: [
          { word: '鼓', type: '实词', modernMeaning: '弹奏', detail: '文言中"鼓"作动词时常表示弹奏（乐器）。' },
        ],
      },
      {
        index: 2,
        original: '方鼓琴而志在太山。',
        translation: '（伯牙）正在弹琴，心中想到的是泰山。',
        tokens: [
          { word: '方', type: '虚词', modernMeaning: '正在', detail: '副词，表示动作正在进行。' },
          { word: '志', type: '实词', modernMeaning: '心意、思想', detail: '这里指弹琴时心中所想的内容。' },
          { word: '太山', type: '实词', modernMeaning: '泰山', detail: '"太"通"泰"，即泰山。', relatedChar: '泰' },
        ],
      },
      {
        index: 3,
        original: '锺子期曰："善哉乎鼓琴，巍巍乎若太山！"',
        translation: '锺子期说："弹得真好啊，高峻的样子像泰山一样！"',
        tokens: [
          { word: '善哉', type: '特殊句式', modernMeaning: '真好啊', detail: '"善"表示好，"哉"是语气词，表示感叹。"善哉乎"是倒装结构。' },
          { word: '巍巍', type: '实词', modernMeaning: '高大的样子', detail: '形容词叠用，形容山势高大。' },
          { word: '若', type: '虚词', modernMeaning: '像、如同', detail: '动词，表示比喻。' },
        ],
      },
      {
        index: 4,
        original: '少选之间，而志在流水。',
        translation: '过了一会儿，（伯牙）心中想到的是流水。',
        tokens: [
          { word: '少选', type: '实词', modernMeaning: '一会儿、不久', detail: '表示短时间。' },
        ],
      },
      {
        index: 5,
        original: '锺子期又曰："善哉乎鼓琴，汤汤乎若流水！"',
        translation: '锺子期又说："弹得真好啊，浩浩荡荡像流水一样！"',
        tokens: [
          { word: '汤汤', type: '实词', modernMeaning: '水势浩大的样子', detail: '读 shāng shāng，形容水流大而急。注意与"汤"（tāng）区分。' },
        ],
      },
      {
        index: 6,
        original: '锺子期死，伯牙破琴绝弦，终身不复鼓琴，以为世无足复为鼓琴者。',
        translation: '锺子期死后，伯牙摔破琴、弄断弦，终身不再弹琴，认为世上没有值得再为他弹琴的人了。',
        tokens: [
          { word: '破', type: '实词', modernMeaning: '摔破、毁坏', detail: '动词，表示毁坏。' },
          { word: '绝', type: '实词', modernMeaning: '弄断', detail: '动词，使……断。' },
          { word: '以为', type: '古今异义', modernMeaning: '认为', detail: '古义为"认为"，今义也是"认为"，但此处需注意"以"和"为"的分离结构。' },
          { word: '足', type: '虚词', modernMeaning: '值得', detail: '副词，表示"值得"。' },
        ],
      },
    ],
  },

  // text-017 书戴嵩画牛
  'text-017': {
    textId: 'text-017',
    sentences: [
      {
        index: 1,
        original: '蜀中有杜处士，好书画，所宝以百数。',
        translation: '四川有一个杜处士，喜欢书画，所珍藏的书画数以百计。',
        tokens: [
          { word: '处士', type: '实词', modernMeaning: '有才德而隐居不仕的人', detail: '指有学问但不愿做官的人。' },
          { word: '好', type: '实词', modernMeaning: '喜爱、喜欢', detail: '读 hào，动词。' },
          { word: '宝', type: '词类活用', modernMeaning: '珍藏', detail: '名词活用作动词，意思是"以……为宝"、珍藏。' },
          { word: '数', type: '虚词', modernMeaning: '计算', detail: '读 shǔ，动词。' },
        ],
      },
      {
        index: 2,
        original: '有戴嵩《牛》一轴，尤所爱，锦囊玉轴，常以自随。',
        translation: '有一幅戴嵩画的《牛》，尤其喜爱，用锦缎做画囊、用玉做画轴，常常随身携带。',
        tokens: [
          { word: '轴', type: '实词', modernMeaning: '画轴、卷轴', detail: '古代书画装裱成卷轴形式。' },
          { word: '尤', type: '虚词', modernMeaning: '尤其、更加', detail: '程度副词。' },
          { word: '锦囊玉轴', type: '实词', modernMeaning: '用锦缎做囊、用玉做轴', detail: '两个名词并列，形容对画极其珍爱。' },
        ],
      },
      {
        index: 3,
        original: '一日曝书画，有一牧童见之，拊掌大笑。',
        translation: '一天（他）晒书画，有一个牧童看到了，拍手大笑。',
        tokens: [
          { word: '曝', type: '实词', modernMeaning: '晒', detail: '读 pù，文言常用词。"曝"本义即晒。' },
          { word: '拊掌', type: '实词', modernMeaning: '拍手', detail: '"拊"读 fǔ，拍打的意思。' },
        ],
      },
      {
        index: 4,
        original: '曰："此画斗牛也。牛斗，力在角，尾搐入两股间。今乃掉尾而斗，谬矣！"',
        translation: '（牧童）说："这幅画画的是斗牛。牛相斗时，力量在角上，尾巴夹在两腿之间。现在却甩着尾巴相斗，画错了！"',
        tokens: [
          { word: '搐', type: '实词', modernMeaning: '抽缩、夹紧', detail: '读 chù，肌肉抽缩。"尾搐入"即尾巴紧紧夹入。' },
          { word: '股', type: '实词', modernMeaning: '大腿', detail: '文言中"股"指大���，注意古今异义。' },
          { word: '乃', type: '虚词', modernMeaning: '却、竟然', detail: '副词，表示转折，相当于"却""竟然"。' },
          { word: '掉', type: '古今异义', modernMeaning: '摇动、甩', detail: '古义为"摇动、摆动"，今义为"落下、遗失"。成语"尾大不掉"保留此古义。' },
          { word: '谬', type: '实词', modernMeaning: '错误', detail: '读 miù，差错。' },
        ],
      },
      {
        index: 5,
        original: '处士笑而然之。',
        translation: '杜处士笑了，认为他说得对。',
        tokens: [
          { word: '然之', type: '词类活用', modernMeaning: '认为他说得对', detail: '意动用法，"以之为然"，即认为他说得对。' },
        ],
      },
    ],
  },

  // text-018 学弈
  'text-018': {
    textId: 'text-018',
    sentences: [
      {
        index: 1,
        original: '弈秋，通国之善弈者也。',
        translation: '弈秋是全国最擅长下棋的人。',
        tokens: [
          { word: '弈', type: '实词', modernMeaning: '下棋', detail: '文言中"弈"专指围棋。' },
          { word: '通国', type: '实词', modernMeaning: '全国', detail: '"通"即全部、整个。' },
          { word: '善', type: '实词', modernMeaning: '擅长', detail: '动词，表示擅长于某事。' },
          { word: '者', type: '虚词', modernMeaning: '……的人', detail: '代词，组成"者"字结构。' },
        ],
      },
      {
        index: 2,
        original: '使弈秋诲二人弈。',
        translation: '让弈秋教两个人下棋。',
        tokens: [
          { word: '使', type: '虚词', modernMeaning: '让', detail: '动词，表示使令。' },
          { word: '诲', type: '实词', modernMeaning: '教导', detail: '读 huì，文言中常用的"教"的同义词。' },
        ],
      },
      {
        index: 3,
        original: '其一人专心致志，惟弈秋之为听。',
        translation: '其中一个人专心致志，只听弈秋的教导。',
        tokens: [
          { word: '其', type: '虚词', modernMeaning: '其中', detail: '代词，指"其中的"。' },
          { word: '专心致志', type: '实词', modernMeaning: '一心一意、集中精神', detail: '成语出处。"致"即"尽、极"，"志"即"心意"。' },
          { word: '惟……之为', type: '特殊句式', modernMeaning: '只……', detail: '宾语前置结构，"惟弈秋之为听"即"惟听弈秋"，强调只听弈秋的话。' },
        ],
      },
      {
        index: 4,
        original: '一人虽听之，一心以为有鸿鹄将至，思援弓缴而射之。',
        translation: '另一个人虽然听着，心里却以为有天鹅要飞来，想着拉弓射箭去射它。',
        tokens: [
          { word: '虽', type: '虚词', modernMeaning: '虽然', detail: '连词，表示让步。' },
          { word: '鸿鹄', type: '实词', modernMeaning: '天鹅', detail: '"鸿"是大雁，"鹄"（hú）是天鹅，这里泛指大鸟。' },
          { word: '援', type: '实词', modernMeaning: '拉、引', detail: '拉开（弓）。' },
          { word: '缴', type: '实词', modernMeaning: '系着丝绳的箭', detail: '读 zhuó，古代射鸟用的箭，箭尾系丝绳。' },
        ],
      },
      {
        index: 5,
        original: '虽与之俱学，弗若之矣。',
        translation: '虽然和他一起学习，却不如他。',
        tokens: [
          { word: '俱', type: '虚词', modernMeaning: '一起', detail: '副词，表示"一同"。' },
          { word: '弗', type: '虚词', modernMeaning: '不', detail: '否定副词，相当于"不……之"。' },
          { word: '若', type: '虚词', modernMeaning: '如、比得上', detail: '动词，表示比较。' },
        ],
      },
      {
        index: 6,
        original: '为是其智弗若与？曰：非然也。',
        translation: '是因为他的智力不如吗？回答说：不是这样的。',
        tokens: [
          { word: '为', type: '虚词', modernMeaning: '因为', detail: '读 wèi，介词。' },
          { word: '与', type: '虚词', modernMeaning: '吗', detail: '读 yú，语气词，通"欤"，表示疑问。', relatedChar: '欤' },
          { word: '非然', type: '实词', modernMeaning: '不是这样', detail: '"非"即"不是"，"然"即"这样"。' },
        ],
      },
    ],
  },

  // text-019 两小儿辩日
  'text-019': {
    textId: 'text-019',
    sentences: [
      {
        index: 1,
        original: '孔子东游，见两小儿辩斗，问其故。',
        translation: '孔子到东方游历，看见两个小孩在争论，就问他们争论的原因。',
        tokens: [
          { word: '游', type: '实词', modernMeaning: '游历', detail: '指外出求学或旅行。' },
          { word: '辩斗', type: '实词', modernMeaning: '争论、辩论', detail: '"辩"即辩论，"斗"即争斗，这里指激烈的争论。' },
          { word: '故', type: '实词', modernMeaning: '原因、缘故', detail: '名词。' },
        ],
      },
      {
        index: 2,
        original: '一儿曰："我以日始出时去人近，而日中时远也。"',
        translation: '一个小孩说："我认为太阳刚出来的时候离人近，而正午的时候离人远。"',
        tokens: [
          { word: '以', type: '虚词', modernMeaning: '认为', detail: '动词，表示主观判断。' },
          { word: '去', type: '古今异义', modernMeaning: '距离', detail: '古义为"距离"，今义为"前往"。' },
          { word: '日中', type: '实词', modernMeaning: '正午', detail: '太阳在天空正中的时候。' },
        ],
      },
      {
        index: 3,
        original: '一儿以日初出远，而日中时近也。',
        translation: '另一个小孩认为太阳刚出来的时候远，而正午的时候近。',
        tokens: [
          { word: '初', type: '虚词', modernMeaning: '刚', detail: '副词，表示时间。' },
        ],
      },
      {
        index: 4,
        original: '一儿曰："日初出大如车盖，及日中则如盘盂，此不为远者小而近者大乎？"',
        translation: '一个小孩说："太阳刚出来时大得像车盖，到了正午却小得像盘子，这不就是远的小而近的大吗？"',
        tokens: [
          { word: '车盖', type: '实词', modernMeaning: '古代车上的篷盖', detail: '形如伞，用来比喻太阳刚出来时看起来很大。' },
          { word: '及', type: '虚词', modernMeaning: '到了', detail: '介词，表示到达某个时间。' },
          { word: '盘盂', type: '实词', modernMeaning: '盘子和钵盂', detail: '比喻正午太阳看起来很小。' },
          { word: '为', type: '虚词', modernMeaning: '是', detail: '读 wéi，动词，表示判断。' },
        ],
      },
      {
        index: 5,
        original: '一儿曰："日初出沧沧凉凉，及其日中如探汤，此不为近者热而远者凉乎？"',
        translation: '另一个小孩说："太阳刚出来时清清凉凉，到了正午热得像把手伸进热水中，这不就是近的热而远的凉吗？"',
        tokens: [
          { word: '沧沧凉凉', type: '实词', modernMeaning: '清冷凉爽', detail: '形容清凉的感觉。' },
          { word: '探汤', type: '实词', modernMeaning: '把手伸进热水中', detail: '"探"即伸入，"汤"古义为热水。' },
          { word: '汤', type: '古今异义', modernMeaning: '热水', detail: '古义为"热水、开水"，今义为"菜汤"。成语"赴汤蹈火"中"汤"即保留古义。' },
        ],
      },
      {
        index: 6,
        original: '孔子不能决也。',
        translation: '孔子不能判断（谁对谁错）。',
        tokens: [
          { word: '决', type: '实词', modernMeaning: '判断、裁决', detail: '动词，做出决断。' },
        ],
      },
      {
        index: 7,
        original: '两小儿笑曰："孰为汝多知乎？"',
        translation: '两个小孩笑着说："谁说你知道得多呢？"',
        tokens: [
          { word: '孰', type: '虚词', modernMeaning: '谁', detail: '疑问代词。' },
          { word: '为', type: '虚词', modernMeaning: '认为、说', detail: '读 wéi，动词。' },
          { word: '汝', type: '实词', modernMeaning: '你', detail: '第二人称代词。' },
          { word: '知', type: '通假字', modernMeaning: '智慧、知识', detail: '通"智"，智慧。', relatedChar: '智' },
        ],
      },
    ],
  },

  // text-020 囊萤夜读
  'text-020': {
    textId: 'text-020',
    sentences: [
      {
        index: 1,
        original: '胤恭勤不倦，博学多通。',
        translation: '车胤恭敬勤勉不知疲倦，学问广博，通晓多种知识。',
        tokens: [
          { word: '恭勤', type: '实词', modernMeaning: '恭敬勤勉', detail: '"恭"即恭敬，"勤"即勤奋。' },
          { word: '倦', type: '实词', modernMeaning: '疲倦', detail: '厌倦、疲乏。' },
          { word: '通', type: '实词', modernMeaning: '通晓', detail: '融会贯通。' },
        ],
      },
      {
        index: 2,
        original: '家贫不常得油。',
        translation: '家里贫穷，不能经常得到灯油。',
        tokens: [
          { word: '贫', type: '实词', modernMeaning: '贫穷', detail: '家境困难。' },
        ],
      },
      {
        index: 3,
        original: '夏月则练囊盛数十萤火以照书，以夜继日焉。',
        translation: '夏天就用白绢做成袋子，装几十只萤火虫来照亮书本，夜以继日地读书。',
        tokens: [
          { word: '练囊', type: '实词', modernMeaning: '用白绢做的袋子', detail: '"练"是白绢，"囊"是袋子。' },
          { word: '盛', type: '实词', modernMeaning: '装', detail: '读 chéng，动词，把东西放入容器中。' },
          { word: '以', type: '虚词', modernMeaning: '用来', detail: '连词，表示目的。' },
          { word: '以夜继日', type: '实词', modernMeaning: '用夜晚接续白天', detail: '成语"夜以继日"的来源，形容勤奋刻苦。' },
        ],
      },
    ],
  },

  // text-021 铁杵成针
  'text-021': {
    textId: 'text-021',
    sentences: [
      {
        index: 1,
        original: '磨针溪，在眉州象耳山下。',
        translation: '磨针溪在眉州象耳山的山脚下。',
        tokens: [
          { word: '眉州', type: '实词', modernMeaning: '地名，在今四川眉山', detail: '苏轼的故乡。' },
        ],
      },
      {
        index: 2,
        original: '世传李太白读书山中，未成，弃去。',
        translation: '世人传说李白在山中读书，没有完成学业，就放弃了离开。',
        tokens: [
          { word: '世传', type: '实词', modernMeaning: '世人传说', detail: '民间流传的说法。' },
          { word: '弃', type: '实词', modernMeaning: '放弃', detail: '丢下、抛弃。' },
        ],
      },
      {
        index: 3,
        original: '过是溪，逢老媪方磨铁杵。',
        translation: '路过这条溪水，遇到一位老妇人正在磨铁棒。',
        tokens: [
          { word: '是', type: '虚词', modernMeaning: '这', detail: '指示代词，相当于"此"。注意古今异义。' },
          { word: '老媪', type: '实词', modernMeaning: '老妇人', detail: '读 ǎo，老年妇女。' },
          { word: '方', type: '虚词', modernMeaning: '正在', detail: '副词，表示动作正在进行。' },
          { word: '铁杵', type: '实词', modernMeaning: '铁棒', detail: '"杵"读 chǔ，捣东西用的棒槌。' },
        ],
      },
      {
        index: 4,
        original: '问之，曰："欲作针。"',
        translation: '（李白）问她，老妇人说："想要磨成针。"',
        tokens: [
          { word: '欲', type: '虚词', modernMeaning: '想要', detail: '能愿动词，表示意愿。' },
        ],
      },
      {
        index: 5,
        original: '太白感其意，还卒业。',
        translation: '李白被她的意志感动，回去完成了学业。',
        tokens: [
          { word: '感', type: '实词', modernMeaning: '被感动', detail: '表示被动，"被……感动"。' },
          { word: '还', type: '实词', modernMeaning: '返回', detail: '读 huán，回到原处。' },
          { word: '卒业', type: '实词', modernMeaning: '完成学业', detail: '"卒"即"完成、结束"。' },
        ],
      },
    ],
  },

  // text-022 古人谈读书（一）——《论语》
  'text-022': {
    textId: 'text-022',
    sentences: [
      {
        index: 1,
        original: '知之为知之，不知为不知，是知也。',
        translation: '知道就是知道，不知道就是不知道，这就是智慧。',
        tokens: [
          { word: '是', type: '虚词', modernMeaning: '这', detail: '指示代词，指代前面的内容。' },
          { word: '知', type: '通假字', modernMeaning: '智慧', detail: '最后一个"知"通"智"，智慧。', relatedChar: '智' },
        ],
      },
      {
        index: 2,
        original: '敏而好学，不耻下问。',
        translation: '聪敏而又好学，不以向地位低的人请教为耻。',
        tokens: [
          { word: '敏', type: '实词', modernMeaning: '聪敏、机敏', detail: '聪明灵活。' },
          { word: '好', type: '实词', modernMeaning: '喜爱', detail: '读 hào，动词。' },
          { word: '耻', type: '词类活用', modernMeaning: '以……为耻', detail: '意动用法，"以……为耻"。' },
        ],
      },
      {
        index: 3,
        original: '默而识之，学而不厌，诲人不倦。',
        translation: '默默地记住，学习不满足，教导别人不疲倦。',
        tokens: [
          { word: '识', type: '实词', modernMeaning: '记住', detail: '读 zhì，记住、记忆。' },
          { word: '厌', type: '古今异义', modernMeaning: '满足', detail: '古义为"满足"，今义为"讨厌、厌恶"。' },
          { word: '诲', type: '实词', modernMeaning: '教导', detail: '教诲、指导。' },
        ],
      },
      {
        index: 4,
        original: '吾尝终日不食，终夜不寝，以思，无益，不如学也。',
        translation: '我曾经整天不吃、整夜不睡地思考，没有益处，不如学习。',
        tokens: [
          { word: '尝', type: '虚词', modernMeaning: '曾经', detail: '副词，表示过去经历。' },
          { word: '寝', type: '实词', modernMeaning: '睡觉', detail: '文言中"寝"即睡觉。' },
          { word: '以', type: '虚词', modernMeaning: '用来', detail: '连词，表示目的。' },
        ],
      },
    ],
  },

  // text-023 古人谈读书（二）——朱熹
  'text-023': {
    textId: 'text-023',
    sentences: [
      {
        index: 1,
        original: '余尝谓：读书有三到，谓心到、眼到、口到。',
        translation: '我曾经说：读书有三到，就是心到、眼到、口到。',
        tokens: [
          { word: '余', type: '实词', modernMeaning: '我', detail: '第一人称代词。' },
          { word: '尝', type: '虚词', modernMeaning: '曾经', detail: '副词。' },
          { word: '谓', type: '实词', modernMeaning: '说', detail: '动词，表示说话。' },
        ],
      },
      {
        index: 2,
        original: '心不在此，则眼不看仔细，心眼既不专一，却只漫浪诵读，决不能记，记亦不能久也。',
        translation: '心不在这里，眼睛就不会仔细看，心和眼既然不专一，却只是随便诵读，一定记不住，记住了也不能长久。',
        tokens: [
          { word: '既', type: '虚词', modernMeaning: '既然', detail: '连词。' },
          { word: '漫浪', type: '实词', modernMeaning: '随便、马虎', detail: '漫不经心的样子。' },
          { word: '决', type: '虚词', modernMeaning: '一定', detail: '副词。' },
        ],
      },
      {
        index: 3,
        original: '三到之中，心到最急。',
        translation: '三到之中，心到最为紧要。',
        tokens: [
          { word: '急', type: '古今异义', modernMeaning: '紧要、重要', detail: '古义为"紧要、迫切"，今义为"着急"。' },
        ],
      },
      {
        index: 4,
        original: '心既到矣，眼口岂不到乎？',
        translation: '心既然到了，眼睛和嘴难道会不到吗？',
        tokens: [
          { word: '岂', type: '虚词', modernMeaning: '难道', detail: '反问副词，表示反诘。' },
          { word: '乎', type: '虚词', modernMeaning: '吗', detail: '语气词，表示反问。' },
        ],
      },
    ],
  },

  // text-024 古人谈读书（三）——曾国藩
  'text-024': {
    textId: 'text-024',
    sentences: [
      {
        index: 1,
        original: '盖士人读书，第一要有志，第二要有识，第三要有恒。',
        translation: '读书人读书，第一要有志向，第二要有见识，第三要有恒心。',
        tokens: [
          { word: '盖', type: '虚词', modernMeaning: '发语词，无实义', detail: '句首发语词，表示议论开始，无实际意义。' },
          { word: '士人', type: '实词', modernMeaning: '读书人', detail: '古代知识分子的称谓。' },
          { word: '识', type: '实词', modernMeaning: '见识', detail: '知识和见地。' },
          { word: '恒', type: '实词', modernMeaning: '恒心、毅力', detail: '持久不变的意志。' },
        ],
      },
      {
        index: 2,
        original: '有志则断不甘为下流。',
        translation: '有志向就绝不会甘心居于下流。',
        tokens: [
          { word: '断', type: '虚词', modernMeaning: '绝对、一定', detail: '副词，表示肯定语气。' },
          { word: '甘', type: '实词', modernMeaning: '甘心', detail: '心甘情愿。' },
        ],
      },
      {
        index: 3,
        original: '有识则知学问无尽，不敢以一得自足。',
        translation: '有见识就知道学问没有尽头，不敢因为有一点收获就自我满足。',
        tokens: [
          { word: '以', type: '虚词', modernMeaning: '因为', detail: '介词。' },
          { word: '自足', type: '实词', modernMeaning: '自我满足', detail: '自以为满足。' },
        ],
      },
      {
        index: 4,
        original: '有恒则断无不成之事。',
        translation: '有恒心就绝对没有做不成的事。',
        tokens: [
          { word: '断', type: '虚词', modernMeaning: '绝对', detail: '副词。' },
        ],
      },
      {
        index: 5,
        original: '此三者缺一不可。',
        translation: '这三者缺一不可。',
        tokens: [
          { word: '缺', type: '实词', modernMeaning: '缺少', detail: '缺失、不足。' },
        ],
      },
    ],
  },
};

// ---- 初中段 ----
export const wenyanGrammarJunior: Record<string, WenyanAnnotation> = {
  // text-007 岳阳楼记
  'text-007': {
    textId: 'text-007',
    sentences: [
      {
        index: 1,
        original: '庆历四年春，滕子京谪守巴陵郡。',
        translation: '庆历四年的春天，滕子京被贬官到巴陵郡做太守。',
        tokens: [
          { word: '谪', type: '实词', modernMeaning: '贬官降职', detail: '古代官员因罪被降职或流放。' },
        ],
      },
      {
        index: 2,
        original: '越明年，政通人和，百废具兴。',
        translation: '到了第二年，政事顺利，百姓和乐，各种荒废的事业都兴办起来了。',
        tokens: [
          { word: '越', type: '虚词', modernMeaning: '到了', detail: '介词，表示到达某时间。' },
          { word: '具', type: '通假字', modernMeaning: '都、全', detail: '通"俱"，全都。', relatedChar: '俱' },
        ],
      },
      {
        index: 3,
        original: '乃重修岳阳楼，增其旧制，刻唐贤今人诗赋于其上。',
        translation: '于是重新修建岳阳楼，扩大它原有的规模，在上面刻上唐代名家和当代人的诗赋。',
        tokens: [
          { word: '乃', type: '虚词', modernMeaning: '于是', detail: '连词，表示承接。' },
          { word: '制', type: '实词', modernMeaning: '规模', detail: '指建筑的规模、样式。' },
          { word: '于', type: '虚词', modernMeaning: '在', detail: '介词，引出地点。' },
        ],
      },
      {
        index: 4,
        original: '属予作文以记之。',
        translation: '嘱咐我写一篇文章来记述这件事。',
        tokens: [
          { word: '属', type: '通假字', modernMeaning: '嘱咐', detail: '通"嘱"，嘱咐、嘱托。', relatedChar: '嘱' },
          { word: '以', type: '虚词', modernMeaning: '来、用来', detail: '连词，表示目的。' },
        ],
      },
      {
        index: 5,
        original: '予观夫巴陵胜状，在洞庭一湖。',
        translation: '我看那巴陵郡的美好景色，全在洞庭湖上。',
        tokens: [
          { word: '夫', type: '虚词', modernMeaning: '那', detail: '读 fú，指示代词。' },
          { word: '胜状', type: '实词', modernMeaning: '美景、胜景', detail: '美好的景象。' },
        ],
      },
      {
        index: 6,
        original: '衔远山，吞长江，浩浩汤汤，横无际涯。',
        translation: '它含着远处的山，吞没长江的水，水势浩大，无边无际。',
        tokens: [
          { word: '衔', type: '实词', modernMeaning: '含着', detail: '用拟人手法写洞庭湖连接远山。' },
          { word: '汤汤', type: '实词', modernMeaning: '水势浩大的样子', detail: '读 shāng shāng。' },
        ],
      },
      {
        index: 7,
        original: '此则岳阳楼之大观也。',
        translation: '这就是岳阳楼的雄伟景象。',
        tokens: [
          { word: '则', type: '虚词', modernMeaning: '就是', detail: '副词，加强判断语气。' },
          { word: '大观', type: '实词', modernMeaning: '雄伟景象', detail: '壮观、宏伟的景象。' },
        ],
      },
      {
        index: 8,
        original: '然则北通巫峡，南极潇湘。',
        translation: '既然这样，那么（洞庭湖）北面通向巫峡，南面直到潇水和湘水。',
        tokens: [
          { word: '然则', type: '虚词', modernMeaning: '既然这样，那么', detail: '"然"指代前文，"则"引出推论。' },
          { word: '极', type: '实词', modernMeaning: '到达尽头、直到', detail: '动词，到达最远处。' },
        ],
      },
      {
        index: 9,
        original: '迁客骚人，多会于此，览物之情，得无异乎？',
        translation: '被贬谪的官员和文人，大多在这里聚会，他们观赏景物的心情，能没有不同吗？',
        tokens: [
          { word: '迁客', type: '实词', modernMeaning: '被贬谪的官员', detail: '"迁"指贬谪，"客"指外来的官员。' },
          { word: '骚人', type: '实词', modernMeaning: '文人', detail: '战国时屈原作《离骚》，后称诗人为"骚人"。' },
          { word: '于', type: '虚词', modernMeaning: '在', detail: '介词。' },
          { word: '得无', type: '虚词', modernMeaning: '能没有……吗', detail: '固定结构，表示反问推测，相当于"恐怕……吧"。' },
        ],
      },
      {
        index: 10,
        original: '若夫霪雨霏霏，连月不开。',
        translation: '像那阴雨连绵，几个月都不放晴。',
        tokens: [
          { word: '若夫', type: '虚词', modernMeaning: '像那', detail: '句首语气词，引出下文。' },
          { word: '开', type: '实词', modernMeaning: '放晴', detail: '天气转晴。' },
        ],
      },
      {
        index: 11,
        original: '登斯楼也，则有去国怀乡，忧谗畏讥，满目萧然，感极而悲者矣。',
        translation: '登上这座楼，就会产生离开国都、怀念家乡，担心被谗言中伤、害怕被讥讽，满眼萧条冷落，感慨到了极点而悲伤的情绪。',
        tokens: [
          { word: '斯', type: '虚词', modernMeaning: '这', detail: '指示代词。' },
          { word: '去', type: '古今异义', modernMeaning: '离开', detail: '古义为"离开"，今义为"前往"。' },
          { word: '国', type: '古今异义', modernMeaning: '国都', detail: '古义为"国都、都城"，今义为"国家"。' },
        ],
      },
      {
        index: 12,
        original: '至若春和景明，波澜不惊。',
        translation: '至于春风和暖、阳光明媚，湖面波平浪静。',
        tokens: [
          { word: '至若', type: '虚词', modernMeaning: '至于', detail: '连词，表示转换话题。' },
          { word: '景', type: '实词', modernMeaning: '日光', detail: '"景"在此指日光。' },
        ],
      },
      {
        index: 13,
        original: '而或长烟一空，皓月千里，浮光跃金，静影沉璧。',
        translation: '有时大片的烟雾完全消散，皎洁的月光照耀千里，浮动的月光闪耀着金色，静静的月影像沉入水中的玉璧。',
        tokens: [
          { word: '或', type: '虚词', modernMeaning: '有时', detail: '副词。' },
          { word: '一', type: '虚词', modernMeaning: '全、都', detail: '副词。' },
          { word: '跃金', type: '实词', modernMeaning: '闪耀着金色', detail: '比喻月光在水面闪烁如金。' },
          { word: '沉璧', type: '实词', modernMeaning: '沉入水中的玉璧', detail: '比喻水中月影如美玉沉入水底。' },
        ],
      },
      {
        index: 14,
        original: '登斯楼也，则有心旷神怡，宠辱偕忘，把酒临风，其喜洋洋者矣。',
        translation: '登上这座楼，就会心胸开阔、精神愉悦，荣耀和屈辱都忘了，端着酒杯迎着风，那种喜悦之情洋溢。',
        tokens: [
          { word: '偕', type: '虚词', modernMeaning: '一起', detail: '副词，一齐。' },
          { word: '把', type: '实词', modernMeaning: '端着、拿着', detail: '动词，手持。' },
        ],
      },
      {
        index: 15,
        original: '嗟夫！予尝求古仁人之心，或异二者之为。',
        translation: '唉！我曾经探求古代品德高尚之人的心思，或许不同于以上两种表现。',
        tokens: [
          { word: '嗟夫', type: '虚词', modernMeaning: '唉', detail: '感叹词。' },
          { word: '求', type: '实词', modernMeaning: '探求', detail: '探究、寻求。' },
          { word: '或', type: '虚词', modernMeaning: '或许', detail: '副词。' },
        ],
      },
      {
        index: 16,
        original: '不以物喜，不以己悲。',
        translation: '不因为外物的好坏和自己的得失而或喜或悲。',
        tokens: [
          { word: '以', type: '虚词', modernMeaning: '因为', detail: '介词，引出原因。此句为互文修辞。' },
        ],
      },
      {
        index: 17,
        original: '居庙堂之高则忧其民，处江湖之远则忧其君。',
        translation: '在朝廷做官就为百姓担忧，在偏远地方做官就为君主担忧。',
        tokens: [
          { word: '庙堂', type: '实词', modernMeaning: '朝廷', detail: '指朝廷、中央政府。' },
          { word: '江湖', type: '实词', modernMeaning: '偏远的地方', detail: '与"庙堂"相对，指远离朝廷的地方。' },
        ],
      },
      {
        index: 18,
        original: '是进亦忧，退亦忧。',
        translation: '这样看来，入朝做官也担忧，退居江湖也担忧。',
        tokens: [
          { word: '是', type: '虚词', modernMeaning: '这样', detail: '指示代词。' },
          { word: '亦', type: '虚词', modernMeaning: '也', detail: '副词。' },
        ],
      },
      {
        index: 19,
        original: '然则何时而乐耶？其必曰"先天下之忧而忧，后天下之乐而乐"乎！',
        translation: '既然这样，那么什么时候才快乐呢？大概一定会说"在天下人忧虑之前先忧虑，在天下人快乐之后才快乐"吧！',
        tokens: [
          { word: '其', type: '虚词', modernMeaning: '大概', detail: '副词，表示推测语气。' },
          { word: '先', type: '词类活用', modernMeaning: '在……之前', detail: '名词活用作状语，"先于……"。' },
          { word: '后', type: '词类活用', modernMeaning: '在……之后', detail: '名词活用作状语，"后于……"。' },
        ],
      },
      {
        index: 20,
        original: '噫！微斯人，吾谁与归？',
        translation: '唉！如果没有这种人，我同谁一道呢？',
        tokens: [
          { word: '微', type: '虚词', modernMeaning: '如果没有', detail: '假设连词，表示否定性假设。' },
          { word: '谁与归', type: '特殊句式', modernMeaning: '与谁归', detail: '宾语前置，"谁与归"即"与谁归"，意为"和谁一起"。' },
        ],
      },
    ],
  },

  // text-008 出师表
  'text-008': {
    textId: 'text-008',
    sentences: [
      {
        index: 1,
        original: '先帝创业未半而中道崩殂。',
        translation: '先帝开创大业还没有完成一半，就中途去世了。',
        tokens: [
          { word: '崩殂', type: '实词', modernMeaning: '帝王去世', detail: '天子死称"崩"或"殂"，是避讳的说法。' },
        ],
      },
      {
        index: 2,
        original: '今天下三分，益州疲弊，此诚危急存亡之秋也。',
        translation: '现在天下分为三国，益州人力物力疲惫困乏，这确实是危急存亡的时候。',
        tokens: [
          { word: '秋', type: '古今异义', modernMeaning: '时候、时刻', detail: '古义为"时候"，今义为"秋季"。注意"秋"在文言中常指关键时刻。' },
          { word: '诚', type: '虚词', modernMeaning: '确实、实在', detail: '副词，表示肯定语气。' },
        ],
      },
      {
        index: 3,
        original: '然侍卫之臣不懈于内，忠志之士忘身于外者，盖追先帝之殊遇，欲报之于陛下也。',
        translation: '然而侍卫的臣子在朝廷内毫不懈怠，忠诚的将士在疆场上舍生忘死，原来是追念先帝的特殊恩遇，想要在陛下身上报答。',
        tokens: [
          { word: '盖', type: '虚词', modernMeaning: '原来是', detail: '连词，表示解释原因。' },
          { word: '殊遇', type: '实词', modernMeaning: '特殊的恩遇', detail: '特别的厚待。' },
          { word: '于', type: '虚词', modernMeaning: '在/给', detail: '介词，前一个"于"引出地点（在内），后一个"于"引出对象（给陛下）。' },
        ],
      },
      {
        index: 4,
        original: '诚宜开张圣听，以光先帝遗德，恢弘志士之气。',
        translation: '确实应该广泛地听取意见，来发扬光大先帝遗留下来的美德，振奋有志之士的志气。',
        tokens: [
          { word: '开张', type: '古今异义', modernMeaning: '扩大、广泛', detail: '古义为"扩大"，今义为"商店开始营业"。' },
          { word: '以', type: '虚词', modernMeaning: '来', detail: '连词，表示目的。' },
          { word: '光', type: '词类活用', modernMeaning: '发扬光大', detail: '形容词活用作动词。' },
          { word: '恢弘', type: '词类活用', modernMeaning: '发扬、振奋', detail: '形容词活用作动词。' },
        ],
      },
      {
        index: 5,
        original: '不宜妄自菲薄，引喻失义，以塞忠谏之路也。',
        translation: '不应该随便看轻自己，说一些不恰当的话，以致堵塞了忠臣进谏的道路。',
        tokens: [
          { word: '妄自菲薄', type: '实词', modernMeaning: '过分看轻自己', detail: '成语。"菲薄"即轻视。' },
          { word: '以', type: '虚词', modernMeaning: '以致', detail: '连词，表示结果。' },
        ],
      },
      {
        index: 6,
        original: '宫中府中，俱为一体，陟罚臧否，不宜异同。',
        translation: '皇宫中和朝廷中，都是一个整体，奖惩功过，不应该有所不同。',
        tokens: [
          { word: '陟', type: '实词', modernMeaning: '提拔、晋升', detail: '读 zhì，提升官职。' },
          { word: '臧否', type: '实词', modernMeaning: '善恶、好坏', detail: '"臧"即善，"否"（pǐ）即恶。' },
        ],
      },
      {
        index: 7,
        original: '亲贤臣，远小人，此先汉所以兴隆也。',
        translation: '亲近贤臣，疏远小人，这是西汉兴隆的原因。',
        tokens: [
          { word: '远', type: '词类活用', modernMeaning: '疏远', detail: '形容词活用作动词。' },
          { word: '所以', type: '古今异义', modernMeaning: '……的原因', detail: '古义为"……的原因"，今义为表结果的连词。"所以兴隆"即"兴隆的原因"。' },
        ],
      },
      {
        index: 8,
        original: '亲小人，远贤臣，此后汉所以倾颓也。',
        translation: '亲近小人，疏远贤臣，这是东汉衰败的原因。',
        tokens: [
          { word: '倾颓', type: '实词', modernMeaning: '衰败、覆灭', detail: '"倾"即倒塌，"颓"即衰败。' },
        ],
      },
      {
        index: 9,
        original: '臣本布衣，躬耕于南阳，苟全性命于乱世，不求闻达于诸侯。',
        translation: '我本来是一个平民，在南阳亲自耕田种地，在乱世中苟且保全性命，不奢求在诸侯中出名显达。',
        tokens: [
          { word: '布衣', type: '实词', modernMeaning: '平民', detail: '古代平民穿布衣，代指平民百姓。' },
          { word: '躬', type: '实词', modernMeaning: '亲自', detail: '副词，亲自。' },
          { word: '闻达', type: '实词', modernMeaning: '出名显达', detail: '扬名、显贵。' },
        ],
      },
      {
        index: 10,
        original: '先帝不以臣卑鄙，猥自枉屈，三顾臣于草庐之中。',
        translation: '先帝不认为我身份低微、见识浅陋，降低身份委屈自己，三次到草庐中拜访我。',
        tokens: [
          { word: '卑鄙', type: '古今异义', modernMeaning: '身份低微、见识浅陋', detail: '古义："卑"指地位低，"鄙"指见识浅。今义：品质恶劣。需特别注意区分。' },
          { word: '猥', type: '虚词', modernMeaning: '降低身份', detail: '谦词，表示委屈对方。' },
          { word: '顾', type: '实词', modernMeaning: '拜访', detail: '探望、拜访。"三顾茅庐"成语即出于此。' },
        ],
      },
      {
        index: 11,
        original: '咨臣以当世之事，由是感激，遂许先帝以驱驰。',
        translation: '拿当世大事来咨询我，我因此感动奋发，于是答应为先帝奔走效劳。',
        tokens: [
          { word: '咨', type: '实词', modernMeaning: '咨询、询问', detail: '征求意见。' },
          { word: '感激', type: '古今异义', modernMeaning: '感动奋发', detail: '古义为"感动奋发"，今义为"感谢"。古义程度更重。' },
          { word: '驱驰', type: '实词', modernMeaning: '奔走效劳', detail: '比喻为人奔走效力。' },
        ],
      },
      {
        index: 12,
        original: '后值倾覆，受任于败军之际，奉命于危难之间。',
        translation: '后来遇到兵败，在战败的时候接受任务，在危难之中奉命出使。',
        tokens: [
          { word: '值', type: '实词', modernMeaning: '遇到、碰上', detail: '动词。' },
          { word: '倾覆', type: '实词', modernMeaning: '兵败', detail: '指军事失败。' },
        ],
      },
      {
        index: 13,
        original: '此臣所以报先帝而忠陛下之职分也。',
        translation: '这就是我用来报答先帝、忠于陛下的职责和本分。',
        tokens: [
          { word: '所以', type: '古今异义', modernMeaning: '用来……的', detail: '"所以"在此表示"用来……的"，是文言特殊用法。' },
        ],
      },
    ],
  },

  // text-009 桃花源记
  'text-009': {
    textId: 'text-009',
    sentences: [
      {
        index: 1,
        original: '晋太元中，武陵人捕鱼为业。',
        translation: '东晋太元年间，有个武陵人以捕鱼为职业。',
        tokens: [
          { word: '为业', type: '实词', modernMeaning: '作为职业', detail: '"为"即"作为"。' },
        ],
      },
      {
        index: 2,
        original: '缘溪行，忘路之远近。',
        translation: '（他）沿着溪水划船前行，忘记了路程的远近。',
        tokens: [
          { word: '缘', type: '实词', modernMeaning: '沿着、顺着', detail: '介词。注意"缘"在此是"沿着"的意思。' },
        ],
      },
      {
        index: 3,
        original: '忽逢桃花林，夹岸数百步，中无杂树，芳草鲜美，落英缤纷。',
        translation: '忽然遇到一片桃花林，两岸数百步内没有别的树，芳香的青草鲜嫩美丽，落花繁多。',
        tokens: [
          { word: '落英', type: '实词', modernMeaning: '落花', detail: '"英"即"花"。' },
          { word: '缤纷', type: '实词', modernMeaning: '繁多的样子', detail: '形容词。' },
        ],
      },
      {
        index: 4,
        original: '渔人甚异之，复前行，欲穷其林。',
        translation: '渔人对此感到非常惊奇，又往前走，想要走到林子的尽头。',
        tokens: [
          { word: '异', type: '词类活用', modernMeaning: '感到惊奇', detail: '形容词的意动用法，"以之为异"。' },
          { word: '穷', type: '词类活用', modernMeaning: '走到尽头', detail: '形容词活用作动词，走到……的尽头。' },
        ],
      },
      {
        index: 5,
        original: '林尽水源，便得一山，山有小口，仿佛若有光。',
        translation: '桃林在溪水的源头就到头了，就看见一座山，山有个小洞口，隐隐约约好像有光。',
        tokens: [
          { word: '仿佛', type: '古今异义', modernMeaning: '隐隐约约、看不真切', detail: '古义为"隐隐约约"，今义为"好像"。' },
        ],
      },
      {
        index: 6,
        original: '便舍船，从口入。',
        translation: '（渔人）就离开船，从洞口进去。',
        tokens: [
          { word: '舍', type: '实词', modernMeaning: '舍弃、丢下', detail: '读 shě，动词。' },
        ],
      },
      {
        index: 7,
        original: '初极狭，才通人。',
        translation: '起初非常狭窄，仅能容一个人通过。',
        tokens: [
          { word: '才', type: '虚词', modernMeaning: '仅仅', detail: '副词，表示程度轻。' },
        ],
      },
      {
        index: 8,
        original: '复行数十步，豁然开朗。',
        translation: '又走了几十步，一下子开阔明亮起来。',
        tokens: [
          { word: '豁然开朗', type: '实词', modernMeaning: '一下子开阔明亮', detail: '成语出处，形容从狭窄幽暗一下子变为开阔明亮。' },
        ],
      },
      {
        index: 9,
        original: '土地平旷，屋舍俨然，有良田、美池、桑竹之属。',
        translation: '土地平坦宽广，房屋整齐，有肥沃的田地、美丽的池塘、桑树竹子之类。',
        tokens: [
          { word: '俨然', type: '实词', modernMeaning: '整齐的样子', detail: '形容词。' },
          { word: '属', type: '实词', modernMeaning: '类', detail: '名词，表示类别。' },
        ],
      },
      {
        index: 10,
        original: '阡陌交通，鸡犬相闻。',
        translation: '田间小路交错相通，鸡鸣狗叫的声音互相都能听到。',
        tokens: [
          { word: '阡陌', type: '实词', modernMeaning: '田间小路', detail: '南北为"阡"，东西为"陌"。' },
          { word: '交通', type: '古今异义', modernMeaning: '交错相通', detail: '古义为"交错相通"，今义为"运输事业"。' },
        ],
      },
      {
        index: 11,
        original: '黄发垂髫，并怡然自乐。',
        translation: '老人和小孩，都安适愉快、自得其乐。',
        tokens: [
          { word: '黄发', type: '实词', modernMeaning: '老人', detail: '老人头发由白变黄，借指老人。' },
          { word: '垂髫', type: '实词', modernMeaning: '小孩', detail: '小孩垂下的头发，借指儿童。' },
        ],
      },
      {
        index: 12,
        original: '见渔人，乃大惊，问所从来。具答之。',
        translation: '（桃花源中的人）看到渔人，于是非常惊讶，问他从哪里来。（渔人）详细地回答了他们。',
        tokens: [
          { word: '乃', type: '虚词', modernMeaning: '于是', detail: '连词。' },
          { word: '具', type: '虚词', modernMeaning: '详细地', detail: '副词，通"俱"。' },
        ],
      },
      {
        index: 13,
        original: '便要还家，设酒杀鸡作食。',
        translation: '（有人）就邀请（渔人）到家里去，摆酒杀鸡做饭。',
        tokens: [
          { word: '要', type: '通假字', modernMeaning: '邀请', detail: '通"邀"，读 yāo。', relatedChar: '邀' },
        ],
      },
      {
        index: 14,
        original: '自云先世避秦时乱，率妻子邑人来此绝境，不复出焉。',
        translation: '自己说祖先为了躲避秦时的战乱，带领妻子儿女和乡邻来到这个与世隔绝的地方，不再出去。',
        tokens: [
          { word: '妻子', type: '古今异义', modernMeaning: '妻子和儿女', detail: '古义为"妻子和儿女"，今义仅指"妻子"。' },
          { word: '绝境', type: '古今异义', modernMeaning: '与世隔绝的地方', detail: '古义为"与世隔绝的地方"，今义为"没有出路的境地"。' },
        ],
      },
      {
        index: 15,
        original: '问今是何世，乃不知有汉，无论魏晋。',
        translation: '问现在是什么朝代，竟然不知道有汉朝，更不用说魏晋了。',
        tokens: [
          { word: '乃', type: '虚词', modernMeaning: '竟然', detail: '副词，表示出乎意料。' },
          { word: '无论', type: '古今异义', modernMeaning: '更不用说', detail: '古义为"更不用说"，今义为"不管"。' },
        ],
      },
      {
        index: 16,
        original: '此人一一为具言所闻，皆叹惋。',
        translation: '渔人一件一件地给他们详细说了自己所听到的事，都感叹惋惜。',
        tokens: [
          { word: '具言', type: '实词', modernMeaning: '详细地说', detail: '"具"即"详细"。' },
          { word: '叹惋', type: '实词', modernMeaning: '感叹惋惜', detail: '"惋"即"惋惜"。' },
        ],
      },
      {
        index: 17,
        original: '此中人语云："不足为外人道也。"',
        translation: '桃花源中的人告诉（渔人）说："不值得对外面的人说。"',
        tokens: [
          { word: '语', type: '实词', modernMeaning: '告诉', detail: '读 yù，动词。' },
          { word: '不足', type: '虚词', modernMeaning: '不值得', detail: '副词。' },
        ],
      },
      {
        index: 18,
        original: '既出，得其船，便扶向路，处处志之。',
        translation: '出来以后，找到他的船，就沿着先前的路，处处做上标记。',
        tokens: [
          { word: '扶', type: '实词', modernMeaning: '沿着、顺着', detail: '动词。' },
          { word: '向', type: '虚词', modernMeaning: '先前的', detail: '副词，从前。' },
          { word: '志', type: '实词', modernMeaning: '做标记', detail: '动词，名词活用作动词。' },
        ],
      },
      {
        index: 19,
        original: '及郡下，诣太守，说如此。',
        translation: '到了郡城，拜见太守，说了这些情况。',
        tokens: [
          { word: '诣', type: '实词', modernMeaning: '拜见、到……去', detail: '特指到尊长那里去。' },
        ],
      },
      {
        index: 20,
        original: '太守即遣人随其往，寻向所志，遂迷，不复得路。',
        translation: '太守立即派人跟着他去，寻找之前做的标记，最终迷失了方向，再也找不到路了。',
        tokens: [
          { word: '寻', type: '实词', modernMeaning: '寻找', detail: '动词。' },
          { word: '志', type: '实词', modernMeaning: '标记', detail: '名词，前面"志之"的"志"的名词化结果。' },
          { word: '遂', type: '虚词', modernMeaning: '最终、竟然', detail: '副词，表示最终的结果。' },
        ],
      },
      {
        index: 21,
        original: '南阳刘子骥，高尚士也，闻之，欣然规往。未果，寻病终。',
        translation: '南阳的刘子骥，是一个品德高尚的人，听说了这件事，高兴地计划前往。还没有实现，不久就病死了。',
        tokens: [
          { word: '规', type: '实词', modernMeaning: '计划', detail: '动词。' },
          { word: '寻', type: '虚词', modernMeaning: '不久', detail: '副词，表示时间短。此处的"寻"与前面"寻向所志"的"寻"不同。' },
        ],
      },
      {
        index: 22,
        original: '后遂无问津者。',
        translation: '后来就再也没有探求（桃花源）的人了。',
        tokens: [
          { word: '问津', type: '实词', modernMeaning: '探求、寻访', detail: '"津"是渡口，"问津"本义是问渡口在哪里，引申为探求。"无人问津"成语来源。' },
        ],
      },
    ],
  },
};

// ---- 高中段 ----
export const wenyanGrammarSenior: Record<string, WenyanAnnotation> = {
  // text-010 赤壁赋
  'text-010': {
    textId: 'text-010',
    sentences: [
      {
        index: 1,
        original: '壬戌之秋，七月既望，苏子与客泛舟游于赤壁之下。',
        translation: '壬戌年的秋天，七月十六日，苏子和客人划着小船在赤壁下面游览。',
        tokens: [
          { word: '既望', type: '实词', modernMeaning: '农历每月十六日', detail: '农历每月十五为"望"，"既望"即过了十五，指十六日。' },
          { word: '于', type: '虚词', modernMeaning: '在', detail: '介词，引出地点。' },
        ],
      },
      {
        index: 2,
        original: '清风徐来，水波不兴。',
        translation: '清风缓缓吹来，水面波澜不起。',
        tokens: [
          { word: '徐', type: '虚词', modernMeaning: '缓缓地', detail: '副词。' },
          { word: '兴', type: '实词', modernMeaning: '起', detail: '动词。' },
        ],
      },
      {
        index: 3,
        original: '举酒属客，诵明月之诗，歌窈窕之章。',
        translation: '举起酒杯劝客人饮酒，吟诵明月的诗篇，歌唱窈窕的章节。',
        tokens: [
          { word: '属', type: '实词', modernMeaning: '劝酒', detail: '读 zhǔ，劝人饮酒。此处不是通假字，是"属"的本义之一。' },
        ],
      },
      {
        index: 4,
        original: '纵一苇之所如，凌万顷之茫然。',
        translation: '任凭小船在江面上飘荡，越过茫茫无边的江面。',
        tokens: [
          { word: '纵', type: '实词', modernMeaning: '任凭', detail: '动词。' },
          { word: '一苇', type: '实词', modernMeaning: '小船', detail: '比喻小船像一片苇叶。' },
          { word: '如', type: '虚词', modernMeaning: '往、到', detail: '动词，表示前往。' },
          { word: '凌', type: '实词', modernMeaning: '越过', detail: '动词。' },
        ],
      },
      {
        index: 5,
        original: '浩浩乎如冯虚御风，而不知其所止。',
        translation: '浩浩荡荡，好像凌空驾风飞行，不知道将停在哪里。',
        tokens: [
          { word: '冯', type: '通假字', modernMeaning: '凭借', detail: '通"凭"，读 píng，凭借。', relatedChar: '凭' },
          { word: '虚', type: '实词', modernMeaning: '天空', detail: '指太空、天空。' },
          { word: '御', type: '实词', modernMeaning: '驾、乘', detail: '动词。' },
        ],
      },
      {
        index: 6,
        original: '飘飘乎如遗世独立，羽化而登仙。',
        translation: '飘飘然好像脱离人世独自存在，变成神仙飞升仙境。',
        tokens: [
          { word: '遗世', type: '实词', modernMeaning: '脱离人世', detail: '"遗"即"脱离、抛弃"。' },
          { word: '羽化', type: '实词', modernMeaning: '变成神仙', detail: '道教称人成仙后身生羽翼能飞升。' },
        ],
      },
      {
        index: 7,
        original: '于是饮酒乐甚，扣舷而歌之。',
        translation: '于是喝酒喝得非常高兴，敲着船舷唱起歌来。',
        tokens: [
          { word: '舷', type: '实词', modernMeaning: '船边', detail: '读 xián。' },
        ],
      },
      {
        index: 8,
        original: '客有吹洞箫者，倚歌而和之。',
        translation: '客人中有吹洞箫的，依照歌声的曲调来应和。',
        tokens: [
          { word: '倚', type: '实词', modernMeaning: '依照、随着', detail: '介词。' },
          { word: '和', type: '实词', modernMeaning: '应和', detail: '读 hè，跟着唱或伴奏。' },
        ],
      },
      {
        index: 9,
        original: '其声呜呜然，如怨如慕，如泣如诉，余音袅袅，不绝如缕。',
        translation: '那箫声呜呜咽咽，像怨恨又像思慕，像哭泣又像倾诉，余音悠长婉转，像一根细丝一样连绵不断。',
        tokens: [
          { word: '袅袅', type: '实词', modernMeaning: '声音婉转悠长', detail: '形容词。' },
          { word: '缕', type: '实词', modernMeaning: '细丝', detail: '比喻箫声细长不断。' },
        ],
      },
      {
        index: 10,
        original: '苏子愀然，正襟危坐。',
        translation: '苏子神色变得忧愁，整理好衣襟，端正地坐着。',
        tokens: [
          { word: '愀然', type: '实词', modernMeaning: '忧愁的样子', detail: '读 qiǎo rán。' },
          { word: '危坐', type: '实词', modernMeaning: '端正地坐着', detail: '"危"即"端正"，不是"危险"的意思。' },
        ],
      },
      {
        index: 11,
        original: '方其破荆州，下江陵，顺流而东也，舳舻千里，旌旗蔽空。',
        translation: '当他（曹操）攻破荆州，占领江陵，顺着长江东下的时候，战船前后相连千里，旌旗遮蔽了天空。',
        tokens: [
          { word: '方', type: '虚词', modernMeaning: '当', detail: '介词，引出时间。' },
          { word: '东', type: '词类活用', modernMeaning: '向东进发', detail: '名词活用作动词。' },
          { word: '舳舻', type: '实词', modernMeaning: '战船', detail: '船尾为"舳"（zhú），船头为"舻"（lú）。' },
        ],
      },
      {
        index: 12,
        original: '酾酒临江，横槊赋诗，固一世之雄也，而今安在哉？',
        translation: '面对大江斟酒畅饮，横握着长矛吟诗，本是一代英雄，可现在又在哪里呢？',
        tokens: [
          { word: '酾', type: '实词', modernMeaning: '斟酒', detail: '读 shī，滤酒、斟酒。' },
          { word: '槊', type: '实词', modernMeaning: '长矛', detail: '读 shuò，古代兵器。' },
          { word: '固', type: '虚词', modernMeaning: '本来', detail: '副词。' },
          { word: '安在', type: '特殊句式', modernMeaning: '在哪里', detail: '宾语前置，"安在"即"在安"。' },
        ],
      },
      {
        index: 13,
        original: '逝者如斯，而未尝往也。',
        translation: '流逝的就像这江水，但其实并没有真正逝去。',
        tokens: [
          { word: '逝', type: '实词', modernMeaning: '流逝', detail: '动词。' },
          { word: '斯', type: '虚词', modernMeaning: '这', detail: '指江水。' },
          { word: '未尝', type: '虚词', modernMeaning: '不曾', detail: '副词。' },
        ],
      },
      {
        index: 14,
        original: '盈虚者如彼，而卒莫消长也。',
        translation: '时圆时缺的就像那月亮，但最终并没有增减。',
        tokens: [
          { word: '盈虚', type: '实词', modernMeaning: '圆缺', detail: '"盈"即满、圆，"虚"即缺。' },
          { word: '卒', type: '虚词', modernMeaning: '最终', detail: '副词。' },
          { word: '消长', type: '实词', modernMeaning: '消减和增长', detail: '指月亮的圆缺变化。' },
        ],
      },
      {
        index: 15,
        original: '盖将自其变者而观之，则天地曾不能以一瞬。',
        translation: '原来，如果从变化的一面来看，那么天地万物连一眨眼的工夫都不能保持不变。',
        tokens: [
          { word: '盖', type: '虚词', modernMeaning: '原来', detail: '连词，表示解释。' },
          { word: '将', type: '虚词', modernMeaning: '如果', detail: '连词，表示假设。' },
          { word: '曾', type: '虚词', modernMeaning: '竟然、连……都', detail: '读 zēng，副词。' },
        ],
      },
      {
        index: 16,
        original: '自其不变者而观之，则物与我皆无尽也。',
        translation: '从不变的一面来看，那么万物和我都是无穷无尽的。',
        tokens: [
          { word: '无尽', type: '实词', modernMeaning: '无穷无尽', detail: '没有穷尽。' },
        ],
      },
    ],
  },

  // text-011 劝学
  'text-011': {
    textId: 'text-011',
    sentences: [
      {
        index: 1,
        original: '君子曰：学不可以已。',
        translation: '君子说：学习不可以停止。',
        tokens: [
          { word: '已', type: '实词', modernMeaning: '停止', detail: '动词，停止。注意与"已经"区分。"学不可以已"是全文中心论点。' },
        ],
      },
      {
        index: 2,
        original: '青，取之于蓝而青于蓝；冰，水为之而寒于水。',
        translation: '靛青是从蓝草中提取的，却比蓝草更青；冰是水凝结成的，却比水更寒冷。',
        tokens: [
          { word: '于', type: '虚词', modernMeaning: '从/比', detail: '第一个"于"是"从"，第二个"于"是"比"。同一字在不同位置意义不同。' },
          { word: '而', type: '虚词', modernMeaning: '却', detail: '连词，表示转折。' },
        ],
      },
      {
        index: 3,
        original: '木直中绳，輮以为轮，其曲中规。',
        translation: '木材直得合乎墨线，用火烤使它弯曲做成车轮，它的弯曲程度合乎圆规。',
        tokens: [
          { word: '中', type: '实词', modernMeaning: '合乎', detail: '读 zhòng，动词。' },
          { word: '輮', type: '通假字', modernMeaning: '用火烤使弯曲', detail: '通"煣"，读 róu，用火烤木材使其弯曲。', relatedChar: '煣' },
          { word: '规', type: '实词', modernMeaning: '圆规', detail: '画圆的工具。' },
        ],
      },
      {
        index: 4,
        original: '虽有槁暴，不复挺者，輮使之然也。',
        translation: '即使又晒干了，也不再变直，是用火烤使它变成这样的。',
        tokens: [
          { word: '虽', type: '虚词', modernMeaning: '即使', detail: '连词，表示让步假设。' },
          { word: '槁暴', type: '实词', modernMeaning: '晒干', detail: '"槁"即枯，"暴"（pù）即晒。' },
          { word: '挺', type: '实词', modernMeaning: '直', detail: '形容词。' },
          { word: '然', type: '虚词', modernMeaning: '这样', detail: '代词。' },
        ],
      },
      {
        index: 5,
        original: '故木受绳则直，金就砺则利。',
        translation: '所以木材经过墨线量过就能取直，金属刀具在磨刀石上磨过就锋利。',
        tokens: [
          { word: '则', type: '虚词', modernMeaning: '就', detail: '连词，表示承接。' },
          { word: '就', type: '实词', modernMeaning: '接近、靠近', detail: '动词。' },
          { word: '砺', type: '实词', modernMeaning: '磨刀石', detail: '名词。' },
        ],
      },
      {
        index: 6,
        original: '君子博学而日参省乎己，则知明而行无过矣。',
        translation: '君子广博地学习并且每天对自己检查反省，就能智慧明达而行为没有过错了。',
        tokens: [
          { word: '日', type: '词类活用', modernMeaning: '每天', detail: '名词作状语。' },
          { word: '参', type: '实词', modernMeaning: '检查', detail: '检验、检查。' },
          { word: '省', type: '实词', modernMeaning: '反省', detail: '读 xǐng。' },
          { word: '乎', type: '虚词', modernMeaning: '对', detail: '介词，相当于"于"。' },
          { word: '知', type: '通假字', modernMeaning: '智慧', detail: '通"智"，读 zhì。', relatedChar: '智' },
        ],
      },
      {
        index: 7,
        original: '吾尝终日而思矣，不如须臾之所学也。',
        translation: '我曾经整天地思考，却不如片刻的学习收获大。',
        tokens: [
          { word: '尝', type: '虚词', modernMeaning: '曾经', detail: '副词。' },
          { word: '须臾', type: '实词', modernMeaning: '片刻、一会儿', detail: '表示时间很短。' },
        ],
      },
      {
        index: 8,
        original: '吾尝跂而望矣，不如登高之博见也。',
        translation: '我曾经踮起脚远望，却不如登上高处看得广阔。',
        tokens: [
          { word: '跂', type: '实词', modernMeaning: '踮起脚', detail: '读 qǐ。' },
          { word: '博见', type: '实词', modernMeaning: '看得广阔', detail: '"博"即广。' },
        ],
      },
      {
        index: 9,
        original: '登高而招，臂非加长也，而见者远。',
        translation: '登上高处招手，手臂并没有加长，但是远处的人也能看见。',
        tokens: [
          { word: '而', type: '虚词', modernMeaning: '但是', detail: '第二个"而"表转折。' },
        ],
      },
      {
        index: 10,
        original: '顺风而呼，声非加疾也，而闻者彰。',
        translation: '顺着风呼喊，声音并没有加大，但是听的人听得更清楚。',
        tokens: [
          { word: '疾', type: '实词', modernMeaning: '强、大', detail: '此处指声音洪亮。' },
          { word: '彰', type: '实词', modernMeaning: '清楚', detail: '明显、清晰。' },
        ],
      },
      {
        index: 11,
        original: '假舆马者，非利足也，而致千里。',
        translation: '借助车马的人，并不是脚走得快，却能到达千里之外。',
        tokens: [
          { word: '假', type: '实词', modernMeaning: '借助、利用', detail: '动词。' },
          { word: '利', type: '实词', modernMeaning: '快、敏捷', detail: '形容词。' },
          { word: '致', type: '实词', modernMeaning: '到达', detail: '动词。' },
        ],
      },
      {
        index: 12,
        original: '假舟楫者，非能水也，而绝江河。',
        translation: '借助舟船的人，并不是能游泳，却能横渡江河。',
        tokens: [
          { word: '楫', type: '实词', modernMeaning: '船桨', detail: '读 jí。' },
          { word: '水', type: '词类活用', modernMeaning: '游泳', detail: '名词活用作动词。' },
          { word: '绝', type: '实词', modernMeaning: '横渡', detail: '动词，渡过。' },
        ],
      },
      {
        index: 13,
        original: '君子生非异也，善假于物也。',
        translation: '君子的本性和一般人没有不同，只是善于借助外物罢了。',
        tokens: [
          { word: '生', type: '通假字', modernMeaning: '本性、资质', detail: '通"性"，读 xìng。', relatedChar: '性' },
        ],
      },
      {
        index: 14,
        original: '积土成山，风雨兴焉；积水成渊，蛟龙生焉。',
        translation: '堆积泥土成为高山，风雨就从那里兴起；积聚水流成为深渊，蛟龙就在那里生长。',
        tokens: [
          { word: '焉', type: '虚词', modernMeaning: '于此、在这里', detail: '兼词，相当于"于之"。' },
        ],
      },
      {
        index: 15,
        original: '故不积跬步，无以至千里。',
        translation: '所以不积累半步一步的行程，就无法到达千里之外。',
        tokens: [
          { word: '跬步', type: '实词', modernMeaning: '半步', detail: '古人以迈出一脚为"跬"（kuǐ），再迈一脚为"步"。"跬步"指半步，极言其小。' },
          { word: '无以', type: '虚词', modernMeaning: '没有用来……的办法', detail: '固定结构。' },
        ],
      },
      {
        index: 16,
        original: '骐骥一跃，不能十步；驽马十驾，功在不舍。',
        translation: '骏马跳跃一次，不能超过十步；劣马拉车走十天，成功在于不放弃。',
        tokens: [
          { word: '骐骥', type: '实词', modernMeaning: '骏马', detail: '读 qí jì。' },
          { word: '驽马', type: '实词', modernMeaning: '劣马', detail: '读 nú mǎ。' },
          { word: '驾', type: '实词', modernMeaning: '马拉车走一天的路程', detail: '量词。' },
        ],
      },
      {
        index: 17,
        original: '锲而舍之，朽木不折；锲而不舍，金石可镂。',
        translation: '用刀刻几下就放弃，腐朽的木头也刻不断；不停地刻下去，金属和石头也能雕刻。',
        tokens: [
          { word: '锲', type: '实词', modernMeaning: '用刀刻', detail: '读 qiè。' },
          { word: '镂', type: '实词', modernMeaning: '雕刻', detail: '读 lòu。' },
        ],
      },
    ],
  },

  // text-012 师说
  'text-012': {
    textId: 'text-012',
    sentences: [
      {
        index: 1,
        original: '古之学者必有师。',
        translation: '古代求学的人一定有老师。',
        tokens: [
          { word: '学者', type: '古今异义', modernMeaning: '求学的人', detail: '古义为"求学的人"，今义为"有学问的人"。' },
        ],
      },
      {
        index: 2,
        original: '师者，所以传道受业解惑也。',
        translation: '老师，是传授道理、教授学业、解答疑惑的人。',
        tokens: [
          { word: '所以', type: '古今异义', modernMeaning: '用来……的', detail: '古义为"用来……的"，今义为因果连词。' },
          { word: '受', type: '通假字', modernMeaning: '传授', detail: '通"授"，读 shòu。', relatedChar: '授' },
        ],
      },
      {
        index: 3,
        original: '人非生而知之者，孰能无惑？',
        translation: '人不是生下来就懂得道理的，谁能没有疑惑？',
        tokens: [
          { word: '之', type: '虚词', modernMeaning: '道理', detail: '代词，指知识和道理。' },
          { word: '孰', type: '虚词', modernMeaning: '谁', detail: '疑问代词。' },
        ],
      },
      {
        index: 4,
        original: '惑而不从师，其为惑也，终不解矣。',
        translation: '有了疑惑却不跟从老师学习，那些成为疑惑的问题，终究不能解决。',
        tokens: [
          { word: '而', type: '虚词', modernMeaning: '却', detail: '连词，表转折。' },
        ],
      },
      {
        index: 5,
        original: '生乎吾前，其闻道也固先乎吾，吾从而师之。',
        translation: '出生在我之前的人，他懂得道理本来就比我早，我跟从他，以他为师。',
        tokens: [
          { word: '乎', type: '虚词', modernMeaning: '在/比', detail: '介词，相当于"于"。第一个"乎"是"在"，第二个"乎"是"比"。' },
          { word: '从而', type: '古今异义', modernMeaning: '跟从并且', detail: '古义："从"即"跟从"���"而"是连词"并且"。今义：因果连词。' },
          { word: '师', type: '词类活用', modernMeaning: '以……为师', detail: '名词的意动用法。' },
        ],
      },
      {
        index: 6,
        original: '吾师道也，夫庸知其年之先后生于吾乎？',
        translation: '我学习的是道理，哪里需要知道他的年龄比我大还是比我小呢？',
        tokens: [
          { word: '师', type: '词类活用', modernMeaning: '学习', detail: '名词活用作动词，学习。' },
          { word: '庸', type: '虚词', modernMeaning: '难道、哪里', detail: '反问副词。' },
        ],
      },
      {
        index: 7,
        original: '是故无贵无贱，无长无少，道之所存，师之所存也。',
        translation: '因此无论高贵还是卑贱，无论年长还是年少，道理存在的地方，就是老师存在的地方。',
        tokens: [
          { word: '是故', type: '虚词', modernMeaning: '因此', detail: '连词。' },
          { word: '无', type: '虚词', modernMeaning: '无论', detail: '连词。' },
          { word: '之', type: '虚词', modernMeaning: '取消句子独立性', detail: '助词，用于主谓之间取消句子独立性。' },
        ],
      },
      {
        index: 8,
        original: '嗟乎！师道之不传也久矣！',
        translation: '唉！从师学习的风尚不流传已经很久了！',
        tokens: [
          { word: '师道', type: '实词', modernMeaning: '从师学习的风尚', detail: '"道"在此指风尚。' },
        ],
      },
      {
        index: 9,
        original: '古之圣人，其出人也远矣，犹且从师而问焉。',
        translation: '古代的圣人，他们超出一般人很远了，尚且跟从老师请教。',
        tokens: [
          { word: '出', type: '实词', modernMeaning: '超出', detail: '动词。' },
          { word: '犹且', type: '虚词', modernMeaning: '尚且', detail: '副词。' },
        ],
      },
      {
        index: 10,
        original: '今之众人，其下圣人也亦远矣，而耻学于师。',
        translation: '现在的一般人，他们低于圣人也已经很远了，却以向老师学习为耻。',
        tokens: [
          { word: '众人', type: '古今异义', modernMeaning: '一般人', detail: '古义为"一般人、普通人"，今义为"大家、很多人"。' },
          { word: '耻', type: '词类活用', modernMeaning: '以……为耻', detail: '形容词的意动用法。' },
        ],
      },
      {
        index: 11,
        original: '是故圣益圣，愚益愚。',
        translation: '因此圣人更加圣明，愚人更加愚昧。',
        tokens: [
          { word: '益', type: '虚词', modernMeaning: '更加', detail: '副词。' },
          { word: '圣', type: '词类活用', modernMeaning: '圣明/圣人', detail: '第一个"圣"是形容词（圣明），第二个"圣"是名词（圣人）。' },
        ],
      },
      {
        index: 12,
        original: '爱其子，择师而教之；于其身也，则耻师焉，惑矣。',
        translation: '爱自己的孩子，选择老师来教他；对于自己，却以从师学习为耻，真是糊涂啊。',
        tokens: [
          { word: '身', type: '实词', modernMeaning: '自己', detail: '自身、本人。' },
          { word: '惑', type: '实词', modernMeaning: '糊涂', detail: '形容词。' },
        ],
      },
      {
        index: 13,
        original: '彼童子之师，授之书而习其句读者，非吾所谓传其道解其惑者也。',
        translation: '那些小孩的老师，是教他们读书、学习断句的，不是我所说的传授道理、解答疑惑的老师。',
        tokens: [
          { word: '句读', type: '实词', modernMeaning: '断句', detail: '读 jù dòu，古书没有标点，学习时要学会断句。"句"即语义完整处，"读"即句中停顿处。' },
        ],
      },
      {
        index: 14,
        original: '句读之不知，惑之不解，或师焉，或不焉，小学而大遗，吾未见其明也。',
        translation: '不懂断句，不能解决疑惑，有的从师学习，有的不从师学习，小的方面学习，大的方面却放弃了，我看不出他明智在哪里。',
        tokens: [
          { word: '或', type: '虚词', modernMeaning: '有的', detail: '代词。' },
          { word: '不', type: '通假字', modernMeaning: '不', detail: '通"否"，读 fǒu。', relatedChar: '否' },
        ],
      },
      {
        index: 15,
        original: '孔子曰：三人行，则必有我师。',
        translation: '孔子说：三个人一起走路，其中一定有可以做我老师的人。',
        tokens: [
          { word: '三', type: '实词', modernMeaning: '多个、几个', detail: '虚指，表示多数。' },
        ],
      },
      {
        index: 16,
        original: '是故弟子不必不如师，师不必贤于弟子，闻道有先后，术业有专攻，如是而已。',
        translation: '因此学生不一定不如老师，老师不一定比学生贤能，懂得道理有先有后，学问技艺各有专长，如此罢了。',
        tokens: [
          { word: '不必', type: '古今异义', modernMeaning: '不一定', detail: '古义为"不一定"，今义为"不需要"。' },
          { word: '于', type: '虚词', modernMeaning: '比', detail: '介词，引出比较对象。' },
          { word: '专攻', type: '实词', modernMeaning: '专门研究', detail: '专门从事研究。' },
        ],
      },
      {
        index: 17,
        original: '李氏子蟠，年十七，好古文，六艺经传皆通习之。',
        translation: '李家的孩子李蟠，十七岁，喜欢古文，六经的经文和传文都普遍学习了。',
        tokens: [
          { word: '好', type: '实词', modernMeaning: '喜欢', detail: '读 hào。' },
          { word: '六艺', type: '实词', modernMeaning: '六经', detail: '指《诗》《书》《礼》《乐》《易》《春秋》六部经典。' },
        ],
      },
      {
        index: 18,
        original: '余嘉其能行古道，作《师说》以贻之。',
        translation: '我赞赏他能遵循古人从师之道，写了这篇《师说》来赠送给他。',
        tokens: [
          { word: '嘉', type: '实词', modernMeaning: '赞赏', detail: '动词。' },
          { word: '古道', type: '实词', modernMeaning: '古人从师之道', detail: '指古人尊师重道的风尚。' },
          { word: '贻', type: '实词', modernMeaning: '赠送', detail: '动词，读 yí。' },
        ],
      },
    ],
  },
};

// 合并所有学段数据
export const wenyanGrammar: Record<string, WenyanAnnotation> = {
  ...wenyanGrammarPrimary,
  ...wenyanGrammarJunior,
  ...wenyanGrammarSenior,
};
