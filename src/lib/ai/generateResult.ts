import { pickProducts } from "@/lib/data/seedProducts";
import type {
  AiResult,
  HairProfile,
  PhotoAnalysis,
  QuizAnswers,
  Recommendation,
  Tutorial
} from "@/lib/types";

function simplifiedConcerns(answers: QuizAnswers) {
  const concerns = new Set<string>();

  for (const item of answers.main_concerns) {
    if (item.includes("毛躁") || item.includes("蓬") || item.includes("炸")) concerns.add("毛躁");
    if (item.includes("卷度不清晰") || item.includes("乱不是卷")) concerns.add("卷度不明显");
    if (item.includes("持久度差") || item.includes("散了")) concerns.add("定型差");
    if (item.includes("卷度不一致")) concerns.add("卷度不稳定");
    if (item.includes("其他")) concerns.add("需要进一步观察");
  }

  if (answers.chemical_history.includes("染") || answers.chemical_history.includes("烫")) {
    concerns.add("发尾受损");
    concerns.add("干枯");
  }

  return Array.from(concerns.size ? concerns : new Set(["毛躁", "卷度不稳定"]));
}

function budgetToProductBudget(budget: string) {
  if (budget === "50 元以内") return "入门低预算";
  if (budget === "300 元以上") return "高预算";
  return "中等预算";
}

function inferHairTexture(answers: QuizAnswers) {
  if (answers.porosity.includes("很难打湿")) return "粗硬";
  if (answers.main_concerns.some((item) => item.includes("撑不了") || item.includes("散了"))) return "细软";
  return "中等";
}

function inferPhotoAnalysis(answers: QuizAnswers): PhotoAnalysis {
  const concerns = simplifiedConcerns(answers);
  const hasFrizz = concerns.includes("毛躁");
  const hasCurlWeak = concerns.includes("卷度不明显") || concerns.includes("卷度不稳定");
  const hasDamage = concerns.includes("干枯") || concerns.includes("发尾受损");

  return {
    curl_pattern_guess: hasCurlWeak ? "自然卷基础存在，但卷束清晰度和稳定度需要辅助" : "轻中度自然卷",
    frizz_level: hasFrizz ? "中等偏高" : "中等",
    volume_level: answers.region.includes("华南") || answers.region.includes("华东") ? "湿热环境下更容易蓬胀" : "中等",
    dryness_guess: hasDamage || answers.porosity.includes("很快就湿透") ? "发尾可能偏干，水分流失较快" : "发尾有轻微干燥可能",
    confidence: "medium",
    visual_notes: [
      "照片分析在 P0 阶段仅作为护理参考建议",
      answers.porosity.includes("很难打湿") ? "低孔隙度更需要耐心打湿和轻薄产品" : "孔隙度信息会影响保湿和修护频率",
      hasCurlWeak ? "卷度维持可能需要湿发定型和正确干发方式" : "可以先稳定基础 routine"
    ]
  };
}

function buildHairProfile(answers: QuizAnswers): HairProfile {
  const concerns = simplifiedConcerns(answers);
  const texture = inferHairTexture(answers);
  const cgmLevel = answers.cgm_experience.includes("没有")
    ? "完全新手"
    : answers.cgm_experience.includes("坚持")
      ? "已有护理流程用户"
      : "入门探索用户";

  const climateHint = answers.region.includes("华南") || answers.region.includes("华东")
    ? "你所在地区湿度较高，方案需要兼顾控毛躁和轻定型。"
    : "你所在地区相对更容易干燥，方案需要更重视保湿和减少摩擦。";

  const strategy = answers.cgm_experience.includes("坚持")
    ? "保留已有有效步骤，重点优化产品轻重、定型持久度和 refresh"
    : "先建立清洁、保湿、湿发造型和温和干发的基础 routine";

  return {
    profile_title: `${texture}自然卷${cgmLevel}`,
    hair_summary: `你的主要关注点是${concerns.join("、")}。${climateHint} 当前更适合从少量关键步骤开始，避免一次叠加太多产品。`,
    main_concerns: concerns.slice(0, 4),
    care_strategy: strategy,
    avoid: [
      "一次叠加太多新产品",
      "用普通毛巾大力摩擦发尾",
      "没有完全打湿就直接上造型产品",
      answers.porosity.includes("很难打湿") ? "过厚、过重、不易吸收的产品" : "频繁高温吹干和过度清洁"
    ]
  };
}

