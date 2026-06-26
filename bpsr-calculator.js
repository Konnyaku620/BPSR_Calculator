const STORAGE_KEY = "bpsr-calculator-state-v1";
const DEFAULT_VERSION = 12;

const SEASON_CONSTANTS = {
  1: { rating: 4460, versatility: 2500, element: 4460 },
  2: { rating: 19975, versatility: 11200, element: 6490 },
  3: { rating: 50000, versatility: 28000, element: 11000 }
};

const FIELD_SECTIONS = [
  {
    id: "attack",
    title: "攻击与技能",
    fields: [
      { id: "panelAttack", label: "面板攻击", type: "number", value: 0, step: 1 },
      { id: "mainAttribute", label: "主属性", type: "number", value: 0, step: 1 },
      { id: "refinedAttack", label: "精炼攻击", type: "number", value: 0, step: 1 },
      { id: "elementAttack", label: "元素攻击", type: "number", value: 0, step: 1 },
      { id: "resistanceCoeff", label: "伤害类型系数", type: "number", value: 0.7, step: 0.01, locked: true },
      { id: "skillPreset", label: "技能", type: "select", value: "custom", options: [
        { value: "custom", label: "自定义" },
        { value: "skill1", label: "技能1" },
        { value: "skill2", label: "技能2" }
      ] },
      { id: "skillRate", label: "技能倍率", type: "percent", value: 0, step: 0.1 },
      { id: "flatDamage", label: "固定伤害", type: "number", value: 0, step: 1 }
    ]
  },
  {
    title: "固定值转化",
    fields: [
      { id: "crit", label: "暴击固定值", type: "number", value: 0, step: 1 },
      { id: "haste", label: "急速固定值", type: "number", value: 0, step: 1 },
      { id: "luck", label: "幸运固定值", type: "number", value: 0, step: 1 },
      { id: "mastery", label: "精通固定值", type: "number", value: 0, step: 1 },
      { id: "versatility", label: "全能固定值", type: "number", value: 0, step: 1 },
      { id: "singleElementFixed", label: "单元素加伤固定值", type: "number", value: 0, step: 1 },
      { id: "allElementFixed", label: "全元素加伤固定值", type: "number", value: 0, step: 1 },
      { id: "physMagicFixed", label: "物魔增效固定值", type: "number", value: 0, step: 1 }
    ]
  },
  {
    title: "一般与元素加伤",
    fields: [
      { id: "generalDamageBonus", label: "伤害增加", type: "percent", value: 0, step: 0.1 },
      { id: "specialSkillBonus", label: "特殊/专精技能", type: "percent", value: 0, step: 0.1 },
      { id: "rangeSkillBonus", label: "远近技能伤害", type: "percent", value: 0, step: 0.1 },
      { id: "vulnerableBonus", label: "易伤", type: "percent", value: 0, step: 0.1 },
      { id: "petDamageBonus", label: "宠物伤害", type: "percent", value: 0, step: 0.1 },
      { id: "otherDamageBonus", label: "其他加伤", type: "percent", value: 0, step: 0.1 },
      { id: "singleElementBonus", label: "单元素加伤", type: "percent", value: 0, step: 0.1 },
      { id: "allElementBonus", label: "全元素加伤", type: "percent", value: 0, step: 0.1 }
    ]
  },
  {
    title: "独立乘区",
    fields: [
      { id: "versatilityBonus", label: "全能百分比修正", type: "percent", value: 0, step: 0.1 },
      { id: "extraCritMultiplier", label: "爆伤增加", type: "percent", value: 0, step: 0.1 },
      { id: "finalDamageBonus", label: "最终加伤", type: "percent", value: 0, step: 0.1 },
      { id: "physMagicBonus", label: "物魔增效百分比", type: "percent", value: 0, step: 0.1 },
      { id: "seasonDamageBonus", label: "赛季加伤", type: "percent", value: 0, step: 0.1 },
      { id: "seasonSuppressBonus", label: "赛季压制", type: "percent", value: 0, step: 0.1 }
    ]
  },
  {
    title: "幸运伤害",
    fields: [
      { id: "luckyBaseMultiplier", label: "幸运一击基础倍率", type: "percent", value: 40, step: 0.1, locked: true, fixed: true },
      { id: "luckyEffectRate", label: "幸运效果倍率", type: "percent", value: 0, step: 0.1 },
      { id: "luckyDamageBonus", label: "幸运效果加伤", type: "percent", value: 0, step: 0.1 }
    ]
  }
];

const DERIVED_LABELS = {
  ratingConstant: "暴击/急速/幸运/精通常数",
  versatilityConstant: "全能常数",
  elementConstant: "元素/物魔常数",
  critPct: "暴击面板百分比",
  hastePct: "急速面板百分比",
  luckPct: "幸运面板百分比",
  masteryPct: "精通面板百分比",
  versatilityPct: "全能转化百分比",
  versatilityTotal: "全能总百分比",
  singleElementFixedPercent: "单元素固定转百分比",
  allElementFixedPercent: "全元素固定转百分比",
  physMagicFixedPercent: "物魔固定转百分比",
  critExtraMultiplier: "实际额外爆伤倍率",
  critDamageTotal: "实际暴击伤害",
  attackZone: "攻击力乘区",
  skillBase: "倍率乘区",
  generalBonusTotal: "一般加伤合计",
  generalMultiplier: "一般加伤乘区",
  elementBonusTotal: "元素加伤合计",
  elementMultiplier: "元素加伤乘区",
  versatilityMultiplier: "全能加伤乘区",
  critMultiplier: "暴击爆伤期望乘区",
  finalMultiplier: "最终加伤乘区",
  physMagicMultiplier: "物魔增效乘区",
  seasonDamageMultiplier: "赛季加伤乘区",
  seasonSuppressMultiplier: "赛季压制乘区",
  luckyMultiplier: "幸运一击倍率",
  luckyGeneralMultiplier: "幸运一击一般乘区",
  luckyEffectGeneralMultiplier: "幸运效果一般乘区",
  luckyHitDamage: "幸运一击单次伤害",
  luckyExpectedDamage: "幸运一击期望伤害",
  otherLuckyEffectDamage: "其他幸运效果伤害"
};

const DEFAULT_FORMULAS = [
  {
    id: "skillDamage",
    label: "技能伤害",
    format: "number",
    formula: "skillBase * generalMultiplier * elementMultiplier * versatilityMultiplier * critMultiplier * finalMultiplier * physMagicMultiplier * seasonDamageMultiplier * seasonSuppressMultiplier"
  },
  {
    id: "luckyExpected",
    label: "幸运一击期望",
    format: "number",
    formula: "luckyExpectedDamage"
  },
  {
    id: "otherLuckyDamage",
    label: "其他幸运效果",
    format: "number",
    formula: "otherLuckyEffectDamage"
  },
  {
    id: "attackZoneResult",
    label: "攻击力乘区",
    format: "number",
    formula: "attackZone"
  },
  {
    id: "skillBaseResult",
    label: "倍率乘区",
    format: "number",
    formula: "skillBase"
  },
  {
    id: "elementZone",
    label: "元素乘区",
    format: "multiplier",
    formula: "elementMultiplier"
  },
  {
    id: "versatilityZone",
    label: "全能乘区",
    format: "multiplier",
    formula: "versatilityMultiplier"
  },
  {
    id: "critZone",
    label: "暴击期望乘区",
    format: "multiplier",
    formula: "critMultiplier"
  }
];

const PRESETS = {
  custom: {
    label: "自定义",
    damageType: null,
    mainAttribute: null
  },
  frost_mage_ice_spear: { label: "冰魔导师-冰矛流", damageType: "0.92", mainAttribute: "智力" },
  frost_mage_ray: { label: "冰魔导师-射线流", damageType: "0.92", mainAttribute: "智力" },
  marksman_beast: { label: "神射手-驭兽流", damageType: "0.7", mainAttribute: "敏捷" },
  marksman_eagle: { label: "神射手-驯鹰流", damageType: "0.7", mainAttribute: "敏捷" },
  stormblade_iai: { label: "雷影剑士-居合斩流", damageType: "0.7", mainAttribute: "敏捷" },
  stormblade_moonblade: { label: "雷影剑士-月刃召唤流", damageType: "0.7", mainAttribute: "敏捷" },
  wind_knight_air: { label: "青岚骑士-空战流", damageType: "0.7", mainAttribute: "力量" },
  wind_knight_heavy: { label: "青岚骑士-重装流", damageType: "0.7", mainAttribute: "力量" },
  verdant_oracle_heal: { label: "森语者-愈合流", damageType: "0.92", mainAttribute: "智力" },
  verdant_oracle_punish: { label: "森语者-惩击流", damageType: "0.92", mainAttribute: "智力" },
  heavy_guardian_rockshield: { label: "巨刃守护者-岩盾流", damageType: "0.7", mainAttribute: "力量" },
  heavy_guardian_block: { label: "巨刃守护者-格挡流", damageType: "0.7", mainAttribute: "力量" },
  shield_knight_guard: { label: "神盾骑士-防护回复流", damageType: "0.7", mainAttribute: "力量" },
  shield_knight_lightshield: { label: "神盾骑士-光盾回复流", damageType: "0.7", mainAttribute: "力量" },
  beat_performer_crazy: { label: "灵魂乐手-狂音流", damageType: "0.92", mainAttribute: "智力" },
  beat_performer_concerto: { label: "灵魂乐手-协奏流", damageType: "0.92", mainAttribute: "智力" },
  twin_striker_formless: { label: "赤炎狂战士-无相专精流", damageType: "0.7", mainAttribute: "力量" },
  twin_striker_crimson: { label: "赤炎狂战士-赤红专精流", damageType: "0.7", mainAttribute: "力量" }
};

