import type { Product } from "@/lib/types";

export const seedProducts: Product[] = [
  {
    id: "p001",
    name: "低泡温和洗发水",
    brand: "示例品牌 Curl A",
    category: "shampoo",
    category_label: "洗发水",
    price_level: "low",
    suitable_for: ["新手", "头皮油", "轻度毛躁"],
    not_suitable_for: ["重度受损"],
    texture: "清爽",
    usage: "重点按摩头皮，发尾让泡沫自然带过即可。",
    reason_template: "适合先把清洁步骤稳定下来，减少头皮负担。"
  },
  {
    id: "p002",
    name: "氨基酸保湿洗发水",
    brand: "示例品牌 Leaf",
    category: "shampoo",
    category_label: "洗发水",
    price_level: "medium",
    suitable_for: ["干枯", "敏感", "新手"],
    not_suitable_for: ["非常油的头皮"],
    texture: "温和",
    usage: "洗头皮 1 次即可，避免反复搓发尾。",
    reason_template: "更适合头皮偏干或敏感、发尾容易干的人。"
  },
  {
    id: "p003",
    name: "清爽控油洗发水",
    brand: "示例品牌 Balance",
    category: "shampoo",
    category_label: "洗发水",
    price_level: "medium",
    suitable_for: ["头皮油", "容易塌", "发量少"],
    not_suitable_for: ["头皮干", "发尾极干"],
    texture: "清透",
    usage: "只用于头皮，发尾用护发素补足保湿。",
    reason_template: "适合头皮出油快、发根容易塌的用户。"
  },
  {
    id: "p004",
    name: "轻盈保湿护发素",
    brand: "示例品牌 Soft",
    category: "conditioner",
    category_label: "护发素",
    price_level: "low",
    suitable_for: ["毛躁", "干枯", "新手", "细软"],
    not_suitable_for: ["头皮油"],
    texture: "轻盈乳霜",
    usage: "洗发后涂在发中到发尾，停留 2-3 分钟后冲洗。",
    reason_template: "适合新手建立基础保湿步骤，不容易压塌卷度。"
  },
  {
    id: "p005",
    name: "滋润修护护发素",
    brand: "示例品牌 Repair",
    category: "conditioner",
    category_label: "护发素",
    price_level: "medium",
    suitable_for: ["干枯", "发尾受损", "粗硬"],
    not_suitable_for: ["细软塌发"],
    texture: "丰润",
    usage: "集中涂抹发尾，冲洗到仍保留一点顺滑感。",
    reason_template: "适合发尾干、打结明显、发丝偏粗硬的情况。"
  },
  {
    id: "p006",
    name: "轻修护发膜",
    brand: "示例品牌 Weekly",
    category: "mask",
    category_label: "发膜",
    price_level: "medium",
    suitable_for: ["发尾受损", "干枯", "染烫"],
    not_suitable_for: ["预算低", "容易塌"],
    texture: "乳霜",
    usage: "每周 1 次替代护发素，停留 5-8 分钟后冲洗。",
    reason_template: "适合作为周期修护，不需要每次洗头都使用。"
  },
  {
    id: "p007",
    name: "免洗保湿乳",
    brand: "示例品牌 Leave",
    category: "leave_in",
    category_label: "免洗护发",
    price_level: "medium",
    suitable_for: ["毛躁", "干枯", "第二天炸毛"],
    not_suitable_for: ["头皮油"],
    texture: "轻乳液",
    usage: "湿发时取少量抹在发中到发尾，再向上抓出卷度。",
    reason_template: "适合洗后补保湿，也适合第二天轻微 refresh。"
  },
  {
    id: "p008",
    name: "轻盈卷发霜",
    brand: "示例品牌 Curl B",
    category: "curl_cream",
    category_label: "弹力素 / 卷发霜",
    price_level: "low",
    suitable_for: ["卷度不明显", "定型差", "新手"],
    not_suitable_for: ["非常细软塌发"],
    texture: "轻乳霜",
    usage: "湿发分区少量涂抹，边抓边让卷度成型。",
    reason_template: "适合作为第一支定型辅助产品，使用门槛较低。"
  },
  {
    id: "p009",
    name: "自然感摩丝",
    brand: "示例品牌 Foam",
    category: "styling",
    category_label: "啫喱 / 摩丝",
    price_level: "medium",
    suitable_for: ["细软", "容易塌", "卷度不明显"],
    not_suitable_for: ["极干粗硬"],
    texture: "泡沫",
    usage: "湿发时按压 1-2 泵，从发尾向上托抓。",
    reason_template: "细软发更容易接受，能提供轻支撑而不显厚重。"
  },
  {
    id: "p010",
    name: "中度支撑啫喱",
    brand: "示例品牌 Hold",
    category: "styling",
    category_label: "啫喱 / 摩丝",
    price_level: "medium",
    suitable_for: ["定型差", "粗硬", "卷度不稳定"],
    not_suitable_for: ["不喜欢硬壳感", "发量少"],
    texture: "凝胶",
    usage: "湿发薄涂，干后轻轻抓开硬壳。",
    reason_template: "适合需要更强支撑、希望卷度维持更久的人。"
  },
  {
    id: "p011",
    name: "轻感护发油",
    brand: "示例品牌 Gloss",
    category: "oil",
    category_label: "精油 / 护发油",
    price_level: "high",
    suitable_for: ["发尾干枯", "毛躁", "粗硬"],
    not_suitable_for: ["细软塌发", "头皮油"],
    texture: "轻油",
    usage: "干发后只在发尾少量点涂，避免接触头皮。",
    reason_template: "适合最后处理发尾毛躁，但用量要很少。"
  },
  {
    id: "p012",
    name: "新手低预算套组",
    brand: "示例品牌 Basic",
    category: "bundle",
    category_label: "入门组合",
    price_level: "low",
    suitable_for: ["新手", "预算低", "建立新手 routine"],
    not_suitable_for: ["重度受损"],
    texture: "基础组合",
    usage: "先从洗发水、护发素、轻定型三步开始。",
    reason_template: "适合不想一次买太多产品的用户。"
  }
];

const concernToCategories: Record<string, string[]> = {
  毛躁: ["conditioner", "leave_in", "oil"],
  干枯: ["conditioner", "mask", "leave_in"],
  打结: ["conditioner", "leave_in"],
  卷度不明显: ["curl_cream", "styling"],
  容易塌: ["shampoo", "styling"],
  定型差: ["styling", "curl_cream"],
  发尾受损: ["mask", "conditioner", "oil"]
};

export function pickProducts(concerns: string[], budget: string, hairThickness: string) {
  const preferredCategories = new Set<string>();
  concerns.forEach((concern) => {
    concernToCategories[concern]?.forEach((category) => preferredCategories.add(category));
  });

  if (hairThickness === "细软") {
    preferredCategories.add("styling");
  }

  const budgetAllowed = (product: Product) => {
    if (budget === "入门低预算") {
      return product.price_level === "low" || product.price_level === "medium";
    }
    if (budget === "高预算") {
      return true;
    }
    return product.price_level !== "high";
  };

  const matched = seedProducts
    .filter((product) => preferredCategories.has(product.category) && budgetAllowed(product))
    .slice(0, 5);

  if (matched.length >= 3) {
    return matched;
  }

  return [
    ...matched,
    ...seedProducts.filter((product) => !matched.includes(product) && budgetAllowed(product))
  ].slice(0, 5);
}