function buildRecommendation(answers: QuizAnswers): Recommendation {
  const concerns = simplifiedConcerns(answers);
  const productBudget = budgetToProductBudget(answers.budget);
  const hairTexture = inferHairTexture(answers);
  const products = pickProducts(concerns, productBudget, hairTexture);
  const isHumidRegion = answers.region.includes("华南") || answers.region.includes("华东") || answers.region.includes("华中");
  const needsStyling = concerns.some((item) => ["卷度不明显", "定型差", "卷度不稳定"].includes(item));
  const needsRepair = concerns.some((item) => ["干枯", "发尾受损"].includes(item));

  return {
    routine_level: productBudget === "入门低预算" ? "新手入门低预算" : answers.cgm_experience.includes("坚持") ? "已有流程优化" : "新手入门",
    recommended_categories: [
      {
        category: "护发素 / 发膜",
        why_needed: needsRepair ? "染烫或高孔隙度会让发尾更容易干，需要先补基础修护。" : "帮助改善发尾毛躁和打结，是自然卷 routine 的基础。",
        priority: "high",
        how_to_choose: answers.porosity.includes("很难打湿") ? "优先轻薄、好冲洗、不要过度厚重。" : "选择保湿修护型，先从每周少量使用开始。"
      },
      {
        category: needsStyling ? "弹力素 / 卷发霜 / 摩丝" : "免洗护发",
        why_needed: needsStyling ? "帮助卷束在湿发阶段成型，并提升干发后的清晰度。" : "用于洗后和第二天 refresh，减少表层毛躁。",
        priority: "medium",
        how_to_choose: hairTexture === "细软" ? "优先摩丝或轻盈弹力素。" : "可以尝试卷发霜或中度支撑啫喱。"
      },
      {
        category: isHumidRegion ? "抗湿定型类" : "保湿 refresh 类",
        why_needed: isHumidRegion ? "湿热环境下更容易蓬和散，需要一点定型支撑。" : "干燥地区第二天更容易炸毛，需要温和补水。",
        priority: "low",
        how_to_choose: isHumidRegion ? "从轻支撑产品开始，避免厚重油感。" : "选择喷雾加少量免洗产品，不要重新整头洗。"
      }
    ],
    example_products: products
  };
}

function buildTutorial(answers: QuizAnswers): Tutorial {
  const lowPorosity = answers.porosity.includes("很难打湿");
  const highPorosity = answers.porosity.includes("很快就湿透");
  const hasOwnRoutine = answers.cgm_experience.includes("坚持");

  return {
    wash_day_tutorial: [
      {
        step: 1,
        title: lowPorosity ? "先把头发彻底打湿" : "洗发重点放在头皮",
        detail: lowPorosity
          ? "低孔隙度不要急着上产品，先用温水充分浸湿，让后续护发素更容易铺开。"
          : "用指腹按摩头皮，发尾不要反复揉搓，冲洗时让泡沫自然带过。"
      },
      {
        step: 2,
        title: "护发素只上发中到发尾",
        detail: highPorosity
          ? "高孔隙度可以稍微多停留一会儿，但仍然避开头皮，减少塌发。"
          : "停留 2-3 分钟后冲洗到仍保留一点顺滑感。"
      },
      {
        step: 3,
        title: "湿发时完成造型",
        detail: "在头发仍然湿润时少量多次上定型或免洗产品，从发尾向上托抓出卷度。"
      },
      {
        step: 4,
        title: "减少摩擦并温和干发",
        detail: hasOwnRoutine ? "如果已有烘干罩，可以低温低风速烘到 8-9 成干。" : "先用微纤维毛巾或旧 T 恤轻轻按压，再自然干或低风速吹干。"
      }
    ],
    refresh_tutorial: [
      "第二天早上用喷雾轻微打湿发尾和毛躁处。",
      "取少量免洗护发或定型产品在手心搓开。",
      answers.region.includes("华南") || answers.region.includes("华东")
        ? "湿热地区少量即可，重点处理表层和发尾。"
        : "干燥地区可以先补一点水，再补少量免洗。"
    ],
    beginner_tips: [
      "每次只调整一个变量，方便判断哪个步骤有效。",
      "不要把护发素、发膜、发油都涂到头皮。",
      answers.current_products_status.includes("上传")
        ? "后续可以结合产品照片进一步判断现有产品是否适合。"
        : "如果暂时没提供产品，先按产品类型选择，不急着买全套。"
    ]
  };
}

export async function generateResult(session_id: string, answers: QuizAnswers): Promise<AiResult> {
  const startedAt = Date.now();

  const photo_analysis = inferPhotoAnalysis(answers);
  const hair_profile = buildHairProfile(answers);
  const recommendations = buildRecommendation(answers);
  const tutorial = buildTutorial(answers);

  return {
    session_id,
    photo_analysis,
    hair_profile,
    recommendations,
    tutorial,
    ai_model: process.env.AI_API_KEY ? "configured-fallback-v1" : "rule-based-fallback-v1",
    latency_ms: Date.now() - startedAt,
    is_success: true,
    error_message: null
  };
}