const LEGACY_PRESET_KEYS = {
  ice_mage_ice_spear: "frost_mage_ice_spear",
  ice_mage_ray: "frost_mage_ray",
  soul_musician_crazy: "beat_performer_crazy",
  soul_musician_concerto: "beat_performer_concerto",
  greatblade_guardian_rockshield: "heavy_guardian_rockshield",
  greatblade_guardian_block: "heavy_guardian_block",
  sharpshooter_beast: "marksman_beast",
  sharpshooter_eagle: "marksman_eagle",
  thunder_swordsman_iai: "stormblade_iai",
  thunder_swordsman_moonblade: "stormblade_moonblade",
  flame_berserker_formless: "twin_striker_formless",
  flame_berserker_crimson: "twin_striker_crimson",
  forest_speaker_heal: "verdant_oracle_heal",
  forest_speaker_punish: "verdant_oracle_punish",
  azure_knight_air: "wind_knight_air",
  azure_knight_heavy: "wind_knight_heavy"
};

const PANEL_AFFIX_ORDER = ["暴击", "急速", "幸运", "精通", "全能"];

const PRESET_RECOMMENDED_AFFIXES = {
  heavy_guardian_rockshield: ["精通", "全能"],
  heavy_guardian_block: ["幸运", "精通"],
  stormblade_iai: ["暴击", "精通"],
  stormblade_moonblade: ["急速", "幸运"],
  wind_knight_heavy: ["急速", "精通"],
  wind_knight_air: ["暴击", "幸运"],
  marksman_beast: ["急速", "精通"],
  marksman_eagle: ["暴击", "急速"],
  frost_mage_ice_spear: ["暴击", "幸运"],
  frost_mage_ray: ["急速", "精通"],
  verdant_oracle_punish: ["幸运", "精通"],
  verdant_oracle_heal: ["急速", "精通"],
  shield_knight_guard: ["暴击", "精通"],
  shield_knight_lightshield: ["急速", "精通"],
  beat_performer_crazy: ["幸运", "急速"],
  beat_performer_concerto: ["暴击", "急速"],
  twin_striker_formless: ["幸运", "精通"],
  twin_striker_crimson: ["暴击", "急速"]
};

const FORMATTERS = {
  number: value => formatNumber(value),
  percent: value => `${formatNumber(value * 100)}%`,
  multiplier: value => `x ${formatNumber(value)}`
};

const FUNCTION_LIBRARY = {
  abs: Math.abs,
  ceil: Math.ceil,
  floor: Math.floor,
  max: Math.max,
  min: Math.min,
  pow: Math.pow,
  round: Math.round,
  sqrt: Math.sqrt,
  clamp: (value, min, max) => Math.min(Math.max(value, min), max)
};

const PANEL_ATTRIBUTES = [
  { label: "暴击", percentKey: "critPct", ratingKey: "crit" },
  { label: "急速", percentKey: "hastePct", ratingKey: "haste" },
  { label: "幸运", percentKey: "luckPct", ratingKey: "luck" },
  { label: "精通", percentKey: "masteryPct", ratingKey: "mastery" },
  { label: "全能", percentKey: "versatilityPct", ratingKey: "versatility" }
];

const EQUIPMENT_REFERENCE = window.BPSR_EQUIPMENT_REFERENCE || {};

const EQUIPMENT_SLOTS = EQUIPMENT_REFERENCE.slots || [
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
];

const EQUIPMENT_COLUMNS = [
  { key: "type", label: "装备类型", optionsKey: "type" },
  { key: "majorAffix", shortKey: "majorAffixRank", label: "大词条", optionsKey: "affix", pair: true },
  { key: "minorAffix", shortKey: "minorAffixRank", label: "小词条", optionsKey: "affix", pair: true },
  { key: "reforgeAffix", shortKey: "reforgeAffixRank", label: "重铸词条", optionsKey: "affix", pair: true },
  { key: "specialAffix", shortKey: "specialAffixRank", label: "特殊词条", optionsKey: "special", pair: true },
  { key: "imprintAffix", shortKey: "imprintAffixRank", label: "印记词条", optionsKey: "imprint", pair: true }
];

const DEFAULT_EQUIPMENT_OPTIONS = {
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
    "第三赛季 240金",
    "第三赛季 240海",
    "第三赛季 250红",
    "第三赛季 260金",
    "第三赛季 260海",
    "第三赛季 270红",
    "第三赛季 280海"
  ],
  affix: [
    "面板攻击",
    "精炼攻击",
    "元素攻击",
    "暴击",
    "急速",
    "幸运",
    "精通",
    "全能",
    "伤害增加",
    "特殊/专精技能",
    "远近技能伤害",
    "易伤",
    "宠物伤害",
    "单元素加伤",
    "全元素加伤",
    "物魔增效",
    "最终加伤",
    "赛季加伤",
    "赛季压制"
  ],
  special: ["技能强化", "幸运强化", "元素强化", "暴击强化", "全能强化", "赛季强化", "召唤物强化"],
  imprint: ["暴击印记", "急速印记", "幸运印记", "精通印记", "全能印记", "元素印记", "物魔印记", "赛季印记"],
  affixRank: ["1", "2", "3", "4", "5"]
};

const EQUIPMENT_OPTIONS = {
  ...DEFAULT_EQUIPMENT_OPTIONS,
  ...(EQUIPMENT_REFERENCE.options || {})
};
const EQUIPMENT_VALUES = EQUIPMENT_REFERENCE.values || {};
const EQUIPMENT_AFFIX_BLOCKLIST = EQUIPMENT_REFERENCE.affixBlocklist || {};
const FIXED_VALUE_AFFIX_KEYS = new Set(["majorAffix", "minorAffix", "reforgeAffix"]);
const RECOMMENDED_MARK = " 👍︎";
const EQUIPMENT_AFFIX_CONTEXT_MAP = {
  暴击: { key: "crit", type: "number" },
  急速: { key: "haste", type: "number" },
  幸运: { key: "luck", type: "number" },
  精通: { key: "mastery", type: "number" },
  全能: { key: "versatility", type: "number" }
};
const RED_WEAPON_SPECIAL_BY_PRESET = {
  beat_performer_crazy: "幸运效果伤害+15%",
  beat_performer_concerto: "暴击治疗+15%",
  shield_knight_guard: "暴击伤害+15%",
  shield_knight_lightshield: "近距离伤害+8%",
  marksman_beast: "远距离伤害+8%",
  marksman_eagle: "暴击伤害+15%",
  stormblade_iai: "暴击伤害+15%",
  stormblade_moonblade: "幸运+6%",
  verdant_oracle_heal: "治疗强度+5%",
  verdant_oracle_punish: "远距离伤害+8%",
  wind_knight_heavy: "近距离伤害+8%",
  wind_knight_air: "幸运一击倍率+20%",
  heavy_guardian_rockshield: "护盾强度+8%",
  heavy_guardian_block: "幸运+6%",
  frost_mage_ice_spear: "暴击伤害+15%",
  frost_mage_ray: "远距离伤害+8%"
};
const PRESET_ELEMENT_LABEL_BY_PRESET = {
  frost_mage_ice_spear: "冰元素",
  frost_mage_ray: "冰元素",
  shield_knight_guard: "光元素",
  shield_knight_lightshield: "光元素",
  marksman_beast: "光元素",
  marksman_eagle: "光元素",
  verdant_oracle_heal: "森元素",
  verdant_oracle_punish: "森元素",
  heavy_guardian_rockshield: "岩元素",
  heavy_guardian_block: "岩元素",
  stormblade_iai: "雷元素",
  stormblade_moonblade: "雷元素",
  wind_knight_air: "风元素",
  wind_knight_heavy: "风元素",
  beat_performer_crazy: "火元素",
  beat_performer_concerto: "火元素",
  twin_striker_formless: "火元素",
  twin_striker_crimson: "火元素"
};
const NO_SET_EQUIPMENT_SLOT_IDS = new Set(["earring", "necklace", "ring", "talisman"]);

let state = createInitialState();

const inputSectionsEl = document.querySelector("#inputSections");
const equipmentBuilderEl = document.querySelector("#equipmentBuilder");
const customInputsEl = document.querySelector("#customInputs");
const formulaEditorEl = document.querySelector("#formulaEditor");
const primaryResultsEl = document.querySelector("#primaryResults");
const panelAttributesEl = document.querySelector("#panelAttributes");
const variableListEl = document.querySelector("#variableList");
const saveStatusEl = document.querySelector("#saveStatus");
const calcStatusEl = document.querySelector("#calcStatus");
const seasonSelectEl = document.querySelector("#seasonSelect");
const presetSelectEl = document.querySelector("#presetSelect");
const fileInputEl = document.querySelector("#fileInput");

renderAll();
calculate();

document.querySelector("#exportConfig").addEventListener("click", exportConfig);
document.querySelector("#importConfig").addEventListener("click", () => fileInputEl.click());
document.querySelector("#resetDefaults").addEventListener("click", resetDefaults);
document.querySelector("#addCustomInput").addEventListener("click", addCustomInput);
document.querySelector("#addFormula").addEventListener("click", addFormula);

fileInputEl.addEventListener("change", importConfig);

seasonSelectEl.addEventListener("change", event => {
  state.season = event.target.value;
  state.equipment = normalizeEquipment(state.equipment, state.season);
  renderEquipmentBuilder();
  calculate();
  saveState();
});

presetSelectEl.addEventListener("change", event => {
  applyPreset(event.target.value);
  event.target.value = state.preset || "custom";
});

document.querySelector("#resistanceButtons").addEventListener("click", event => {
  if (!canEditDamageType()) return;

  const button = event.target.closest("button[data-resistance]");
  if (!button) return;

  state.resistanceMode = button.dataset.resistance;
  state.fields.resistanceCoeff = Number(state.resistanceMode);

  syncFieldInputs();
  updateResistanceButtons();
  calculate();
  saveState();
});

inputSectionsEl.addEventListener("input", event => {
  const input = event.target.closest("[data-field-id]");
  if (!input) return;
  state.fields[input.dataset.fieldId] = readFieldInputValue(input);
  calculate();
  saveState();
});

inputSectionsEl.addEventListener("change", event => {
  const input = event.target.closest("select[data-field-id]");
  if (!input) return;
  state.fields[input.dataset.fieldId] = readFieldInputValue(input);
  calculate();
  saveState();
});

