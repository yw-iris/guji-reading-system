// ===== 文言文背景知识数据 =====
// 为各篇文言文提供出处典籍、作者生平、历史背景、相关典故与思维导图。
import type { WenyanBackground } from '../types';

export const wenyanBackgrounds: Record<string, WenyanBackground> = {
  // ===================== 寓言·小学段 =====================

  // text-003 守株待兔
  'text-003': {
    textId: 'text-003',
    source: '《韩非子》',
    sourceDescription:
      '《韩非子》是战国末期法家代表人物韩非的著作集，共五十五篇，融合法、术、势三家思想，善用寓言与史实说理。',
    authorBio:
      '韩非（约前280—前233），韩国公子，荀况弟子，口吃而善著书。其学说集法家之大成，深受秦王嬴政赏识，著作传入秦国后秦王叹"寡人得见此人与之游，死不恨矣"。',
    historicalContext:
      '战国末期诸侯混战、变法图强，韩非主张以法治国、因时变法。寓言多针对统治者因循守旧、妄想不劳而获的弊端而作，意在劝君变法图存。',
    relatedStories: [
      {
        title: '郑人买履',
        description: '郑人宁信量好的尺码也不信自己的脚，喻只信教条不顾实际。',
        source: '《韩非子·外储说左上》',
      },
      {
        title: '滥竽充数',
        description: '南郭先生不会吹竽却混在合奏中充数，喻无真才实学而靠蒙混度日。',
        source: '《韩非子的·内储说上》',
      },
      {
        title: '买椟还珠',
        description: '楚人买下盛珠的精美木匣却退还珍珠，喻取舍不当、舍本逐末。',
        source: '《韩非子·外储说左上》',
      },
    ],
    mindMap: {
      label: '守株待兔',
      children: [
        {
          label: '故事内容',
          children: [
            { label: '兔走触株而死' },
            { label: '农夫释耒守株' },
            { label: '兔不可复得，身为宋国笑' },
          ],
        },
        {
          label: '寓意',
          children: [
            { label: '不可墨守成规' },
            { label: '不可妄想不劳而获' },
          ],
        },
        {
          label: '出处与手法',
          children: [{ label: '出自《韩非子》' }, { label: '寓言说理' }],
        },
      ],
    },
  },

  // ===================== 小学段（文言短文） =====================

  // text-013 杨氏之子
  'text-013': {
    textId: 'text-013',
    source: '《世说新语》',
    sourceDescription:
      '《世说新语》是南朝宋刘义庆组织门客编纂的志人小说集，分三十六门，记录汉末至东晋名士的言行轶事。',
    authorBio:
      '刘义庆（403—444），南朝宋宗室、文学家，袭封临川王。他招揽文士编撰《世说新语》，以简淡笔墨写尽名士风度。',
    historicalContext:
      '魏晋南北朝门阀士族盛行，清谈之风大炽，士人重机智、尚应对。《世说新语》正是对这一"风流"时代的剪影式记录。',
    relatedStories: [
      {
        title: '孔融让梨',
        description: '孔融幼时与兄弟分梨，自取小者，以谦让见称。',
        source: '《世说新语·言语》',
      },
      {
        title: '小时了了',
        description: '孔融十岁拜见李膺，以"想君小时必当了了"巧对嘲讽。',
        source: '《世说新语·言语》',
      },
      {
        title: '王戎不取道旁李',
        description: '王戎断言道旁多子之李必苦，果如其言，见其早慧。',
        source: '《世说新语·雅量》',
      },
    ],
    mindMap: {
      label: '杨氏之子',
      children: [
        {
          label: '人物',
          children: [{ label: '杨氏九岁子' }, { label: '孔君平（客人）' }],
        },
        {
          label: '对话机锋',
          children: [
            { label: '客指杨梅曰"此是君家果"' },
            { label: '儿应"未闻孔雀是夫子家禽"' },
          ],
        },
        {
          label: '妙处',
          children: [{ label: '谐音巧对' }, { label: '委婉而不失礼' }],
        },
      ],
    },
  },

  // text-014 自相矛盾
  'text-014': {
    textId: 'text-014',
    source: '《韩非子》',
    sourceDescription:
      '《韩非子》是战国末期法家代表人物韩非的著作集，善用寓言说理，主张明法、任势、恃术以治天下。',
    authorBio:
      '韩非（约前280—前233），韩国公子，荀况弟子，口吃而善著书，其文逻辑严密、论辩犀利，集法家思想之大成。',
    historicalContext:
      '战国诸子百家论辩激烈，韩非以寓言揭露言行不一、逻辑悖谬之弊，为推行法治、统一言辞提供理论武器。',
    relatedStories: [
      {
        title: '守株待兔',
        description: '农夫望兔触株而守，喻固守成法不知变通。',
        source: '《韩非子·五蠹》',
      },
      {
        title: '郑人买履',
        description: '宁信度而忘足，喻拘泥教条、不顾实际。',
        source: '《韩非子·外储说左上》',
      },
      {
        title: '滥竽充数',
        description: '南郭先生混奏充数，喻无实学而蒙混。',
        source: '《韩非子·内储说上》',
      },
    ],
    mindMap: {
      label: '自相矛盾',
      children: [
        {
          label: '楚人夸饰',
          children: [{ label: '吾盾之坚，物莫能陷' }, { label: '吾矛之利，于物无不陷' }],
        },
        {
          label: '诘问破绽',
          children: [{ label: '以子之矛陷子之盾' }, { label: '其人弗能应' }],
        },
        {
          label: '寓意',
          children: [{ label: '言行不可自相抵触' }, { label: '逻辑须自洽' }],
        },
      ],
    },
  },

  // text-015 田忌赛马
  'text-015': {
    textId: 'text-015',
    source: '《史记》',
    sourceDescription:
      '《史记》是西汉司马迁所撰纪传体通史，上起黄帝、下迄汉武，分本纪、表、书、世家、列传，被誉为"史家之绝唱"。',
    authorBio:
      '司马迁（前145—约前86），字子长，夏阳人，继承父职任太史令，因李陵之祸受宫刑，发愤著《史记》以"究天人之际，通古今之变"。',
    historicalContext:
      '战国齐威王时，齐国强盛、士人辈出。孙膑以谋略助田忌赛马取胜，后助齐于桂陵、马陵大败魏军，彰显"以智取胜"之兵略。',
    relatedStories: [
      {
        title: '围魏救赵',
        description: '孙膑围攻魏都以解赵围，避实击虚，千古良策。',
        source: '《史记·孙子吴起列传》',
      },
      {
        title: '马陵之战',
        description: '孙膑减灶诱敌，于马陵设伏射杀庞涓。',
        source: '《史记·孙子吴起列传》',
      },
      {
        title: '负荆请罪',
        description: '廉颇知错负荆请罪，将相和而国家安。',
        source: '《史记·廉颇蔺相如列传》',
      },
    ],
    mindMap: {
      label: '田忌赛马',
      children: [
        {
          label: '人物',
          children: [{ label: '田忌（齐将）' }, { label: '孙膑（军师）' }, { label: '齐威王' }],
        },
        {
          label: '策略',
          children: [
            { label: '下对上、上对中、中对下' },
            { label: '以局部的失换整体的胜' },
          ],
        },
        {
          label: '启示',
          children: [{ label: '扬长避短' }, { label: '谋略胜于蛮力' }],
        },
      ],
    },
  },

  // text-016 伯牙鼓琴
  'text-016': {
    textId: 'text-016',
    source: '《吕氏春秋》',
    sourceDescription:
      '《吕氏春秋》是战国末期秦相吕不韦门客集体编撰的杂家著作，汇通诸子、号称"备天地万物古今之事"。',
    authorBio:
      '吕不韦（？—前235），战国末年卫国濮阳人，秦国丞相，主编《吕氏春秋》以为治国纲领，书成悬于国门，增损一字赏千金。',
    historicalContext:
      '战国末期大一统前夕，思想由分趋合。《吕氏春秋》兼采儒道墨法，意在为即将统一的帝国提供兼容并包的治理蓝本。',
    relatedStories: [
      {
        title: '高山流水',
        description: '伯牙志在山水，子期善听，后子期死，伯牙破琴绝弦。',
        source: '《吕氏春秋·本味》',
      },
      {
        title: '九方皋相马',
        description: '九方皋相马不计牝牡骊黄，得其神而忘其形。',
        source: '《吕氏春秋·观表》',
      },
      {
        title: '刻舟求剑',
        description: '楚人坠剑刻舟，喻拘泥成法、不知变通。',
        source: '《吕氏春秋·察今》',
      },
    ],
    mindMap: {
      label: '伯牙鼓琴',
      children: [
        {
          label: '知音相和',
          children: [{ label: '伯牙鼓琴，志在太山/流水' }, { label: '钟子期善听' }],
        },
        {
          label: '破琴绝弦',
          children: [{ label: '子期死，伯牙不复鼓' }, { label: '世再无知音' }],
        },
        {
          label: '文化意涵',
          children: [{ label: '知音难觅' }, { label: '友情至高' }],
        },
      ],
    },
  },

  // text-017 书戴嵩画牛
  'text-017': {
    textId: 'text-017',
    source: '《苏轼文集》',
    sourceDescription:
      '《苏轼文集》收录北宋苏轼的诗、词、文、题跋等，其文如行云流水，题跋小品尤见性情与理趣。',
    authorBio:
      '苏轼（1037—1101），字子瞻，号东坡居士，眉山人。北宋文坛领袖，诗文书画俱绝，一生屡遭贬谪而旷达自适。',
    historicalContext:
      '北宋文人重鉴赏、好题跋，常在书画后作记以发议论。本文借牧童评画，阐发"观察须合物理、实践方得真知"之理。',
    relatedStories: [
      {
        title: '文与可画筼筜谷偃竹',
        description: '苏轼记文同画竹"胸有成竹"，论艺术创作之酝酿。',
        source: '《苏轼文集·文与可画筼筜谷偃竹记》',
      },
      {
        title: '石钟山记',
        description: '苏轼夜探石钟山，主张"事不目见耳闻不可臆断"。',
        source: '《苏轼文集·石钟山记》',
      },
      {
        title: '日喻',
        description: '苏轼以盲者识日喻学，强调亲身实践方得真知。',
        source: '《苏轼文集·日喻》',
      },
    ],
    mindMap: {
      label: '书戴嵩画牛',
      children: [
        {
          label: '故事',
          children: [{ label: '杜处士好书画' }, { label: '牧童笑牛尾掉误' }],
        },
        {
          label: '争议焦点',
          children: [{ label: '斗牛尾搐入两股间' }, { label: '画中尾掉似谬' }],
        },
        {
          label: '哲理',
          children: [{ label: '耕当问奴，织当问婢' }, { label: '实践出真知' }],
        },
      ],
    },
  },

  // text-018 学弈
  'text-018': {
    textId: 'text-018',
    source: '《孟子》',
    sourceDescription:
      '《孟子》是战国时期儒家代表人物孟轲及其弟子所著，记录孟子与诸侯论政及仁义学说，气势磅礴、善用比喻。',
    authorBio:
      '孟轲（前372—前289），邹国人，受业于子思门人，尊称"亚圣"。他周游列国倡"仁政""民贵君轻"，性善论为其学说根基。',
    historicalContext:
      '战国争雄、攻伐不止，孟子针对时弊倡王道、反霸道。本文以学弈为喻，阐明"专心致志"乃为学修身之本。',
    relatedStories: [
      {
        title: '孟母三迁',
        description: '孟母三迁其居以择邻，终使孟子成才。',
        source: '《孟子·滕文公上》注引',
      },
      {
        title: '揠苗助长',
        description: '宋人拔苗助长反致枯死，喻违反规律徒劳无功。',
        source: '《孟子·公孙丑上》',
      },
      {
        title: '鱼与熊掌',
        description: '孟子以鱼与熊掌喻"舍生而取义"，论价值取舍。',
        source: '《孟子·告子上》',
      },
    ],
    mindMap: {
      label: '学弈',
      children: [
        {
          label: '对比',
          children: [{ label: '一人专心致志' }, { label: '一人心不在焉' }],
        },
        {
          label: '结果',
          children: [{ label: '俱学而智弗若' }, { label: '非天资之差' }],
        },
        {
          label: '主旨',
          children: [{ label: '专心致志' }, { label: '为学贵恒' }],
        },
      ],
    },
  },

  // text-019 两小儿辩日
  'text-019': {
    textId: 'text-019',
    source: '《列子》',
    sourceDescription:
      '《列子》是战国早期道家著作，相传为列御寇所撰，多记寓言与神话，想象奇肆、寓理于趣。',
    authorBio:
      '列御寇（列子），战国郑人，道家先贤，主张清静无为、贵虚。其文汪洋恣肆，《愚公移山》《杞人忧天》皆出其书。',
    historicalContext:
      '战国诸子好以日常现象设疑辩难，本文借两小儿争辩日之远近，既见孩童求知之趣，亦凸显孔圣人"知之为知之"的坦诚。',
    relatedStories: [
      {
        title: '愚公移山',
        description: '愚公率子孙挖山不止，喻持之以恒可移山填海。',
        source: '《列子·汤问》',
      },
      {
        title: '杞人忧天',
        description: '杞人忧天崩坠，喻不必要的忧虑。',
        source: '《列子·天瑞》',
      },
      {
        title: '歧路亡羊',
        description: '杨子邻亡羊于多歧之路，喻治学须专一方向。',
        source: '《列子·说符》',
      },
    ],
    mindMap: {
      label: '两小儿辩日',
      children: [
        {
          label: '两说相争',
          children: [{ label: '一儿：晨近（大如车盖）' }, { label: '一儿：午近（沧沧凉凉）' }],
        },
        {
          label: '孔子不能决',
          children: [{ label: '圣人亦有不知' }, { label: '诚实以对' }],
        },
        {
          label: '启示',
          children: [{ label: '学无止境' }, { label: '敢于质疑' }],
        },
      ],
    },
  },

  // text-020 囊萤夜读
  'text-020': {
    textId: 'text-020',
    source: '《晋书》',
    sourceDescription:
      '《晋书》是唐代房玄龄等奉敕编撰的纪传体晋代史，取材宏富，兼载志怪逸闻，详录两晋风云人物。',
    authorBio:
      '房玄龄（579—648）等奉唐太宗命修《晋书》。车胤（？—约401），字武子，东晋南平人，自幼家贫而勤学，官至吏部尚书。',
    historicalContext:
      '两晋尚清谈、重门第，然寒门子弟每以苦学求进。车胤"囊萤"、孙康"映雪"成为贫而好学之典范，流芳后世。',
    relatedStories: [
      {
        title: '孙康映雪',
        description: '孙康家贫无灯，借雪映光而读，与囊萤并称。',
        source: '《晋书·车胤传》附',
      },
      {
        title: '凿壁偷光',
        description: '匡衡穿壁引邻光读书，喻勤学不辍。',
        source: '《西京杂记》',
      },
      {
        title: '悬梁刺股',
        description: '孙敬悬梁、苏秦刺股以防瞌睡，极言苦读。',
        source: '《太平御览》引《汉书》',
      },
    ],
    mindMap: {
      label: '囊萤夜读',
      children: [
        {
          label: '勤学之士',
          children: [{ label: '车胤家贫' }, { label: '夏月囊萤照书' }],
        },
        {
          label: '精神',
          children: [{ label: '克服困境' }, { label: '以勤补拙' }],
        },
        {
          label: '同类典故',
          children: [{ label: '映雪' }, { label: '凿壁偷光' }],
        },
      ],
    },
  },

  // text-021 铁杵成针
  'text-021': {
    textId: 'text-021',
    source: '《方舆胜览》',
    sourceDescription:
      '《方舆胜览》是南宋祝穆所编地理类书，分览郡县风土、山川、古迹、人物，多采民间传说。',
    authorBio:
      '祝穆（?—1255），字和父，南宋建阳人，博学工文，编《方舆胜览》《事文类聚》等类书，广为流传。',
    historicalContext:
      '南宋州县儒学兴盛，李白"铁杵磨针"传说被采入方志以励后学，成为"持之以恒、功到自然成"的经典喻例。',
    relatedStories: [
      {
        title: '李白醉草吓蛮书',
        description: '传说李白醉中草诏使番使折服，见其才气。',
        source: '《方舆胜览》及民间传说',
      },
      {
        title: '磨穿铁砚',
        description: '桑维翰铸铁砚誓不退缩，喻立志坚毅。',
        source: '《新五代史·桑维翰传》',
      },
      {
        title: '水滴石穿',
        description: '张乖崖以"一日一钱"喻积久成事，强调恒心。',
        source: '《鹤林玉露》',
      },
    ],
    mindMap: {
      label: '铁杵成针',
      children: [
        {
          label: '传说',
          children: [{ label: '老妪磨铁杵' }, { label: '欲作针' }, { label: '李白感愧终业' }],
        },
        {
          label: '寓意',
          children: [{ label: '持之以恒' }, { label: '功到自然成' }],
        },
        {
          label: '关联人物',
          children: [{ label: '李白（唐诗人）' }],
        },
      ],
    },
  },

  // ===================== 古人谈读书（三则） =====================

  // text-022 古人谈读书（一）·《论语》
  'text-022': {
    textId: 'text-022',
    source: '《论语》',
    sourceDescription:
      '《论语》是孔子弟子及再传弟子编纂的语录体著作，记录孔子及其弟子言行，为儒家经典"四书"之首。',
    authorBio:
      '孔子（前551—前479），名丘字仲尼，鲁国人，儒家学派创始人，首创私学、有教无类，被尊为"至圣先师"。',
    historicalContext:
      '春秋礼崩乐坏，孔子以"仁""礼"救世，聚徒讲学。其读书治学主张"知之为知之"的诚实态度与"学思结合"之法。',
    relatedStories: [
      {
        title: '韦编三绝',
        description: '孔子读《易》至编绳磨断多次，喻勤读不辍。',
        source: '《史记·孔子世家》',
      },
      {
        title: '温故知新',
        description: '子曰"温故而知新，可以为师矣"，论温习与创获。',
        source: '《论语·为政》',
      },
      {
        title: '不耻下问',
        description: '孔子赞孔文子"敏而好学，不耻下问"，倡虚心求学。',
        source: '《论语·公冶长》',
      },
    ],
    mindMap: {
      label: '古人谈读书（一）·《论语》',
      children: [
        {
          label: '治学态度',
          children: [{ label: '知之为知之，不知为不知' }, { label: '诚实无欺' }],
        },
        {
          label: '方法',
          children: [{ label: '学而时习之' }, { label: '学思结合' }],
        },
        {
          label: '志向',
          children: [{ label: '敏以求之' }, { label: '诲人不倦' }],
        },
      ],
    },
  },

  // text-023 古人谈读书（二）·《朱子语类》
  'text-023': {
    textId: 'text-023',
    source: '《朱子语类》',
    sourceDescription:
      '《朱子语类》是南宋朱熹与其门人问答语录的分类汇编，涵盖理气、心性、读书治学诸端，为理学入门要籍。',
    authorBio:
      '朱熹（1130—1200），字元晦，号晦庵，徽州婺源人，南宋理学集大成者，一生讲学不辍，注"四书"垂范后世。',
    historicalContext:
      '南宋理学昌盛，朱熹强调"格物致知"。本文提出"读书三到"——心到、眼到、口到，而以"心到"为最紧要。',
    relatedStories: [
      {
        title: '半亩方塘',
        description: '朱熹"问渠那得清如许，为有源头活水来"，喻学须不断更新。',
        source: '《观书有感》',
      },
      {
        title: '格物致知',
        description: '朱熹主张穷究事物之理以求知识，为理学方法论。',
        source: '《四书章句集注》',
      },
      {
        title: '循序渐进',
        description: '朱熹论读书须"循序而渐进，熟读而精思"。',
        source: '《朱子读书法》',
      },
    ],
    mindMap: {
      label: '古人谈读书（二）·《朱子语类》',
      children: [
        {
          label: '读书三到',
          children: [{ label: '心到' }, { label: '眼到' }, { label: '口到' }],
        },
        {
          label: '核心',
          children: [{ label: '心到最急' }, { label: '心既到，眼口岂不到' }],
        },
        {
          label: '方法',
          children: [{ label: '熟读' }, { label: '精思' }],
        },
      ],
    },
  },

  // text-024 古人谈读书（三）·《曾国藩家书》
  'text-024': {
    textId: 'text-024',
    source: '《曾国藩家书》',
    sourceDescription:
      '《曾国藩家书》是晚清曾国藩写给家人的书信集，谈修身、治学、治家、用兵，平实恳切，足为后世法。',
    authorBio:
      '曾国藩（1811—1872），字涤生，湖南湘乡人，晚清名臣、理学名家，创建湘军平定太平天国，史称"中兴第一名臣"。',
    historicalContext:
      '晚清内忧外患，曾国藩以"恒"与"志"勉人。本文论士人读书须"有志、有识、有恒"，三者兼备方能有成。',
    relatedStories: [
      {
        title: '黎明即起',
        description: '曾氏家书倡"黎明即起，洒扫庭除"，重勤与恒。',
        source: '《曾国藩家书》',
      },
      {
        title: '屡败屡战',
        description: '曾国藩兵败仍上疏言"屡败屡战"，见其坚毅。',
        source: '《曾国藩全集》',
      },
      {
        title: '日课四条',
        description: '曾氏以"慎独、主敬、求仁、习劳"自律修身。',
        source: '《曾国藩家书》',
      },
    ],
    mindMap: {
      label: '古人谈读书（三）·《曾国藩家书》',
      children: [
        {
          label: '读书三有',
          children: [{ label: '有志（断不甘为下流）' }, { label: '有识（知学问无尽）' }, { label: '有恒（断无不成之事）' }],
        },
        {
          label: '核心理念',
          children: [{ label: '恒最为要' }, { label: '每日须有常' }],
        },
        {
          label: '修身',
          children: [{ label: '勤' }, { label: '谦' }],
        },
      ],
    },
  },

  // ===================== 初中段 =====================

  // text-007 岳阳楼记
  'text-007': {
    textId: 'text-007',
    source: '《范文正公集》',
    sourceDescription:
      '《范文正公集》是北宋名臣范仲淹的文集，政论、散文俱佳，《岳阳楼记》为其千古名篇。',
    authorBio:
      '范仲淹（989—1052），字希文，谥文正，吴县人。北宋政治家、文学家，主持"庆历新政"，以"先忧后乐"为士林楷模。',
    historicalContext:
      '北宋仁宗庆历年间，范仲淹贬谪邓州，应友滕子京之嘱为重修岳阳楼作记，借景抒怀，倡"不以物喜、不以己悲"之胸襟。',
    relatedStories: [
      {
        title: '庆历新政',
        description: '范仲淹推行改革整顿吏治，虽挫败而开北宋变法先声。',
        source: '《宋史·范仲淹传》',
      },
      {
        title: '断齑画粥',
        description: '范仲淹少时贫，以冷粥咸菜苦读，终成一代名臣。',
        source: '《宋名臣言行录》',
      },
      {
        title: '滕子京谪守巴陵',
        description: '滕子京谪守岳州，政通人和、重修岳阳楼，邀范作记。',
        source: '《岳阳楼记》本文',
      },
    ],
    mindMap: {
      label: '岳阳楼记',
      children: [
        {
          label: '景物',
          children: [{ label: '霪雨霏霏（悲）' }, { label: '春和景明（喜）' }],
        },
        {
          label: '迁客之情',
          children: [{ label: '览物而悲' }, { label: '览物而喜' }],
        },
        {
          label: '主旨',
          children: [{ label: '不以物喜，不以己悲' }, { label: '先天下之忧而忧' }],
        },
      ],
    },
  },

  // text-008 出师表
  'text-008': {
    textId: 'text-008',
    source: '《三国志》',
    sourceDescription:
      '《三国志》是西晋陈寿所撰纪传体国别史，分魏、蜀、吴三志，叙事简严，为"前四史"之一。',
    authorBio:
      '诸葛亮（181—234），字孔明，琅琊阳都人，蜀汉丞相，辅刘备建业、鞠躬尽瘁，为后世忠臣典范。陈寿（233—297）撰《三国志》录其事迹。',
    historicalContext:
      '蜀汉建兴五年，诸葛亮率师北驻汉中，临行上《出师表》劝后主亲贤远佞、北伐中原，言辞恳切，忠爱溢于言表。',
    relatedStories: [
      {
        title: '三顾茅庐',
        description: '刘备三访隆中，请诸葛亮出山，君臣鱼水。',
        source: '《三国志·诸葛亮传》',
      },
      {
        title: '鞠躬尽瘁',
        description: '诸葛亮"鞠躬尽瘁，死而后已"，六出祁山而殁。',
        source: '《后出师表》',
      },
      {
        title: '空城计',
        description: '诸葛亮抚琴退司马，见其临危镇定（演义衍化）。',
        source: '《三国演义》及民间',
      },
    ],
    mindMap: {
      label: '出师表',
      children: [
        {
          label: '建言',
          children: [{ label: '开张圣听' }, { label: '亲贤臣远小人' }, { label: '陟罚臧否不宜异同' }],
        },
        {
          label: '自述',
          children: [{ label: '三顾之恩' }, { label: '受任于败军之际' }],
        },
        {
          label: '情感',
          children: [{ label: '报先帝、忠陛下' }, { label: '兴复汉室' }],
        },
      ],
    },
  },

  // text-009 桃花源记
  'text-009': {
    textId: 'text-009',
    source: '《陶渊明集》',
    sourceDescription:
      '《陶渊明集》收录东晋诗人陶渊明的诗、文、辞赋，风格冲淡自然，多写田园隐逸与理想社会。',
    authorBio:
      '陶渊明（约365—427），字元亮，号五柳先生，浔阳柴桑人。曾任彭泽令，不为五斗米折腰，归隐躬耕，为田园诗鼻祖。',
    historicalContext:
      '东晋末年政治黑暗、战乱频仍，陶潜厌弃官场，借"桃花源"寄托对没有剥削、和平安宁之社会的向往。',
    relatedStories: [
      {
        title: '不为五斗米折腰',
        description: '陶渊明弃彭泽令印绶归隐，誓不屈身事权贵。',
        source: '《晋书·陶潜传》',
      },
      {
        title: '五柳先生传',
        description: '陶渊明自况"闲静少言，不慕荣利"，写隐士风度。',
        source: '《陶渊明集》',
      },
      {
        title: '归去来兮辞',
        description: '陶渊明辞官归田，抒发"田园将芜胡不归"之慨。',
        source: '《陶渊明集》',
      },
    ],
    mindMap: {
      label: '桃花源记',
      children: [
        {
          label: '进入',
          children: [{ label: '捕鱼忘路' }, { label: '忽逢桃花林' }, { label: '山有小口' }],
        },
        {
          label: '桃源生活',
          children: [{ label: '土地平旷、怡然自乐' }, { label: '不知有汉，无论魏晋' }],
        },
        {
          label: '主题',
          children: [{ label: '理想社会' }, { label: '对乱世的否定' }],
        },
      ],
    },
  },

  // ===================== 高中段 =====================

  // text-010 赤壁赋
  'text-010': {
    textId: 'text-010',
    source: '《苏轼文集》',
    sourceDescription:
      '《苏轼文集》汇集北宋苏轼的诗文词赋，前后《赤壁赋》为代表作，融哲理、写景、抒情于一炉。',
    authorBio:
      '苏轼（1037—1101），字子瞻，号东坡居士，眉山人。北宋文坛领袖，因"乌台诗案"贬黄州，于困顿中写出旷达名篇。',
    historicalContext:
      '北宋元丰五年，苏轼谪居黄州，两游赤壁，作前后《赤壁赋》。借江山风月抒"变与不变"之哲思，消解人生无常之悲。',
    relatedStories: [
      {
        title: '乌台诗案',
        description: '苏轼因诗被劾下狱，几遭不测，后贬黄州团练副使。',
        source: '《宋史·苏轼传》',
      },
      {
        title: '念奴娇·赤壁怀古',
        description: '苏轼同游赤壁作此词，"大江东去"尽显豪迈与苍凉。',
        source: '《苏轼词》',
      },
      {
        title: '黄州东坡躬耕',
        description: '苏轼于黄州东坡垦荒自号"东坡居士"，苦中作乐。',
        source: '《苏轼文集》',
      },
    ],
    mindMap: {
      label: '赤壁赋',
      children: [
        {
          label: '景物',
          children: [{ label: '清风明月' }, { label: '白露横江、水光接天' }],
        },
        {
          label: '主客问答',
          children: [{ label: '客：哀吾生之须臾' }, { label: '主：物与我皆无尽' }],
        },
        {
          label: '哲理',
          children: [{ label: '变与不变' }, { label: '共适清风明月' }],
        },
      ],
    },
  },

  // text-011 劝学
  'text-011': {
    textId: 'text-011',
    source: '《荀子》',
    sourceDescription:
      '《荀子》是战国末期儒家学者荀况的著作集，主张性恶论与"隆礼重法"，说理缜密、善用譬喻。',
    authorBio:
      '荀况（约前313—前238），字卿，赵国人，时人尊称荀卿。曾游学齐稷下，三为祭酒，李斯、韩非皆出其门。',
    historicalContext:
      '战国学术鼎盛而纷争，荀子强调后天学习与教化。本文系统论述"学不可以已"，以自然物象喻积累、恒心、专一之要。',
    relatedStories: [
      {
        title: '青出于蓝',
        description: '荀子以"青取之于蓝而青于蓝"喻学习与超越。',
        source: '《荀子·劝学》',
      },
      {
        title: '锲而不舍',
        description: '荀子以雕刻喻学，"锲而不舍，金石可镂"。',
        source: '《荀子·劝学》',
      },
      {
        title: '冰生于水',
        description: '荀子以"冰，水为之而寒于水"喻习染变化。',
        source: '《荀子·劝学》',
      },
    ],
    mindMap: {
      label: '劝学',
      children: [
        {
          label: '总论',
          children: [{ label: '学不可以已' }, { label: '君子博学而日参省' }],
        },
        {
          label: '方法',
          children: [{ label: '积累（积土成山）' }, { label: '恒心（锲而不舍）' }, { label: '专一（用心一也）' }],
        },
        {
          label: '环境',
          children: [{ label: '君子慎其所立' }, { label: '假于物也' }],
        },
      ],
    },
  },

  // text-012 师说
  'text-012': {
    textId: 'text-012',
    source: '《韩愈文集》',
    sourceDescription:
      '《韩愈文集》收录唐代古文运动领袖韩愈的散文，雄健奔放、文以载道，《师说》为倡古道、反流俗之作。',
    authorBio:
      '韩愈（768—824），字退之，河阳人，世称韩昌黎。唐代古文运动主将，倡"文以载道"，列"唐宋八大家"之首。',
    historicalContext:
      '唐代士大夫耻于从师，风气浮薄。韩愈针砭时弊作《师说》，倡"道之所存、师之所存"，重振尊师重道之风。',
    relatedStories: [
      {
        title: '古文运动',
        description: '韩愈、柳宗元倡古文、反骈俪，复归秦汉散文传统。',
        source: '《昌黎先生集》及相关史传',
      },
      {
        title: '推敲',
        description: '贾岛"僧敲月下门"炼字，韩愈助定"敲"字。',
        source: '《苕溪渔隐丛话》',
      },
      {
        title: '千里马说',
        description: '韩愈以千里马不遇伯乐喻人才被埋没之憾。',
        source: '《韩愈文集·杂说》',
      },
    ],
    mindMap: {
      label: '师说',
      children: [
        {
          label: '师道',
          children: [{ label: '古之学者必有师' }, { label: '道之所存，师之所存' }],
        },
        {
          label: '批判',
          children: [{ label: '耻学于师' }, { label: '位卑则足羞' }],
        },
        {
          label: '主张',
          children: [{ label: '圣人无常师' }, { label: '闻道有先后' }, { label: '术业有专攻' }],
        },
      ],
    },
  },
};
