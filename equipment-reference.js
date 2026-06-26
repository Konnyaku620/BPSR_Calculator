// 装备数据维护文件。
// 修改这里的数组后，刷新 bpsr-calculator.html 即可生效。
// 注意：逗号、引号和中括号需要保留 JavaScript 格式。

window.BPSR_EQUIPMENT_REFERENCE = {
  // 配装区行列表。id 用于保存数据，修改已有 id 会导致旧选择失效。
  slots: [
    { id: "weapon", label: "武器" },
    { id: "helmet", label: "头盔" },
    { id: "armor", label: "衣服" },
    { id: "gloves", label: "护手" },
    { id: "shoes", label: "鞋子" },
    { id: "earring", label: "耳坠" },
    { id: "necklace", label: "项链" },
    { id: "ring", label: "戒指" },
    { id: "leftBracelet", label: "左手环" },
    { id: "rightBracelet", label: "右手环" },
    { id: "talisman", label: "护符" }
  ],

  options: {
    // 普通装备类型，武器不使用这里的选项。
    type: [
      "第一赛季 40金",
      "第一赛季 60金",
      "第一赛季 60套装",
      "第一赛季 80金",
      "第一赛季 80套装",
      "第二赛季 120金",
      "第二赛季 140金",
      "第二赛季 150套装",
      "第二赛季 160金",
      "第二赛季 170套装",
      "第三赛季 220金",
      "第三赛季 240金",
      "第三赛季 250套装",
      "第三赛季 260金",
      "第三赛季 270套装"
    ],

    // 武器类型。金色武器为特殊词条+档位，红色武器为特殊词条单选，海武器为特殊词条最多 4 选。
    weaponType: [
      "第一赛季 40金",
      "第一赛季 60金",
      "第一赛季 70红",
      "第一赛季 80金",
      "第一赛季 90红",
      "第一赛季 100海",
      "第二赛季 120金",
      "第二赛季 140金",
      "第二赛季 140海",
      "第二赛季 150红",
      "第二赛季 160金",
      "第二赛季 160海",
      "第二赛季 170红",
      "第二赛季 180海",
      "第三赛季 220金",
      "第三赛季 220海",
      "第三赛季 240金",
      "第三赛季 240海",
      "第三赛季 250红",
      "第三赛季 260金",
      "第三赛季 260海",
      "第三赛季 270红",
      "第三赛季 280海"
    ],

    // 大词条、小词条、重铸词条共用选项。
    affix: [
      "暴击",
      "急速",
      "幸运",
      "精通",
      "全能"
    ],

    // 特殊词条。海武器最多选择 4 个。
    special: [
      "技能强化",
      "幸运强化",
      "元素强化",
      "暴击强化",
      "全能强化",
      "赛季强化",
      "召唤物强化"
    ],

    // 印记词条。
    imprint: [
      "暴击印记",
      "急速印记",
      "幸运印记",
      "精通印记",
      "全能印记",
      "元素印记",
      "物魔印记",
      "赛季印记"
    ],

    // 右侧短选框档位。
    affixRank: ["1", "2", "3", "4", "5"]
  },

  // 装备词条固定值。key 使用去掉赛季前缀后的装备类型名称。
  // 普通装备：大词条、小词条、重铸词条、主属性。
  // 武器：大词条、小词条、重铸词条、主属性、攻击力。
  values: {
    equipment: {
      "40金": { majorAffix: 100, minorAffix: 50, reforgeAffix: 30, mainAttribute: 90 },
      "60金": { majorAffix: 140, minorAffix: 70, reforgeAffix: 42, mainAttribute: 126 },
      "60套装": { majorAffix: 140, minorAffix: 140, reforgeAffix: 42, mainAttribute: 126 },
      "80金": { majorAffix: 200, minorAffix: 100, reforgeAffix: 60, mainAttribute: 180 },
      "80套装": { majorAffix: 200, minorAffix: 200, reforgeAffix: 60, mainAttribute: 180 },
      "120金": { majorAffix: 450, minorAffix: 225, reforgeAffix: 135, mainAttribute: 236 },
      "140金": { majorAffix: 756, minorAffix: 378, reforgeAffix: 226, mainAttribute: 268 },
      "150套装": { majorAffix: 828, minorAffix: 828, reforgeAffix: 226, mainAttribute: 288 },
      "160金": { majorAffix: 954, minorAffix: 477, reforgeAffix: 286, mainAttribute: 320 },
      "170套装": { majorAffix: 1035, minorAffix: 1035, reforgeAffix: 286, mainAttribute: 352 },
      "220金": { majorAffix: 1710, minorAffix: 855, reforgeAffix: 513, mainAttribute: 408 },
      "240金": { majorAffix: 2370, minorAffix: 1185, reforgeAffix: 711, mainAttribute: 432 },
      "250套装": { majorAffix: 2700, minorAffix: 2700, reforgeAffix: 711, mainAttribute: 456 },
      "260金": { majorAffix: 3000, minorAffix: 1500, reforgeAffix: 900, mainAttribute: 480 },
      "270套装": { majorAffix: 3300, minorAffix: 3300, reforgeAffix: 900, mainAttribute: 528 }
    },

    weapon: {
      "40金": { majorAffix: 200, minorAffix: 100, reforgeAffix: 60, mainAttribute: 90, attack: 50 },
      "60金": { majorAffix: 280, minorAffix: 140, reforgeAffix: 84, mainAttribute: 126, attack: 70 },
      "70红": { majorAffix: 300, minorAffix: 300, reforgeAffix: 0, mainAttribute: 153, attack: 85 },
      "80金": { majorAffix: 400, minorAffix: 200, reforgeAffix: 120, mainAttribute: 180, attack: 100 },
      "90红": { majorAffix: 384, minorAffix: 384, reforgeAffix: 0, mainAttribute: 205, attack: 114 },
      "100海": { majorAffix: 0, minorAffix: 0, reforgeAffix: 0, mainAttribute: 231, attack: 128 },
      "120金": { majorAffix: 900, minorAffix: 450, reforgeAffix: 270, mainAttribute: 236, attack: 133 },
      "140金": { majorAffix: 1512, minorAffix: 756, reforgeAffix: 452, mainAttribute: 268, attack: 151 },
      "140海": { majorAffix: 702, minorAffix: 702, reforgeAffix: 0, mainAttribute: 268, attack: 151 },
      "150红": { majorAffix: 1966, minorAffix: 1966, reforgeAffix: 0, mainAttribute: 288, attack: 162 },
      "160金": { majorAffix: 1908, minorAffix: 954, reforgeAffix: 572, mainAttribute: 320, attack: 180 },
      "160海": { majorAffix: 983, minorAffix: 983, reforgeAffix: 0, mainAttribute: 364, attack: 205 },
      "170红": { majorAffix: 2480, minorAffix: 2480, reforgeAffix: 0, mainAttribute: 364, attack: 205 },
      "180海": { majorAffix: 1240, minorAffix: 1240, reforgeAffix: 0, mainAttribute: 400, attack: 225 },
      "220金": { majorAffix: 3420, minorAffix: 1710, reforgeAffix: 1026, mainAttribute: 408, attack: 229 },
      "220海": { majorAffix: 1710, minorAffix: 1710, reforgeAffix: 0, mainAttribute: 400, attack: 225 },
      "240金": { majorAffix: 4740, minorAffix: 2370, reforgeAffix: 1422, mainAttribute: 432, attack: 243 },
      "240海": { majorAffix: 2370, minorAffix: 2370, reforgeAffix: 0, mainAttribute: 456, attack: 256 },
      "250红": { majorAffix: 2700, minorAffix: 2700, reforgeAffix: 0, mainAttribute: 456, attack: 256 },
      "260金": { majorAffix: 6000, minorAffix: 3000, reforgeAffix: 1800, mainAttribute: 480, attack: 270 },
      "260海": { majorAffix: 2700, minorAffix: 2700, reforgeAffix: 0, mainAttribute: 547, attack: 307 },
      "270红": { majorAffix: 7800, minorAffix: 7800, reforgeAffix: 0, mainAttribute: 547, attack: 307 },
      "280海": { majorAffix: 3900, minorAffix: 3900, reforgeAffix: 0, mainAttribute: 600, attack: 337 }
    }
  },

  // 非武器部位不可刷出的词条列表。
  // 这里只影响大词条、小词条；重铸词条不受限制。
  // 词条名称必须和 options.affix 中完全一致。
  // 按部位 + 主属性配置；当前职业流派切换到对应主属性时生效。
  // 可用主属性键：力量、敏捷、智力、自定义。
  // 示例：
  // helmet: {
  //   力量: ["幸运"],
  //   敏捷: [],
  //   智力: [],
  //   自定义: []
  // }
  affixBlocklist: {
    helmet: { 力量: ["全能"], 敏捷: ["急速"], 智力: ["暴击"], 自定义: [] },
    armor: { 力量: ["幸运"], 敏捷: ["精通"], 智力: ["暴击"], 自定义: [] },
    gloves: { 力量: ["急速"], 敏捷: ["暴击"], 智力: ["全能"], 自定义: [] },
    shoes: { 力量: ["精通"], 敏捷: ["暴击"], 智力: ["幸运"], 自定义: [] },
    earring: { 力量: ["精通"], 敏捷: ["急速"], 智力: ["全能"], 自定义: [] },
    necklace: { 力量: ["急速"], 敏捷: ["精通"], 智力: ["幸运"], 自定义: [] },
    ring: { 力量: ["幸运"], 敏捷: ["全能"], 智力: ["精通"], 自定义: [] },
    leftBracelet: { 力量: ["暴击"], 敏捷: ["全能"], 智力: ["急速"], 自定义: [] },
    rightBracelet: { 力量: ["暴击"], 敏捷: ["幸运"], 智力: ["精通"], 自定义: [] },
    talisman: { 力量: ["全能"], 敏捷: ["幸运"], 智力: ["急速"], 自定义: [] }
  }
};