equipmentBuilderEl.addEventListener("change", event => {
  const select = event.target.closest("[data-equipment-slot][data-equipment-field]");
  if (!select) return;

  const slot = select.dataset.equipmentSlot;
  const field = select.dataset.equipmentField;
  if (!state.equipment[slot]) return;

  const equipmentIndex = select.dataset.equipmentIndex;
  if (equipmentIndex !== undefined) {
    const values = Array.isArray(state.equipment[slot][field]) ? [...state.equipment[slot][field]] : [];
    const index = Number(equipmentIndex);
    values[index] = select.value;
    if ((index === 0 || index === 1) && values[0] && values[0] === values[1]) {
      values[index === 0 ? 1 : 0] = "";
    }
    state.equipment[slot][field] = values;
  } else {
    state.equipment[slot][field] = select.multiple
      ? Array.from(select.selectedOptions).map(option => option.value)
      : select.value;
  }
  normalizeWeaponAffixShape(state.equipment[slot], field);
  normalizeExclusiveEquipmentAffixes(state.equipment[slot], field);
  if (field === "type") {
    const slotConfig = EQUIPMENT_SLOTS.find(item => item.id === slot) || { id: slot };
    applyRedWeaponSpecialAffix(slotConfig, state.equipment[slot], state.season);
    applyLowLevelSeaWeaponSpecialAffix(slotConfig, state.equipment[slot]);
    applyUnavailableWeaponAffixes(slotConfig, state.equipment[slot]);
    applyUnavailableSetSpecialAffix(slotConfig, state.equipment[slot]);
    applyRecommendedEquipmentAffixes(state.equipment[slot]);
    normalizeExclusiveEquipmentAffixes(state.equipment[slot], field);
  }
  if (field === "type" || field === "majorAffix" || field === "minorAffix" || equipmentIndex !== undefined) {
    renderEquipmentBuilder();
  }
  calculate();
  saveState();
});

equipmentBuilderEl.addEventListener("click", event => {
  const toggle = event.target.closest("[data-equipment-multi-toggle]");
  if (toggle) {
    if (toggle.disabled) return;
    const menu = toggle.nextElementSibling;
    if (menu) {
      menu.classList.toggle("open");
    }
    return;
  }

  const checkbox = event.target.closest("[data-equipment-multi-option]");
  if (!checkbox) return;
  if (checkbox.disabled) return;

  const slot = checkbox.dataset.equipmentSlot;
  const field = checkbox.dataset.equipmentField;
  if (!state.equipment[slot]) return;

  const dropdown = checkbox.closest(".equipment-multi-dropdown");
  const checkedValues = Array.from(dropdown.querySelectorAll("[data-equipment-multi-option]:checked")).map(item => item.value);

  if (checkedValues.length > 4) {
      checkbox.checked = false;
      return;
  }

  state.equipment[slot][field] = checkedValues;
  updateEquipmentMultiToggleLabel(checkbox, checkedValues);
  saveState();
});

customInputsEl.addEventListener("input", event => {
  const input = event.target.closest("[data-custom-index]");
  if (!input) return;
  const index = Number(input.dataset.customIndex);
  const field = input.dataset.customField;
  const item = state.customInputs[index];
  if (!item) return;

  item[field] = field === "value" ? readNumericInput(input.value) : input.value;
  calculate();
  saveState();
});

customInputsEl.addEventListener("change", event => {
  const input = event.target.closest("[data-custom-index]");
  if (!input) return;
  const index = Number(input.dataset.customIndex);
  const field = input.dataset.customField;
  const item = state.customInputs[index];
  if (!item) return;

  item[field] = field === "value" ? readNumericInput(input.value) : input.value;
  calculate();
  saveState();
});

customInputsEl.addEventListener("click", event => {
  const button = event.target.closest("[data-remove-custom]");
  if (!button) return;
  state.customInputs.splice(Number(button.dataset.removeCustom), 1);
  renderCustomInputs();
  calculate();
  saveState();
});

formulaEditorEl.addEventListener("input", event => {
  const input = event.target.closest("[data-formula-index]");
  if (!input) return;
  const index = Number(input.dataset.formulaIndex);
  const field = input.dataset.formulaField;
  const item = state.formulas[index];
  if (!item) return;

  item[field] = input.value;
  calculate();
  saveState();
});

formulaEditorEl.addEventListener("change", event => {
  const input = event.target.closest("[data-formula-index]");
  if (!input) return;
  const index = Number(input.dataset.formulaIndex);
  const field = input.dataset.formulaField;
  const item = state.formulas[index];
  if (!item) return;

  item[field] = input.value;
  calculate();
  saveState();
});

formulaEditorEl.addEventListener("click", event => {
  const button = event.target.closest("[data-remove-formula]");
  if (!button) return;
  state.formulas.splice(Number(button.dataset.removeFormula), 1);
  renderFormulaEditor();
  calculate();
  saveState();
});

function createInitialState() {
  const saved = loadState();
  const defaults = createDefaultState();
  if (!saved) return defaults;

  try {
    const next = normalizeState({
      ...defaults,
      ...saved,
      fields: { ...defaults.fields, ...(saved.fields || {}) },
      equipment: saved.equipment || defaults.equipment,
      formulas: Array.isArray(saved.formulas) && saved.formulas.length ? saved.formulas : defaults.formulas,
      customInputs: Array.isArray(saved.customInputs) ? saved.customInputs : defaults.customInputs
    });

    migrateLegacyDefaultValues(next, saved);
    return next;
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
    return defaults;
  }
}

function createDefaultState() {
  const fields = {};
  FIELD_SECTIONS.flatMap(section => section.fields).forEach(field => {
    fields[field.id] = field.value;
  });

  return {
    defaultVersion: DEFAULT_VERSION,
    season: "3",
    preset: "custom",
    resistanceMode: "0.7",
    fields,
    equipment: createDefaultEquipment("3"),
    customInputs: [],
    formulas: DEFAULT_FORMULAS.map(item => ({ ...item }))
  };
}

function normalizeState(rawState) {
  const normalizedFields = migrateLegacyFieldNames(rawState.fields || {});
  const normalizedSeason = String(rawState.season || "3");
  const normalizedPreset = normalizePreset(rawState.preset);
  const next = {
    defaultVersion: Number(rawState.defaultVersion) || DEFAULT_VERSION,
    season: normalizedSeason,
    preset: normalizedPreset,
    resistanceMode: rawState.resistanceMode || detectResistanceMode(rawState.fields?.resistanceCoeff ?? 0.7),
    fields: { ...normalizedFields },
    equipment: normalizeEquipment(rawState.equipment, normalizedSeason, normalizedPreset),
    customInputs: Array.isArray(rawState.customInputs) ? rawState.customInputs : [],
    formulas: Array.isArray(rawState.formulas) ? rawState.formulas : []
  };

  FIELD_SECTIONS.flatMap(section => section.fields).forEach(field => {
    if (field.type === "select") {
      next.fields[field.id] = normalizeFieldSelectValue(field, next.fields[field.id]);
    } else if (field.fixed) {
      next.fields[field.id] = field.value;
    } else if (!Number.isFinite(Number(next.fields[field.id]))) {
      next.fields[field.id] = field.value;
    } else {
      next.fields[field.id] = Number(next.fields[field.id]);
    }
  });

  next.resistanceMode = detectResistanceMode(next.resistanceMode === "0.92" ? 0.92 : next.fields.resistanceCoeff);
  next.fields.resistanceCoeff = Number(next.resistanceMode);
  applyPresetDamageType(next);

  next.customInputs = next.customInputs.map((item, index) => ({
    label: item.label || `自定义变量 ${index + 1}`,
    key: sanitizeKey(item.key) || `custom${index + 1}`,
    type: item.type === "percent" ? "percent" : "number",
    value: Number.isFinite(Number(item.value)) ? Number(item.value) : 0
  }));

  next.formulas = next.formulas.map((item, index) => ({
    id: sanitizeKey(item.id) || `result${index + 1}`,
    label: item.label || `结果 ${index + 1}`,
    format: ["number", "percent", "multiplier"].includes(item.format) ? item.format : "number",
    formula: migrateLegacyFormulaVariables(item.formula || "0")
  })).filter(item => !isOldDefaultPanelFormula(item));

  if (!SEASON_CONSTANTS[next.season]) {
    next.season = "3";
  }

  return next;
}

function migrateLegacyFieldNames(fields) {
  const next = { ...fields };
  const pairs = {
    critRating: "crit",
    hasteRating: "haste",
    luckRating: "luck",
    masteryRating: "mastery",
    allPowerRating: "versatility",
    allPowerBonus: "versatilityBonus"
  };

  Object.entries(pairs).forEach(([oldKey, newKey]) => {
    if (Object.prototype.hasOwnProperty.call(next, oldKey) && !Object.prototype.hasOwnProperty.call(next, newKey)) {
      next[newKey] = next[oldKey];
    }
    delete next[oldKey];
  });

  return next;
}

function migrateLegacyFormulaVariables(formula) {
  return String(formula || "0")
    .replace(/\ballPowerConstant\b/g, "versatilityConstant")
    .replace(/\bcritPercent\b/g, "critPct")
    .replace(/\bhastePercent\b/g, "hastePct")
    .replace(/\bluckPercent\b/g, "luckPct")
    .replace(/\bmasteryPercent\b/g, "masteryPct")
    .replace(/\ballPowerPercent\b/g, "versatilityPct")
    .replace(/\ballPowerTotal\b/g, "versatilityTotal")
    .replace(/\ballPowerMultiplier\b/g, "versatilityMultiplier")
    .replace(/\bcritRating\b/g, "crit")
    .replace(/\bhasteRating\b/g, "haste")
    .replace(/\bluckRating\b/g, "luck")
    .replace(/\bmasteryRating\b/g, "mastery")
    .replace(/\ballPowerRating\b/g, "versatility")
    .replace(/\ballPowerBonus\b/g, "versatilityBonus");
}

function normalizePreset(value) {
  const text = String(value || "");
  const migrated = LEGACY_PRESET_KEYS[text] || text;
  return Object.prototype.hasOwnProperty.call(PRESETS, migrated) ? migrated : "custom";
}

function normalizeFieldSelectValue(field, value) {
  const text = String(value || field.value || "");
  const options = Array.isArray(field.options) ? field.options : [];
  return options.some(option => option.value === text) ? text : field.value;
}

function applyPresetDamageType(targetState) {
  const preset = PRESETS[targetState.preset] || PRESETS.custom;
  if (!preset.damageType) return;

  targetState.resistanceMode = preset.damageType;
  targetState.fields.resistanceCoeff = Number(preset.damageType);
}

function canEditDamageType() {
  return state.preset === "custom";
}

function getCurrentMainAttribute() {
  const preset = PRESETS[state.preset] || PRESETS.custom;
  return preset.mainAttribute || "自定义";
}

function getFieldLabel(field) {
  const mainAttribute = getCurrentMainAttribute();
  if (field.id === "mainAttribute" && mainAttribute !== "自定义") {
    return mainAttribute;
  }

  return field.label;
}

function createDefaultEquipment(season = state?.season || "3") {
  return EQUIPMENT_SLOTS.reduce((items, slot) => {
    items[slot.id] = EQUIPMENT_COLUMNS.reduce((row, column) => {
      row[column.key] = "";
      if (column.shortKey) {
        row[column.shortKey] = "";
      }
      return row;
    }, {});
    return items;
  }, {});
}

function normalizeEquipment(rawEquipment, season = getActiveSeason(), preset = getActivePreset()) {
  const equipment = createDefaultEquipment(season);
  const source = rawEquipment && typeof rawEquipment === "object" ? rawEquipment : {};

  EQUIPMENT_SLOTS.forEach(slot => {
    const savedRow = source[slot.id] && typeof source[slot.id] === "object" ? source[slot.id] : {};
    EQUIPMENT_COLUMNS.forEach(column => {
      if (isWeaponSpecialColumn(slot, column)) {
        if (isSeaWeaponType(equipment[slot.id].type)) {
          equipment[slot.id][column.key] = isLowLevelSeaWeaponType(equipment[slot.id].type)
            ? normalizeEquipmentMultiValues(getLowLevelSeaWeaponSpecialOptions(), savedRow[column.key])
            : normalizeHighLevelSeaWeaponSpecialValues(savedRow[column.key]);
        } else if (isRedWeaponType(equipment[slot.id].type)) {
          equipment[slot.id][column.key] = normalizeEquipmentSingleValue(getRedWeaponSpecialOptions(equipment[slot.id].type, season, preset), savedRow[column.key]);
        } else {
          equipment[slot.id][column.key] = normalizeEquipmentSingleOption(column, savedRow[column.key]);
        }
      } else {
        const value = String(savedRow[column.key] || "");
        equipment[slot.id][column.key] = normalizeEquipmentOptionValue(slot, column, value, season);
      }
      if (column.shortKey) {
        const shortValue = String(savedRow[column.shortKey] || "");
        equipment[slot.id][column.shortKey] = isEquipmentShortOptionAllowed(shortValue) ? shortValue : "";
      }
    });
    normalizeWeaponAffixShape(equipment[slot.id], "type");
    applyRedWeaponSpecialAffix(slot, equipment[slot.id], season, preset);
    applyLowLevelSeaWeaponSpecialAffix(slot, equipment[slot.id]);
    applyUnavailableWeaponAffixes(slot, equipment[slot.id]);
    applyUnavailableSetSpecialAffix(slot, equipment[slot.id]);
    applyRecommendedEquipmentAffixes(equipment[slot.id]);
    normalizeExclusiveEquipmentAffixes(equipment[slot.id]);
  });

  return equipment;
}

function isEquipmentOptionAllowed(slot, column, value, season = state?.season || "3") {
  if (!value) return true;
  return getEquipmentOptions(slot, column, season).includes(value);
}

function normalizeEquipmentOptionValue(slot, column, value, season = state?.season || "3") {
  if (!value) return "";

  const options = getEquipmentOptions(slot, column, season);
  if (options.includes(value)) return value;

  if (column.key === "type") {
    const shortValue = stripSeasonPrefix(value);
    return options.find(option => stripSeasonPrefix(option) === shortValue) || "";
  }

  return "";
}

function getEquipmentOptions(slot, column, season = state?.season || "3", row = null) {
  if (slot.id === "weapon" && column.key === "type") {
    return getSeasonWeaponTypes(season);
  }
  if (column.key === "type") {
    return getSeasonEquipmentTypes(slot, season);
  }

  if (slot.id === "weapon" && column.key === "specialAffix" && row && isRedWeaponType(row.type)) {
    return getRedWeaponSpecialOptions(row.type, season);
  }

  if (slot.id === "weapon" && column.key === "specialAffix" && row && isLowLevelSeaWeaponType(row.type)) {
    return getLowLevelSeaWeaponSpecialOptions();
  }

  let options = EQUIPMENT_OPTIONS[column.optionsKey] || [];
  if (shouldApplyAffixBlocklist(slot, column)) {
    const blocked = getBlockedAffixes(slot);
    options = options.filter(option => !blocked.includes(option));
  }

  return filterOccupiedEquipmentAffixOptions(options, column, row);
}

function filterOccupiedEquipmentAffixOptions(options, column, row) {
  if (!row || !["majorAffix", "minorAffix"].includes(column.key)) return options;

  const occupied = column.key === "majorAffix" ? row.minorAffix : row.majorAffix;
  if (!occupied) return options;
  return options.filter(option => option !== occupied);
}

function normalizeExclusiveEquipmentAffixes(row, changedField = "") {
  if (!row || !row.majorAffix || !row.minorAffix || row.majorAffix !== row.minorAffix) return;

  if (changedField === "minorAffix") {
    row.majorAffix = "";
    row.majorAffixRank = "";
    return;
  }

  row.minorAffix = "";
  row.minorAffixRank = "";
}

function shouldApplyAffixBlocklist(slot, column) {
  return slot.id !== "weapon" && ["majorAffix", "minorAffix"].includes(column.key);
}

function isRecommendedAffixLocked(row, column) {
  return ["majorAffix", "minorAffix"].includes(column.key) && shouldAutoUseRecommendedAffixes(row?.type);
}

function isEquipmentAffixLocked(slot, column, row) {
  return isUnavailableSetSpecialAffix(slot, column, row) || isSeasonLockedWeaponSpecialAffix(slot, column, row) || isLowLevelSeaWeaponSpecialAffix(slot, column, row) || isUnavailableWeaponAffix(slot, column, row) || isRecommendedAffixLocked(row, column);
}

function isUnavailableSetSpecialAffix(slot, column, row) {
  return slot.id !== "weapon" && column.key === "specialAffix" && isSetEquipmentType(row?.type);
}

function isSeasonLockedWeaponSpecialAffix(slot, column, row) {
  return slot.id === "weapon" && column.key === "specialAffix" && ["1", "2"].includes(getActiveSeason()) && (isRedWeaponType(row?.type) || isSeaWeaponType(row?.type));
}

function isLowLevelSeaWeaponSpecialAffix(slot, column, row) {
  return slot.id === "weapon" && column.key === "specialAffix" && isLowLevelSeaWeaponType(row?.type);
}

function getCurrentPresetRedWeaponSpecial(preset = getActivePreset()) {
  return RED_WEAPON_SPECIAL_BY_PRESET[preset] || "";
}

function getPresetMainAttribute(presetKey = getActivePreset()) {
  return PRESETS[presetKey]?.mainAttribute || "";
}

function getPresetDamageType(presetKey = getActivePreset()) {
  return PRESETS[presetKey]?.damageType || getActiveDamageType();
}

function getPresetElementLabel(presetKey = getActivePreset()) {
  return PRESET_ELEMENT_LABEL_BY_PRESET[presetKey] || "元素";
}

function getActiveDamageType() {
  try {
    return state?.resistanceMode || String(state?.fields?.resistanceCoeff || "0.7");
  } catch (error) {
    return "0.7";
  }
}

function getS3RedWeaponSpecialBaseOptions(presetKey = getActivePreset()) {
  const mainAttribute = getPresetMainAttribute(presetKey) || "主属性";
  const damageLabel = getPresetDamageType(presetKey) === "0.92" ? "魔法" : "物理";
  const elementLabel = getPresetElementLabel(presetKey);
  return [
    `${mainAttribute}+6%`,
    `${damageLabel}攻击+8%`,
    `${damageLabel}伤害+8%`,
    `${elementLabel}加成+8%`
  ];
}

function getActiveSeason() {
  try {
    return String(state?.season || "3");
  } catch (error) {
    return "3";
  }
}

function getActivePreset() {
  try {
    return state?.preset || "custom";
  } catch (error) {
    return "custom";
  }
}

function getRedWeaponSpecialOptions(type, season = getActiveSeason(), preset = getActivePreset()) {
  if (!isRedWeaponType(type)) return EQUIPMENT_OPTIONS.special || [];

  const presetSpecial = getCurrentPresetRedWeaponSpecial(preset);
  if (String(season) === "3") {
    const baseOptions = getS3RedWeaponSpecialBaseOptions(preset);
    return presetSpecial ? [...baseOptions, presetSpecial] : baseOptions;
  }

  return presetSpecial ? [presetSpecial] : [];
}

function applyRedWeaponSpecialAffix(slot, row, season = getActiveSeason(), preset = getActivePreset()) {
  if (slot.id !== "weapon" || !row || !isRedWeaponType(row.type)) return;

  const options = getRedWeaponSpecialOptions(row.type, season, preset);
  if (["1", "2"].includes(String(season))) {
    row.specialAffix = options[0] || "";
    row.specialAffixRank = "";
    return;
  }

  if (!options.includes(row.specialAffix)) {
    row.specialAffix = "";
  }
  row.specialAffixRank = "";
}

function getLowLevelSeaWeaponSpecialOptions() {
  const recommended = getCurrentRecommendedAffixPair();
  const attributes = Array.isArray(recommended) ? recommended.slice(0, 2).map(item => `${item}+6%`) : [];
  return [...attributes, "增效", getCurrentPresetRedWeaponSpecial()].filter(Boolean);
}

function getSeaWeaponAttributeOptions() {
  return PANEL_AFFIX_ORDER.map(item => `${item}+6%`);
}

function getHighLevelSeaWeaponSpecialOptions(index) {
  if (index === 2) {
    const presetSpecial = getCurrentPresetRedWeaponSpecial();
    const redOptions = getS3RedWeaponSpecialBaseOptions();
    return presetSpecial ? [...redOptions, presetSpecial] : redOptions;
  }

  return EQUIPMENT_OPTIONS.special || [];
}

function normalizeHighLevelSeaWeaponSpecialValues(value) {
  const values = Array.isArray(value) ? value : (value ? [String(value)] : []);
  const attributeOptions = getSeaWeaponAttributeOptions();
  const thirdOptions = getHighLevelSeaWeaponSpecialOptions(2);
  const fourthOptions = getHighLevelSeaWeaponSpecialOptions(3);
  const firstAttribute = attributeOptions.includes(values[0]) ? values[0] : "";
  const secondAttribute = attributeOptions.includes(values[1]) && values[1] !== firstAttribute ? values[1] : "";

  return [
    firstAttribute,
    secondAttribute,
    thirdOptions.includes(values[2]) ? values[2] : "",
    fourthOptions.includes(values[3]) ? values[3] : ""
  ];
}

function applyLowLevelSeaWeaponSpecialAffix(slot, row) {
  if (slot.id !== "weapon" || !row || !isLowLevelSeaWeaponType(row.type)) return;

  row.specialAffix = getLowLevelSeaWeaponSpecialOptions();
  row.specialAffixRank = "";
}

function applyUnavailableSetSpecialAffix(slot, row) {
  if (slot.id === "weapon" || !row || !isSetEquipmentType(row.type)) return;

  row.specialAffix = "无";
  row.specialAffixRank = "";
}

function isUnavailableWeaponAffix(slot, column, row) {
  return slot.id === "weapon" && isFixedValueAffixColumn(column) && getEquipmentAffixValue(slot, column, row) === 0;
}

function applyUnavailableWeaponAffixes(slot, row) {
  if (slot.id !== "weapon" || !row) return;

  EQUIPMENT_COLUMNS.forEach(column => {
    if (!isFixedValueAffixColumn(column) || getEquipmentAffixValue(slot, column, row) !== 0) return;
    row[column.key] = "无";
    if (column.shortKey) {
      row[column.shortKey] = "";
    }
  });
}

function shouldAutoUseRecommendedAffixes(type) {
  const typeKey = stripSeasonPrefix(type);
  return Boolean(typeKey) && typeKey !== "自定义" && !typeKey.endsWith("金") && state?.preset !== "custom";
}

function isSetEquipmentType(type) {
  return stripSeasonPrefix(type).includes("套装");
}

function applyRecommendedEquipmentAffixes(row) {
  if (!row || !shouldAutoUseRecommendedAffixes(row.type)) return;

  const pair = getCurrentRecommendedAffixPair();
  if (!pair) return;

  row.majorAffix = pair[0];
  row.minorAffix = pair[1];
}

function getCurrentRecommendedAffixPair() {
  const recommended = PRESET_RECOMMENDED_AFFIXES[state?.preset];
  if (!Array.isArray(recommended) || recommended.length < 2) return null;

  return recommended
    .slice(0, 2)
    .sort((left, right) => PANEL_AFFIX_ORDER.indexOf(left) - PANEL_AFFIX_ORDER.indexOf(right));
}

function isFixedValueAffixColumn(column) {
  return FIXED_VALUE_AFFIX_KEYS.has(column.key);
}

function getEquipmentAffixValue(slot, column, row) {
  if (!row?.type) return null;

  const values = getEquipmentTypeValues(slot, row);
  if (!values || !Object.prototype.hasOwnProperty.call(values, column.key)) {
    return null;
  }

  return values[column.key];
}

function getEquipmentTypeValues(slot, row) {
  if (!row?.type) return null;

  const group = slot.id === "weapon" ? "weapon" : "equipment";
  const typeKey = stripSeasonPrefix(row.type);
  return EQUIPMENT_VALUES[group]?.[typeKey] || null;
}

function getBlockedAffixes(slot) {
  const blocklist = EQUIPMENT_AFFIX_BLOCKLIST[slot.id];
  if (Array.isArray(blocklist)) return blocklist;
  if (blocklist && typeof blocklist === "object") {
    const current = blocklist[getCurrentMainAttribute()];
    return Array.isArray(current) ? current : [];
  }
  return [];
}

function getSeasonEquipmentTypes(slot, season = state?.season || "3") {
  const seasonPrefix = {
    1: "第一赛季",
    2: "第二赛季",
    3: "第三赛季"
  }[season];

  let options = EQUIPMENT_OPTIONS.type || [];
  if (seasonPrefix) {
    options = options.filter(option => option === "自定义" || option.startsWith(seasonPrefix));
  }
  if (NO_SET_EQUIPMENT_SLOT_IDS.has(slot.id)) {
    options = options.filter(option => !stripSeasonPrefix(option).includes("套装"));
  }
  return options;
}

function getSeasonWeaponTypes(season = state?.season || "3") {
  const seasonPrefix = {
    1: "第一赛季",
    2: "第二赛季",
    3: "第三赛季"
  }[season];
  const seaLimit = {
    1: 100,
    2: 180,
    3: 280
  }[season];

  return (EQUIPMENT_OPTIONS.weaponType || []).filter(option => {
    if (option === "自定义") return true;

    if (isSeaWeaponType(option)) {
      return getEquipmentLevel(option) <= seaLimit;
    }

    return seasonPrefix ? option.startsWith(seasonPrefix) : true;
  });
}

function getEquipmentLevel(value) {
  const match = stripSeasonPrefix(value).match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function formatEquipmentOptionLabel(slot, column, option) {
  if (column.key === "type") {
    return option.replace(/^第[一二三]赛季\s*/, "");
  }

  return isRecommendedAffixOption(column, option) ? `${option}${RECOMMENDED_MARK}` : option;
}

function isRecommendedAffixOption(column, option) {
  if (column.optionsKey !== "affix") return false;
  const recommended = getCurrentRecommendedAffixPair();
  return Array.isArray(recommended) && recommended.includes(option);
}

function isEquipmentShortOptionAllowed(value) {
  if (!value) return true;
  return EQUIPMENT_OPTIONS.affixRank.includes(value);
}

function isWeaponSpecialColumn(slot, column) {
  return slot.id === "weapon" && column.key === "specialAffix";
}

function isAdvancedWeaponType(type) {
  return isRedWeaponType(type) || isSeaWeaponType(type);
}

function isRedWeaponType(type) {
  return stripSeasonPrefix(type).endsWith("红");
}

function isSeaWeaponType(type) {
  return stripSeasonPrefix(type).endsWith("海");
}

function isLowLevelSeaWeaponType(type) {
  return isSeaWeaponType(type) && getEquipmentLevel(type) <= 180;
}

function isHighLevelSeaWeaponType(type) {
  return isSeaWeaponType(type) && getEquipmentLevel(type) >= 220;
}

function stripSeasonPrefix(value) {
  return String(value || "").replace(/^第[一二三]赛季\s*/, "");
}

function normalizeWeaponAffixShape(row, changedField) {
  if (!row) return;

  if (isSeaWeaponType(row.type)) {
    if (!Array.isArray(row.specialAffix)) {
      if (isLowLevelSeaWeaponType(row.type)) {
        row.specialAffix = normalizeEquipmentMultiValues(getLowLevelSeaWeaponSpecialOptions(), row.specialAffix);
      } else {
        row.specialAffix = normalizeHighLevelSeaWeaponSpecialValues(row.specialAffix);
      }
    } else if (isHighLevelSeaWeaponType(row.type)) {
      row.specialAffix = normalizeHighLevelSeaWeaponSpecialValues(row.specialAffix);
    }
    row.specialAffix = row.specialAffix.slice(0, 4);
    row.specialAffixRank = "";
    return;
  }

  if (Array.isArray(row.specialAffix)) {
    row.specialAffix = row.specialAffix[0] || "";
  }
  if (isRedWeaponType(row.type)) {
    row.specialAffixRank = "";
  }
  if (changedField === "type" && !row.type) {
    row.type = "";
  }
}

function normalizeEquipmentMultiOptions(column, value) {
  const options = EQUIPMENT_OPTIONS[column.optionsKey] || [];
  return normalizeEquipmentMultiValues(options, value);
}

function normalizeEquipmentMultiValues(options, value) {
  const values = Array.isArray(value) ? value : (value ? [String(value)] : []);
  return values.filter(item => options.includes(item));
}

function normalizeEquipmentSingleOption(column, value) {
  const options = EQUIPMENT_OPTIONS[column.optionsKey] || [];
  return normalizeEquipmentSingleValue(options, value);
}

function normalizeEquipmentSingleValue(options, value) {
  const text = Array.isArray(value) ? String(value[0] || "") : String(value || "");
  return options.includes(text) ? text : "";
}

function migrateLegacyDefaultValues(next, saved) {
  if (Number(saved.defaultVersion) >= DEFAULT_VERSION) return;

  const legacyAttackDefaults = {
    panelAttack: 10000,
    refinedAttack: 0,
    elementAttack: 0,
    resistanceCoeff: 0.7,
    skillRate: 450,
    flatDamage: 0
  };
  const savedFields = saved.fields || {};
  const isLegacyAttackDefault = Object.entries(legacyAttackDefaults).every(([key, value]) => Number(savedFields[key]) === value);

  if (isLegacyAttackDefault) {
    Object.keys(legacyAttackDefaults).forEach(key => {
      next.fields[key] = 0;
    });
    next.fields.resistanceCoeff = 0.7;
    next.resistanceMode = "0.7";
  }

  if (Number(savedFields.luckyEffectRate) === 40) {
    next.fields.luckyEffectRate = 0;
  }

  if (Number(savedFields.extraCritMultiplier) === 50) {
    next.fields.extraCritMultiplier = 0;
  }

  next.defaultVersion = DEFAULT_VERSION;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  const now = new Date();
  saveStatusEl.textContent = `已保存 ${now.toLocaleTimeString("zh-CN", { hour12: false })}`;
}

function isOldDefaultPanelFormula(item) {
  return (
    item.format === "percent" &&
    ((item.id === "critPanel" && item.formula === "critPct") ||
      (item.id === "luckPanel" && item.formula === "luckPct"))
  );
}

function renderAll() {
  seasonSelectEl.value = state.season;
  presetSelectEl.value = state.preset || "custom";
  renderInputSections();
  renderEquipmentBuilder();
  renderCustomInputs();
  renderFormulaEditor();
  updateResistanceButtons();
}

function renderInputSections() {
  inputSectionsEl.innerHTML = FIELD_SECTIONS.map(section => `
    <section class="section section-${escapeAttr(section.id || "default")}">
      <h3 class="section-title">${escapeHtml(section.title)}</h3>
      <div class="field-grid">
        ${section.fields.map(renderField).join("")}
      </div>
    </section>
  `).join("");
}

function renderField(field) {
  if (field.id === "mainAttribute") {
    return "";
  }

  const value = state.fields[field.id] ?? field.value;
  const label = getFieldLabel(field);
  if (field.type === "select") {
    return renderSelectField(field, value);
  }

  const unit = field.type === "percent" ? "%" : "";
  const lockedAttrs = field.locked ? "readonly disabled aria-readonly=\"true\"" : "";
  const lockedClass = field.locked ? " locked" : "";
  return `
    <div class="field field-${escapeAttr(field.id)}">
      <label for="${field.id}" title="${escapeHtml(label)}">${escapeHtml(label)}</label>
      <div class="input-wrap${lockedClass}">
        <input id="${field.id}" data-field-id="${field.id}" type="number" step="${field.step}" value="${formatInputValue(value)}" ${lockedAttrs}>
        <span class="unit">${unit}</span>
      </div>
    </div>
  `;
}

function renderSelectField(field, value) {
  const selectedValue = normalizeFieldSelectValue(field, value);
  const label = getFieldLabel(field);
  return `
    <div class="field field-${escapeAttr(field.id)}">
      <label for="${field.id}" title="${escapeHtml(label)}">${escapeHtml(label)}</label>
      <select id="${field.id}" data-field-id="${field.id}">
        ${(field.options || []).map(option => `
          <option value="${escapeAttr(option.value)}" ${option.value === selectedValue ? "selected" : ""}>${escapeHtml(option.label)}</option>
        `).join("")}
      </select>
    </div>
  `;
}

function syncFieldInputs() {
  FIELD_SECTIONS.flatMap(section => section.fields).forEach(field => {
    const input = document.querySelector(`[data-field-id="${field.id}"]`);
    if (!input) return;
    input.value = field.type === "select" ? state.fields[field.id] : formatInputValue(state.fields[field.id]);
  });
}

function renderEquipmentBuilder() {
  equipmentBuilderEl.innerHTML = `
    <div class="equipment-list">
      ${EQUIPMENT_SLOTS.map(slot => renderEquipmentRow(slot)).join("")}
    </div>
  `;
}

function renderEquipmentRow(slot) {
  const row = state.equipment[slot.id] || {};
  return `
    <div class="equipment-row">
      <div class="equipment-slot">${escapeHtml(slot.label)}</div>
      <div class="equipment-fields">
        ${EQUIPMENT_COLUMNS.map(column => renderEquipmentField(slot, column, row)).join("")}
      </div>
    </div>
  `;
}

function renderEquipmentField(slot, column, row) {
  const wideClass = isWeaponSpecialColumn(slot, column) && isAdvancedWeaponType(row.type)
    ? " equipment-field-wide"
    : "";

  return `
    <label class="equipment-field equipment-field-${escapeAttr(column.key)}${wideClass}">
      <span>${escapeHtml(column.label)}</span>
      ${renderEquipmentControl(slot, column, row)}
    </label>
  `;
}

function renderEquipmentControl(slot, column, row) {
  if (!column.pair) {
    return renderEquipmentSelect(slot, column, column.key, row[column.key] || "", "equipment-select-full");
  }

  if (isWeaponSpecialColumn(slot, column)) {
    const locked = isEquipmentAffixLocked(slot, column, row);
    if (isSeaWeaponType(row.type)) {
      if (isLowLevelSeaWeaponType(row.type)) {
        return renderLockedSeaWeaponSpecialAffixes(row[column.key] || []);
      }

      if (isHighLevelSeaWeaponType(row.type)) {
        return renderHighLevelSeaWeaponSpecialAffixes(slot, column, row[column.key] || [], locked);
      }

      return renderEquipmentDropdownMultiSelect(slot, column, row[column.key] || [], locked);
    }

    if (isRedWeaponType(row.type)) {
      return renderEquipmentSelect(slot, column, column.key, row[column.key] || "", "equipment-select-full", locked, row);
    }

    return `
      <div class="equipment-pair${locked ? " equipment-pair-locked" : ""}">
        ${renderEquipmentSelect(slot, column, column.key, row[column.key] || "", "equipment-select-long", locked, row)}
        ${renderEquipmentShortSelect(slot, column, row[column.shortKey] || "", locked)}
      </div>
    `;
  }

  if (column.key === "specialAffix") {
    const locked = isEquipmentAffixLocked(slot, column, row);
    return `
      <div class="equipment-pair${locked ? " equipment-pair-locked" : ""}">
        ${renderEquipmentSelect(slot, column, column.key, row[column.key] || "", "equipment-select-long", locked, row)}
        ${renderEquipmentShortSelect(slot, column, row[column.shortKey] || "", locked)}
      </div>
    `;
  }

  if (isFixedValueAffixColumn(column)) {
    const locked = isEquipmentAffixLocked(slot, column, row);
    return `
      <div class="equipment-pair equipment-value-pair${locked ? " equipment-pair-locked" : ""}">
        ${renderEquipmentSelect(slot, column, column.key, row[column.key] || "", "equipment-select-long", locked, row)}
        ${renderEquipmentAffixValue(slot, column, row)}
      </div>
    `;
  }

  return `
    <div class="equipment-pair">
      ${renderEquipmentSelect(slot, column, column.key, row[column.key] || "", "equipment-select-long", false, row)}
      ${renderEquipmentShortSelect(slot, column, row[column.shortKey] || "")}
    </div>
  `;
}

function renderEquipmentAffixValue(slot, column, row) {
  const value = getEquipmentAffixValue(slot, column, row);
  const hasValue = value !== null;
  const display = hasValue ? formatNumber(value) : "-";
  return `<div class="equipment-value${hasValue ? "" : " equipment-value-empty"}" title="${escapeAttr(display)}">${escapeHtml(display)}</div>`;
}

function renderLockedSeaWeaponSpecialAffixes(values) {
  const items = Array.isArray(values) ? values : [];
  return `
    <div class="equipment-sea-specials">
      <div class="equipment-locked-specials">
        ${items.slice(0, 2).map(item => `<div class="equipment-locked-special" title="${escapeAttr(item)}">${escapeHtml(item)}</div>`).join("")}
      </div>
      ${items.slice(2, 4).map(item => `
        <div class="equipment-sea-select-wrap equipment-sea-select-locked">
          <div class="equipment-sea-select-display" title="${escapeAttr(item)}">${escapeHtml(item)}</div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderHighLevelSeaWeaponSpecialAffixes(slot, column, values, disabled = false) {
  const normalizedValues = normalizeHighLevelSeaWeaponSpecialValues(values);
  return `
    <div class="equipment-sea-specials">
      <div class="equipment-sea-attribute-row">
        ${renderSeaWeaponAttributeSelect(slot, column, 0, normalizedValues)}
        ${renderSeaWeaponAttributeSelect(slot, column, 1, normalizedValues)}
      </div>
      ${renderSeaWeaponSpecialSelect(slot, column, 2, normalizedValues, disabled)}
      ${renderSeaWeaponSpecialSelect(slot, column, 3, normalizedValues, disabled)}
    </div>
  `;
}

function renderSeaWeaponAttributeSelect(slot, column, index, values) {
  const selectedValue = values[index] || "";
  const otherValue = values[index === 0 ? 1 : 0] || "";
  const options = getSeaWeaponAttributeOptions().filter(option => option === selectedValue || option !== otherValue);
  return `
    <div class="equipment-sea-attribute-wrap">
      <select class="equipment-sea-attribute-select" data-equipment-slot="${escapeAttr(slot.id)}" data-equipment-field="${escapeAttr(column.key)}" data-equipment-index="${index}" aria-label="${escapeAttr(`${slot.label}${column.label}属性${index + 1}`)}">
        <option value="">未选择</option>
        ${options.map(option => `
          <option value="${escapeAttr(option)}" ${option === selectedValue ? "selected" : ""}>${escapeHtml(option)}</option>
        `).join("")}
      </select>
      <div class="equipment-sea-attribute-display" title="${escapeAttr(selectedValue || "未选择")}">${escapeHtml(selectedValue || "未选择")}</div>
    </div>
  `;
}

function renderSeaWeaponSpecialSelect(slot, column, index, values, disabled = false) {
  const selectedValue = values[index] || "";
  const options = getHighLevelSeaWeaponSpecialOptions(index);
  const disabledAttr = disabled ? " disabled" : "";
  return `
    <div class="equipment-sea-select-wrap">
      <select class="equipment-sea-special-select" data-equipment-slot="${escapeAttr(slot.id)}" data-equipment-field="${escapeAttr(column.key)}" data-equipment-index="${index}" aria-label="${escapeAttr(`${slot.label}${column.label}${index - 1}`)}"${disabledAttr}>
        <option value="">未选择</option>
        ${options.map(option => `
          <option value="${escapeAttr(option)}" ${option === selectedValue ? "selected" : ""}>${escapeHtml(option)}</option>
        `).join("")}
      </select>
      <div class="equipment-sea-select-display" title="${escapeAttr(selectedValue || "未选择")}">${escapeHtml(selectedValue || "未选择")}</div>
    </div>
  `;
}

function renderEquipmentDropdownMultiSelect(slot, column, selectedValues, disabled = false) {
  const options = getEquipmentOptions(slot, column);
  const selected = new Set(Array.isArray(selectedValues) ? selectedValues : []);
  const displayValues = Array.from(selected).map(value => formatEquipmentOptionLabel(slot, column, value));
  const label = displayValues.length ? displayValues.join("\n") : "未选择";
  const title = displayValues.length ? displayValues.join("、") : "未选择";
  const disabledAttr = disabled ? " disabled" : "";

  return `
    <div class="equipment-multi-dropdown${disabled ? " equipment-pair-locked" : ""}">
      <button type="button" class="equipment-multi-toggle" data-equipment-multi-toggle="${escapeAttr(slot.id)}-${escapeAttr(column.key)}" title="${escapeAttr(title)}"${disabledAttr}>${escapeHtml(label)}</button>
      <div class="equipment-multi-menu">
        ${options.map(option => `
          <label class="equipment-multi-option">
            <input type="checkbox" value="${escapeAttr(option)}" ${selected.has(option) ? "checked" : ""}${disabledAttr} data-equipment-slot="${escapeAttr(slot.id)}" data-equipment-field="${escapeAttr(column.key)}" data-equipment-multi-option>
            <span>${escapeHtml(formatEquipmentOptionLabel(slot, column, option))}</span>
          </label>
        `).join("")}
      </div>
    </div>
  `;
}

function updateEquipmentMultiToggleLabel(sourceEl, values) {
  const dropdown = sourceEl.closest(".equipment-multi-dropdown");
  const toggle = dropdown?.querySelector("[data-equipment-multi-toggle]");
  if (!toggle) return;

  const slot = sourceEl.dataset.equipmentSlot;
  const field = sourceEl.dataset.equipmentField;
  const column = EQUIPMENT_COLUMNS.find(item => item.key === field);
  const slotConfig = EQUIPMENT_SLOTS.find(item => item.id === slot);
  const displayValues = values.map(value => formatEquipmentOptionLabel(slotConfig || { id: slot }, column || { key: field }, value));
  const label = displayValues.length ? displayValues.join("\n") : "未选择";
  const title = displayValues.length ? displayValues.join("、") : "未选择";
  toggle.textContent = label;
  toggle.title = title;
}

function renderEquipmentMultiSelect(slot, column, selectedValues) {
  const options = getEquipmentOptions(slot, column);
  const selected = new Set(Array.isArray(selectedValues) ? selectedValues : []);
  return `
    <select class="equipment-select-long equipment-select-multi" multiple size="3" data-equipment-slot="${escapeAttr(slot.id)}" data-equipment-field="${escapeAttr(column.key)}" aria-label="${escapeAttr(`${slot.label}${column.label}`)}">
      ${options.map(option => `
        <option value="${escapeAttr(option)}" ${selected.has(option) ? "selected" : ""}>${escapeHtml(formatEquipmentOptionLabel(slot, column, option))}</option>
      `).join("")}
    </select>
  `;
}

function renderEquipmentSelect(slot, column, fieldKey, selectedValue, className, disabled = false, row = null) {
  const options = getEquipmentOptions(slot, column, state?.season || "3", row);
  const renderedOptions = selectedValue && !options.includes(selectedValue)
    ? [selectedValue, ...options]
    : options;
  const disabledAttr = disabled ? " disabled" : "";
  return `
    <select class="${escapeAttr(className)}" data-equipment-slot="${escapeAttr(slot.id)}" data-equipment-field="${escapeAttr(fieldKey)}" aria-label="${escapeAttr(`${slot.label}${column.label}`)}"${disabledAttr}>
      <option value="">未选择</option>
      ${renderedOptions.map(option => `
        <option value="${escapeAttr(option)}" ${option === selectedValue ? "selected" : ""}>${escapeHtml(formatEquipmentOptionLabel(slot, column, option))}</option>
      `).join("")}
    </select>
  `;
}

function renderEquipmentShortSelect(slot, column, selectedValue, disabled = false) {
  const disabledAttr = disabled ? " disabled" : "";
  return `
    <select class="equipment-select-short" data-equipment-slot="${escapeAttr(slot.id)}" data-equipment-field="${escapeAttr(column.shortKey)}" aria-label="${escapeAttr(`${slot.label}${column.label}档位`)}"${disabledAttr}>
      <option value="">无</option>
      ${EQUIPMENT_OPTIONS.affixRank.map(option => `
        <option value="${escapeAttr(option)}" ${option === selectedValue ? "selected" : ""}>${escapeHtml(option)}</option>
      `).join("")}
    </select>
  `;
}

function renderCustomInputs() {
  if (!state.customInputs.length) {
    customInputsEl.innerHTML = `<div class="status">暂无自定义变量</div>`;
    return;
  }

  customInputsEl.innerHTML = state.customInputs.map((item, index) => `
    <div class="custom-row">
      <input data-custom-index="${index}" data-custom-field="label" value="${escapeAttr(item.label)}" aria-label="变量名称">
      <input data-custom-index="${index}" data-custom-field="key" value="${escapeAttr(item.key)}" aria-label="变量名">
      <input data-custom-index="${index}" data-custom-field="value" type="number" step="0.01" value="${formatInputValue(item.value)}" aria-label="变量值">
      <select data-custom-index="${index}" data-custom-field="type" aria-label="变量类型">
        <option value="number" ${item.type === "number" ? "selected" : ""}>数值</option>
        <option value="percent" ${item.type === "percent" ? "selected" : ""}>百分比</option>
      </select>
      <button type="button" class="danger" data-remove-custom="${index}">删除</button>
    </div>
  `).join("");
}

function renderFormulaEditor() {
  formulaEditorEl.innerHTML = `
    <div class="formula-row header">
      <div>名称</div>
      <div>变量名</div>
      <div>公式</div>
      <div>格式</div>
      <div>当前值</div>
      <div></div>
    </div>
    ${state.formulas.map((item, index) => `
      <div class="formula-row">
        <input data-formula-index="${index}" data-formula-field="label" value="${escapeAttr(item.label)}" aria-label="结果名称">
        <input data-formula-index="${index}" data-formula-field="id" value="${escapeAttr(item.id)}" aria-label="结果变量名">
        <input data-formula-index="${index}" data-formula-field="formula" value="${escapeAttr(item.formula)}" aria-label="计算公式">
        <select data-formula-index="${index}" data-formula-field="format" aria-label="结果格式">
          <option value="number" ${item.format === "number" ? "selected" : ""}>数值</option>
          <option value="percent" ${item.format === "percent" ? "selected" : ""}>百分比</option>
          <option value="multiplier" ${item.format === "multiplier" ? "selected" : ""}>乘区</option>
        </select>
        <div class="formula-value" data-formula-value="${index}">-</div>
        <button type="button" class="danger" data-remove-formula="${index}">删除</button>
      </div>
    `).join("")}
  `;
}

function calculate() {
  const context = buildContext();
  const results = [];
  let errors = 0;

  state.formulas.forEach((item, index) => {
    const id = sanitizeKey(item.id) || `result${index + 1}`;
    const formula = item.formula || "0";
    try {
      const value = evaluateExpression(formula, context);
      if (!Number.isFinite(value)) {
        throw new Error("结果不是有效数字");
      }

      const result = {
        ...item,
        id,
        value,
        display: formatByType(value, item.format)
      };
      results.push(result);
      context[id] = value;
      updateFormulaValue(index, result.display, false);
    } catch (error) {
      errors += 1;
      results.push({
        ...item,
        id,
        value: NaN,
        display: error.message,
        error: true
      });
      updateFormulaValue(index, error.message, true);
    }
  });

  renderResults(results, context);
  renderPanelAttributes(context);
  renderVariables(context);
  calcStatusEl.textContent = errors ? `${errors} 个公式异常` : "已更新";
  calcStatusEl.style.color = errors ? "var(--danger)" : "var(--muted)";
}

function buildContext() {
  const context = {};

  FIELD_SECTIONS.flatMap(section => section.fields).forEach(field => {
    if (field.type === "select") return;
    const rawValue = Number(state.fields[field.id]) || 0;
    context[field.id] = field.type === "percent" ? rawValue / 100 : rawValue;
  });

  state.customInputs.forEach((item, index) => {
    const key = sanitizeKey(item.key) || `custom${index + 1}`;
    const rawValue = Number(item.value) || 0;
    context[key] = item.type === "percent" ? rawValue / 100 : rawValue;
  });

  addEquipmentContext(context);

  const constants = SEASON_CONSTANTS[state.season] || SEASON_CONSTANTS[3];
  context.ratingConstant = constants.rating;
  context.versatilityConstant = constants.versatility;
  context.elementConstant = constants.element;

  context.critPct = ratingToPercent(context.crit, constants.rating) + 0.05;
  context.hastePct = ratingToPercent(context.haste, constants.rating);
  context.luckPct = ratingToPercent(context.luck, constants.rating) + 0.05;
  context.masteryPct = ratingToPercent(context.mastery, constants.rating) + 0.06;
  context.versatilityPct = ratingToPercent(context.versatility, constants.versatility);
  context.versatilityTotal = context.versatilityPct + context.versatilityBonus;
  context.singleElementFixedPercent = ratingToPercent(context.singleElementFixed, constants.element);
  context.allElementFixedPercent = ratingToPercent(context.allElementFixed, constants.element);
  context.physMagicFixedPercent = ratingToPercent(context.physMagicFixed, constants.element);
  context.critExtraMultiplier = 0.5 + context.extraCritMultiplier;
  context.critDamageTotal = 1 + context.critExtraMultiplier;

  context.attackZone = context.panelAttack * context.resistanceCoeff + context.refinedAttack + context.elementAttack;
  context.skillBase = context.attackZone * context.skillRate + context.flatDamage;
  context.generalBonusTotal = context.generalDamageBonus + context.specialSkillBonus + context.rangeSkillBonus + context.vulnerableBonus + context.petDamageBonus + context.otherDamageBonus;
  context.generalMultiplier = 1 + context.generalBonusTotal;
  context.elementBonusTotal = context.singleElementFixedPercent + context.singleElementBonus + context.allElementFixedPercent + context.allElementBonus;
  context.elementMultiplier = 1 + context.elementBonusTotal;
  context.versatilityMultiplier = 1 + context.versatilityTotal * 0.35;
  context.critMultiplier = 1 + context.critPct * context.critExtraMultiplier;
  context.finalMultiplier = 1 + context.finalDamageBonus;
  context.physMagicMultiplier = 1 + context.physMagicFixedPercent + context.physMagicBonus;
  context.seasonDamageMultiplier = 1 + context.seasonDamageBonus;
  context.seasonSuppressMultiplier = 1 + clamp(context.seasonSuppressBonus, 0, 0.2);
  context.luckyMultiplier = context.luckyBaseMultiplier + 0.25 * context.luckPct;
  context.luckyGeneralMultiplier = 1 + context.luckPct + context.luckyDamageBonus + context.rangeSkillBonus + context.generalDamageBonus + context.specialSkillBonus + context.vulnerableBonus + context.otherDamageBonus;
  context.luckyEffectGeneralMultiplier = 1 + context.luckPct + context.luckyDamageBonus + context.generalDamageBonus + context.specialSkillBonus + context.vulnerableBonus + context.otherDamageBonus;
  context.luckyHitDamage = (context.panelAttack + context.refinedAttack + context.elementAttack) * context.luckyMultiplier * context.luckyGeneralMultiplier * context.elementMultiplier * context.versatilityMultiplier * context.critMultiplier * context.physMagicMultiplier * context.finalMultiplier * context.seasonDamageMultiplier * context.seasonSuppressMultiplier;
  context.luckyExpectedDamage = context.luckPct * context.luckyHitDamage;
  context.otherLuckyEffectDamage = context.attackZone * context.luckyEffectRate * context.luckyEffectGeneralMultiplier * context.elementMultiplier * context.versatilityMultiplier * context.critMultiplier * context.physMagicMultiplier * context.finalMultiplier * context.seasonDamageMultiplier * context.seasonSuppressMultiplier;

  return context;
}

function addEquipmentContext(context) {
  Object.entries(state.equipment || {}).forEach(([slotId, row]) => {
    const slot = EQUIPMENT_SLOTS.find(item => item.id === slotId) || { id: slotId };
    const values = getEquipmentTypeValues(slot, row);
    if (!values) return;

    addContextValue(context, "mainAttribute", values.mainAttribute);

    ["majorAffix", "minorAffix", "reforgeAffix"].forEach(columnKey => {
      const affixName = row?.[columnKey];
      if (!affixName || affixName === "无") return;

      const mapping = EQUIPMENT_AFFIX_CONTEXT_MAP[affixName];
      if (!mapping) return;

      addContextValue(context, mapping.key, values[columnKey]);
    });
  });
}

function addContextValue(context, key, value) {
  const number = Number(value) || 0;
  if (!number) return;

  context[key] = (Number(context[key]) || 0) + number;
}

function renderResults(results, context) {
  const skillDamage = results.find(item => item.id === "skillDamage") || results[0];
  const display = skillDamage ? skillDamage.display : formatNumber(0);
  const isError = Boolean(skillDamage?.error);
  const mainAttributeLabel = getCurrentMainAttribute() === "自定义" ? "主属性" : getCurrentMainAttribute();
  const mainAttributeDisplay = formatNumber(context.mainAttribute || 0);

  primaryResultsEl.innerHTML = `
    <div class="metric primary skill-damage-metric">
      <span title="当前技能伤害">当前技能伤害</span>
      <strong class="${isError ? "error-text" : ""}" title="${escapeHtml(display)}">${escapeHtml(display)}</strong>
    </div>
    <div class="metric compact-metric">
      <span title="${escapeHtml(mainAttributeLabel)}">${escapeHtml(mainAttributeLabel)}</span>
      <strong title="${escapeHtml(mainAttributeDisplay)}">${escapeHtml(mainAttributeDisplay)}</strong>
    </div>
  `;
}

function renderPanelAttributes(context) {
  const recommendedAffixes = getCurrentRecommendedAffixPair() || [];
  panelAttributesEl.innerHTML = `
    <div class="panel-attributes-header">
      <h3>面板属性百分比</h3>
    </div>
    <div class="panel-attributes-grid">
      ${PANEL_ATTRIBUTES.map(item => {
        const isRecommended = recommendedAffixes.includes(item.label);
        return `
        <div class="panel-attribute${isRecommended ? " panel-attribute-recommended" : ""}">
          <span title="${escapeHtml(item.label)}">${escapeHtml(item.label)}</span>
          <strong title="${escapeHtml(`${formatByType(context[item.percentKey], "percent")} (${formatNumber(context[item.ratingKey])})`)}">${escapeHtml(`${formatByType(context[item.percentKey], "percent")} (${formatNumber(context[item.ratingKey])})`)}</strong>
        </div>
      `;
      }).join("")}
    </div>
  `;
}

function renderVariables(context) {
  const inputLabels = {};
  FIELD_SECTIONS.flatMap(section => section.fields).forEach(field => {
    inputLabels[field.id] = getFieldLabel(field);
  });
  state.customInputs.forEach((item, index) => {
    inputLabels[sanitizeKey(item.key) || `custom${index + 1}`] = item.label;
  });
  state.formulas.forEach((item, index) => {
    inputLabels[sanitizeKey(item.id) || `result${index + 1}`] = item.label;
  });

  const keys = Object.keys(context).sort((a, b) => a.localeCompare(b));
  variableListEl.innerHTML = keys.map(key => {
    const label = inputLabels[key] || DERIVED_LABELS[key] || "公式结果";
    return `
      <div class="var-item">
        <code title="${escapeHtml(key)}">${escapeHtml(key)}</code>
        <span title="${escapeHtml(label)}">${escapeHtml(label)} = ${escapeHtml(formatSmart(context[key]))}</span>
      </div>
    `;
  }).join("");
}

function updateFormulaValue(index, text, isError) {
  const el = document.querySelector(`[data-formula-value="${index}"]`);
  if (!el) return;
  el.textContent = text;
  el.title = text;
  el.classList.toggle("error", isError);
}

function addCustomInput() {
  const nextIndex = state.customInputs.length + 1;
  state.customInputs.push({
    label: `自定义变量 ${nextIndex}`,
    key: `custom${nextIndex}`,
    value: 0,
    type: "number"
  });
  renderCustomInputs();
  calculate();
  saveState();
}

function addFormula() {
  const nextIndex = state.formulas.length + 1;
  state.formulas.push({
    id: `result${nextIndex}`,
    label: `结果 ${nextIndex}`,
    format: "number",
    formula: "0"
  });
  renderFormulaEditor();
  calculate();
  saveState();
}

function applyPreset(presetKey) {
  const preset = PRESETS[presetKey];
  if (!preset) return;

  state.preset = presetKey;

  if (preset.damageType) {
    state.resistanceMode = preset.damageType;
    state.fields.resistanceCoeff = Number(preset.damageType);
  }

  state.equipment = normalizeEquipment(state.equipment, state.season);
  renderInputSections();
  renderEquipmentBuilder();
  updateResistanceButtons();
  calculate();
  saveState();
}

function exportConfig() {
  const data = JSON.stringify(state, null, 2);
  const blob = new Blob([data], { type: "application/json;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "bpsr-calculator-config.json";
  link.click();
  URL.revokeObjectURL(link.href);
}

function importConfig(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      state = normalizeState({
        ...createDefaultState(),
        ...parsed,
        fields: { ...createDefaultState().fields, ...(parsed.fields || {}) }
      });
      renderAll();
      calculate();
      saveState();
    } catch (error) {
      alert(`导入失败：${error.message}`);
    } finally {
      fileInputEl.value = "";
    }
  };
  reader.readAsText(file, "utf-8");
}

function resetDefaults() {
  if (!confirm("确定重置为默认配置？")) return;
  state = createDefaultState();
  localStorage.removeItem(STORAGE_KEY);
  renderAll();
  calculate();
  saveState();
}

function updateResistanceButtons() {
  applyPresetDamageType(state);
  const mode = detectResistanceMode(state.fields.resistanceCoeff);
  const activeMode = state.resistanceMode === "0.92" ? "0.92" : mode;
  state.resistanceMode = activeMode;
  state.fields.resistanceCoeff = Number(activeMode);
  document.querySelectorAll("#resistanceButtons button").forEach(button => {
    button.classList.toggle("active", button.dataset.resistance === activeMode);
    button.disabled = !canEditDamageType();
  });
}

function detectResistanceMode(value) {
  if (Math.abs(Number(value) - 0.7) < 0.000001) return "0.7";
  if (Math.abs(Number(value) - 0.92) < 0.000001) return "0.92";
  return "0.7";
}

function evaluateExpression(expression, context) {
  const text = String(expression || "0").trim();
  if (!text) return 0;
  if (!/^[\d\s+\-*/%().,_A-Za-z]+$/.test(text)) {
    throw new Error("公式包含不支持的字符");
  }
  if (/(^|[^A-Za-z_])(constructor|prototype|__proto__|window|document|globalThis|Function|eval|import|this)([^A-Za-z0-9_]|$)/i.test(text)) {
    throw new Error("公式包含受限关键字");
  }

  const names = [...Object.keys(FUNCTION_LIBRARY), ...Object.keys(context)];
  const values = [...Object.values(FUNCTION_LIBRARY), ...Object.values(context)];
  const fn = new Function(...names, `"use strict"; return (${text});`);
  return Number(fn(...values));
}

function ratingToPercent(value, constant) {
  const x = Math.max(Number(value) || 0, 0);
  const a = Math.max(Number(constant) || 0, 0);
  return x + a === 0 ? 0 : x / (x + a);
}

function readNumericInput(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function readFieldInputValue(input) {
  const field = FIELD_SECTIONS.flatMap(section => section.fields).find(item => item.id === input.dataset.fieldId);
  if (field?.type === "select") {
    return normalizeFieldSelectValue(field, input.value);
  }
  return readNumericInput(input.value);
}

function formatByType(value, type) {
  const formatter = FORMATTERS[type] || FORMATTERS.number;
  return formatter(value);
}

function formatNumber(value) {
  if (!Number.isFinite(Number(value))) return "无效";
  return Number(value).toLocaleString("zh-CN", {
    maximumFractionDigits: Math.abs(value) >= 100 ? 0 : 4
  });
}

function formatSmart(value) {
  if (!Number.isFinite(Number(value))) return "无效";
  const number = Number(value);
  if (Math.abs(number) > 0 && Math.abs(number) < 1) {
    return `${formatNumber(number)} / ${formatNumber(number * 100)}%`;
  }
  return formatNumber(number);
}

function formatInputValue(value) {
  return Number.isFinite(Number(value)) ? String(Number(value)) : "0";
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function sanitizeKey(key) {
  const text = String(key || "").trim();
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(text)) return "";
  if (Object.prototype.hasOwnProperty.call(FUNCTION_LIBRARY, text)) return "";
  return text;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}
