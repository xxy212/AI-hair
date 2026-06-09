# AI 自然卷护理助手 MVP 开发文档

## 1. 项目概述

本项目是一个面向中国自然卷新手用户的 AI 卷发护理助手 MVP。

用户通过首页了解产品功能和成功案例，随后上传头发照片并填写基础问卷。系统调用 AI API 对照片和问卷信息进行分析，生成用户发质画像、产品类型建议、示例产品推荐和基础护理教程。

首版 MVP 的目标不是追求发质判断和产品推荐的高准确率，而是快速跑通完整产品形态，并支持上线后收集用户数据，为后续优化推荐质量、产品库和用户体验提供依据。

---

## 2. 当前明确需求

### 2.1 快速部署上线

首版需要尽快形成一个可访问的 Web MVP，便于组内演示、早期用户测试和数据收集。

建议优先选择：

* 前端：Next.js
* UI：Tailwind CSS
* 部署：Vercel
* 数据库：Supabase
* AI 能力：直接接入 AI API
* 图片存储：Supabase Storage 或临时上传方案

---

### 2.2 能够进行数据回流

MVP 需要记录用户在核心流程中的关键数据，包括：

* 用户上传行为
* 问卷答案
* AI 分析结果
* 推荐结果
* 用户是否完成流程
* 用户是否点击某类产品或教程
* 用户对结果的反馈

数据回流的目的不是一开始训练模型，而是帮助团队判断：

* 哪些用户真的愿意完成测试
* 哪些问题用户最常选择
* 哪类推荐结果更容易被用户接受
* AI 输出是否经常离谱
* 后续应该优化问卷、产品库还是 AI prompt

---

### 2.3 实现核心功能

首版 MVP 需要实现以下主流程：

```text
首页
→ 上传头发照片
→ 填写问卷
→ AI 生成发质画像
→ 推荐产品类型和示例产品
→ 生成护理教程
→ 数据回流
```

其中，最后的 AI 对话功能可以先省略，放到下一阶段。

---

## 3. 首版 MVP 范围

### 3.1 必做功能

| 模块    | 功能                   | 优先级 |
| ----- | -------------------- | --- |
| 首页    | 展示成功案例和产品主要功能        | P0  |
| 照片上传  | 用户上传头发照片             | P0  |
| 问卷    | 收集用户头皮、发质、预算、护理目标等信息 | P0  |
| AI 分析 | 根据照片和问卷生成发质画像        | P0  |
| 产品建议  | 推荐产品类型和示例产品          | P0  |
| 护理教程  | 生成洗头日和日常护理步骤         | P0  |
| 数据回流  | 存储问卷、AI 结果、推荐结果和用户行为 | P0  |
| 部署上线  | 可通过链接访问 Web MVP      | P0  |

---

### 3.2 可选功能

| 模块     | 功能             | 说明        |
| ------ | -------------- | --------- |
| AI 对话  | 用户继续追问并调整方案    | 首版可省略     |
| 登录系统   | 用户保存历史方案       | 首版不建议做    |
| 电商跳转   | 跳转商品购买链接       | 可后续添加     |
| 真实用户案例 | 展示用户授权案例       | 首版可先用示例案例 |
| 产品收藏   | 收藏推荐产品         | 后续添加      |
| 方案导出   | 保存护理方案为图片或 PDF | 后续添加      |

---

## 4. 产品页面规划

### 4.1 首页

#### 页面目标

让用户快速理解产品价值，并愿意开始测试。

#### 页面内容

首页需要包括：

1. 产品标题
2. 产品一句话介绍
3. 成功案例展示
4. 产品主要功能介绍
5. 开始测试按钮

#### 推荐结构

```text
首页
├── 顶部品牌区
│   ├── 产品名称
│   └── 简短 slogan
│
├── 成功案例区
│   ├── 案例 1：自然卷新手建立基础 routine
│   ├── 案例 2：毛躁发质获得护理建议
│   └── 案例 3：不知道买什么产品的新手获得推荐
│
├── 功能介绍区
│   ├── 上传照片辅助分析
│   ├── 问卷生成个人发质画像
│   ├── 推荐产品类型和示例产品
│   └── 生成护理教程
│
└── CTA
    └── 开始发质测试
```

#### 数据回流

需要记录：

* 首页访问
* 点击开始测试按钮
* 用户是否从首页进入测试流程

---

### 4.2 照片上传页

#### 页面目标

让用户上传一张头发照片，用于 AI 辅助分析。

#### 页面内容

1. 上传组件
2. 拍摄建议
3. 隐私说明
4. 下一步按钮

#### 拍摄建议

```text
- 尽量使用自然光
- 不需要露脸
- 尽量拍到头发整体轮廓
- 尽量拍到发尾状态
- 不要过度美颜或滤镜
```

#### 数据回流

需要记录：

* 是否上传照片
* 图片上传时间
* 图片是否上传成功
* AI 是否成功分析照片

建议首版默认不长期保存用户原图，或仅保存图片访问 URL 和用户授权状态。

---

### 4.3 问卷页

#### 页面目标

收集照片无法判断的信息，提升 AI 分析结果的可用性。

#### 推荐问卷问题

| 问题       | 选项                                            |
| -------- | --------------------------------------------- |
| 你的头皮状态？  | 油 / 干 / 敏感 / 正常 / 不确定                         |
| 你的主要问题？  | 毛躁 / 干枯 / 打结 / 卷度不明显 / 容易塌 / 定型差 / 发尾受损       |
| 你的发量？    | 少 / 中 / 多 / 不确定                               |
| 你的发丝粗细？  | 细软 / 中等 / 粗硬 / 不确定                            |
| 是否染烫过？   | 没有 / 最近 6 个月染烫过 / 经常染烫 / 不确定                  |
| 现在有什么产品？ | 洗发水 / 护发素 / 发膜 / 精油 / 弹力素 / 啫喱 / 摩丝 / 都没有     |
| 预算范围？    | 入门低预算 / 中等预算 / 高预算 / 先不考虑预算                   |
| 当前目标？    | 减少毛躁 / 卷度更明显 / 洗完更好看 / 第二天也能维持 / 建立新手 routine |

#### 数据回流

需要记录：

* 每道题的答案
* 用户是否完成问卷
* 用户在哪一道题退出
* 完成问卷耗时

---

### 4.4 AI 分析页

#### 页面目标

承接用户等待时间，展示系统正在生成个性化建议。

#### 页面内容

可以展示动态文案：

```text
正在分析你的卷度和毛躁情况……
正在结合问卷生成发质画像……
正在匹配适合新手的产品类型……
正在生成你的洗头日护理教程……
```

#### 数据回流

需要记录：

* AI 请求开始时间
* AI 请求结束时间
* AI 请求是否成功
* AI 响应耗时
* AI 是否返回有效 JSON
* 如果失败，失败原因

---

### 4.5 结果页

#### 页面目标

向用户展示完整护理方案。

#### 页面模块

结果页建议包含：

```text
结果页
├── 发质画像
│   ├── 卷度初步判断
│   ├── 主要问题
│   ├── 当前护理策略
│   └── 注意事项
│
├── 产品类型建议
│   ├── 清洁类
│   ├── 护发类
│   ├── 免洗护理类
│   ├── 定型类
│   └── 周期修护类
│
├── 示例产品
│   ├── 产品名称
│   ├── 产品类型
│   ├── 价格层级
│   ├── 推荐原因
│   └── 使用方法
│
├── 护理教程
│   ├── 洗头日步骤
│   ├── 吹干 / 自然干建议
│   ├── 第二天 refresh 建议
│   └── 新手避坑提醒
│
└── 反馈入口
    ├── 这个结果有帮助
    ├── 不太准确
    ├── 推荐太复杂
    └── 想要更低预算方案
```

#### 数据回流

需要记录：

* 用户是否查看结果页
* 用户停留时长
* 用户点击了哪些产品卡片
* 用户是否展开教程
* 用户是否提交反馈
* 用户对结果的满意度

---

## 5. 技术架构

### 5.1 总体架构

```text
用户浏览器
  ↓
Next.js Web App
  ↓
API Routes / Backend API
  ↓
AI Orchestrator
  ↓
AI API
  ↓
结构化结果
  ↓
Supabase 数据存储
```

---

### 5.2 推荐技术栈

| 层级   | 推荐方案                   | 说明              |
| ---- | ---------------------- | --------------- |
| 前端   | Next.js                | 方便快速开发和部署       |
| UI   | Tailwind CSS           | 快速搭建响应式页面       |
| 后端   | Next.js API Routes     | MVP 阶段减少服务拆分    |
| 数据库  | Supabase PostgreSQL    | 快速支持数据回流        |
| 图片存储 | Supabase Storage       | 存储用户上传图片或临时 URL |
| AI   | 多模态 AI API + LLM API   | 分析图片、生成推荐和教程    |
| 部署   | Vercel                 | 快速上线            |
| 日志   | Supabase + Vercel Logs | MVP 阶段够用        |

---

### 5.3 模块划分

```text
src/
├── app/
│   ├── page.tsx                  # 首页
│   ├── upload/page.tsx           # 照片上传页
│   ├── quiz/page.tsx             # 问卷页
│   ├── analyzing/page.tsx        # AI 分析页
│   └── result/[sessionId]/page.tsx # 结果页
│
├── components/
│   ├── CaseCard.tsx
│   ├── FeatureCard.tsx
│   ├── UploadBox.tsx
│   ├── QuizQuestion.tsx
│   ├── ProductCard.tsx
│   ├── TutorialStep.tsx
│   └── FeedbackPanel.tsx
│
├── lib/
│   ├── ai/
│   │   ├── analyzePhoto.ts
│   │   ├── createHairProfile.ts
│   │   ├── generateRecommendation.ts
│   │   └── generateTutorial.ts
│   │
│   ├── db/
│   │   └── supabase.ts
│   │
│   ├── data/
│   │   └── seedProducts.ts
│   │
│   └── tracking/
│       └── trackEvent.ts
│
└── app/api/
    ├── upload/route.ts
    ├── analyze/route.ts
    ├── recommend/route.ts
    ├── feedback/route.ts
    └── track/route.ts
```

---

## 6. AI Pipeline

### 6.1 AI 处理流程

```text
用户上传照片
  ↓
照片分析
  ↓
结合问卷生成发质画像
  ↓
匹配产品类型和示例产品
  ↓
生成护理教程
  ↓
结果页展示
```

---

### 6.2 照片分析输出

```json
{
  "curl_pattern_guess": "轻中度自然卷",
  "frizz_level": "中等",
  "volume_level": "中等偏多",
  "dryness_guess": "发尾可能偏干",
  "confidence": "medium",
  "visual_notes": [
    "发尾有一定毛躁",
    "卷度主要集中在中下段",
    "发根卷度不明显"
  ]
}
```

---

### 6.3 发质画像输出

```json
{
  "profile_title": "轻中度自然卷新手",
  "hair_summary": "你的头发偏干、容易毛躁，卷度有基础但目前缺少定型步骤。",
  "main_concerns": ["毛躁", "发尾偏干", "卷度不稳定"],
  "care_strategy": "先建立保湿和轻定型 routine",
  "avoid": ["过重发油", "一次叠加太多产品", "高温直接吹干"]
}
```

---

### 6.4 产品推荐输出

```json
{
  "routine_level": "新手入门",
  "recommended_categories": [
    {
      "category": "护发素",
      "why_needed": "帮助改善发尾干枯和打结。",
      "priority": "high",
      "how_to_choose": "选择保湿型、不要过于厚重。"
    },
    {
      "category": "轻度定型产品",
      "why_needed": "帮助卷度维持到干发后。",
      "priority": "medium",
      "how_to_choose": "细软发优先摩丝，粗硬发可以考虑啫喱。"
    }
  ],
  "example_products": [
    {
      "name": "示例产品 A",
      "category": "护发素",
      "price_level": "中等",
      "reason": "适合新手建立基础保湿步骤。",
      "usage": "洗发后涂抹发中至发尾，停留 2-3 分钟后冲洗。"
    }
  ]
}
```

---

### 6.5 教程输出

```json
{
  "wash_day_tutorial": [
    {
      "step": 1,
      "title": "洗发重点放在头皮",
      "detail": "发尾不要反复揉搓，冲洗时让泡沫自然带过即可。"
    },
    {
      "step": 2,
      "title": "护发素只上发中到发尾",
      "detail": "避免涂到头皮，减少头皮油腻和塌发。"
    }
  ],
  "refresh_tutorial": [
    "第二天早上用喷雾轻微打湿发尾。",
    "少量补充免洗或定型产品。",
    "用手向上抓出卷度。"
  ],
  "beginner_tips": [
    "不要用普通毛巾大力摩擦。",
    "第一次不要叠加太多产品。",
    "每次只调整一个变量，方便判断哪个步骤有效。"
  ]
}
```

---

## 7. 数据回流设计

### 7.1 核心数据对象

#### user_sessions

记录一次完整测试流程。

| 字段           | 类型        | 说明                              |
| ------------ | --------- | ------------------------------- |
| id           | uuid      | session id                      |
| created_at   | timestamp | 创建时间                            |
| source       | text      | 来源渠道                            |
| status       | text      | started / completed / abandoned |
| current_step | text      | 当前步骤                            |
| completed_at | timestamp | 完成时间                            |

---

#### uploaded_images

记录用户图片上传信息。

| 字段            | 类型        | 说明               |
| ------------- | --------- | ---------------- |
| id            | uuid      | 图片 id            |
| session_id    | uuid      | 关联 session       |
| image_url     | text      | 图片 URL           |
| storage_path  | text      | 存储路径             |
| upload_status | text      | success / failed |
| created_at    | timestamp | 上传时间             |

---

#### quiz_answers

记录问卷答案。

| 字段               | 类型        | 说明         |
| ---------------- | --------- | ---------- |
| id               | uuid      | 记录 id      |
| session_id       | uuid      | 关联 session |
| scalp_type       | text      | 头皮状态       |
| main_concerns    | jsonb     | 主要问题       |
| hair_density     | text      | 发量         |
| hair_thickness   | text      | 发丝粗细       |
| chemical_history | text      | 染烫情况       |
| owned_products   | jsonb     | 已有产品       |
| budget           | text      | 预算         |
| goals            | jsonb     | 护理目标       |
| created_at       | timestamp | 提交时间       |

---

#### ai_results

记录 AI 生成结果。

| 字段              | 类型        | 说明         |
| --------------- | --------- | ---------- |
| id              | uuid      | 结果 id      |
| session_id      | uuid      | 关联 session |
| photo_analysis  | jsonb     | 照片分析结果     |
| hair_profile    | jsonb     | 发质画像       |
| recommendations | jsonb     | 产品建议       |
| tutorial        | jsonb     | 护理教程       |
| ai_model        | text      | 使用模型       |
| latency_ms      | int       | 响应耗时       |
| is_success      | boolean   | 是否成功       |
| error_message   | text      | 错误信息       |
| created_at      | timestamp | 创建时间       |

---

#### user_feedback

记录用户对结果的反馈。

| 字段            | 类型        | 说明                                                 |
| ------------- | --------- | -------------------------------------------------- |
| id            | uuid      | 反馈 id                                              |
| session_id    | uuid      | 关联 session                                         |
| feedback_type | text      | helpful / inaccurate / too_complex / too_expensive |
| feedback_text | text      | 用户补充说明                                             |
| created_at    | timestamp | 提交时间                                               |

---

#### user_events

记录用户行为事件。

| 字段            | 类型        | 说明         |
| ------------- | --------- | ---------- |
| id            | uuid      | 事件 id      |
| session_id    | uuid      | 关联 session |
| event_name    | text      | 事件名称       |
| event_payload | jsonb     | 事件详情       |
| created_at    | timestamp | 事件时间       |

---

### 7.2 推荐埋点事件

| 事件名                   | 触发时机     |
| --------------------- | -------- |
| page_view_home        | 访问首页     |
| click_start_test      | 点击开始测试   |
| upload_photo_success  | 照片上传成功   |
| upload_photo_failed   | 照片上传失败   |
| quiz_started          | 开始问卷     |
| quiz_completed        | 完成问卷     |
| ai_analysis_started   | 开始 AI 分析 |
| ai_analysis_completed | AI 分析完成  |
| ai_analysis_failed    | AI 分析失败  |
| result_page_viewed    | 查看结果页    |
| product_card_clicked  | 点击产品卡片   |
| tutorial_expanded     | 展开教程     |
| feedback_submitted    | 提交反馈     |

---

## 8. 种子产品库

### 8.1 首版数据规模

首版建议准备约 30 条种子产品数据。

| 类别        |  数量 |
| --------- | --: |
| 洗发水       | 4-6 |
| 护发素       | 4-6 |
| 发膜        | 4-6 |
| 免洗护发      | 4-6 |
| 弹力素 / 卷发霜 | 4-6 |
| 啫喱 / 摩丝   | 4-6 |
| 精油 / 护发油  | 2-4 |

---

### 8.2 单条产品字段

```json
{
  "id": "p001",
  "name": "示例产品名",
  "brand": "品牌名",
  "category": "conditioner",
  "price_level": "low",
  "suitable_for": ["毛躁", "干枯", "新手"],
  "not_suitable_for": ["细软塌发", "头皮油"],
  "texture": "轻盈",
  "usage": "洗发后涂抹发中至发尾，停留 2-3 分钟后冲洗。",
  "reason_template": "适合新手建立基础保湿步骤。"
}
```

---

## 9. 接口设计

虽然 v0.7 展示文档中删除了 API 草案，但开发文档需要保留最小接口设计，方便工程实现。

### 9.1 创建 Session

```http
POST /api/session
```

用途：用户点击开始测试后创建一次测试流程。

请求：

```json
{
  "source": "home"
}
```

响应：

```json
{
  "session_id": "uuid"
}
```

---

### 9.2 上传图片

```http
POST /api/upload
```

用途：上传用户头发照片。

响应：

```json
{
  "image_id": "uuid",
  "image_url": "https://..."
}
```

---

### 9.3 提交问卷并生成结果

```http
POST /api/analyze
```

用途：提交照片和问卷，调用 AI 生成完整结果。

请求：

```json
{
  "session_id": "uuid",
  "image_url": "https://...",
  "quiz_answers": {
    "scalp_type": "油",
    "main_concerns": ["毛躁", "干枯"],
    "hair_density": "中",
    "hair_thickness": "细软",
    "chemical_history": "没有",
    "owned_products": ["洗发水", "护发素"],
    "budget": "中等预算",
    "goals": ["减少毛躁", "建立新手 routine"]
  }
}
```

响应：

```json
{
  "session_id": "uuid",
  "photo_analysis": {},
  "hair_profile": {},
  "recommendations": {},
  "tutorial": {}
}
```

---

### 9.4 提交反馈

```http
POST /api/feedback
```

用途：用户在结果页提交反馈。

请求：

```json
{
  "session_id": "uuid",
  "feedback_type": "helpful",
  "feedback_text": "推荐看起来比较清楚"
}
```

响应：

```json
{
  "success": true
}
```

---

### 9.5 记录事件

```http
POST /api/track
```

用途：记录用户行为事件。

请求：

```json
{
  "session_id": "uuid",
  "event_name": "result_page_viewed",
  "event_payload": {}
}
```

响应：

```json
{
  "success": true
}
```

---

## 10. 快速上线方案

### 10.1 推荐部署方式

```text
GitHub Repository
  ↓
Vercel 自动部署
  ↓
Supabase 数据库
  ↓
AI API
```

---

### 10.2 环境变量

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

AI_API_KEY=
AI_MODEL_TEXT=
AI_MODEL_VISION=

NEXT_PUBLIC_APP_URL=
```

---

### 10.3 上线前检查清单

```text
- 首页可以访问
- 点击开始测试可以创建 session
- 图片可以上传
- 问卷可以提交
- AI 可以返回结构化结果
- 结果页可以正常渲染
- 用户反馈可以提交
- user_events 有数据
- ai_results 有数据
- 失败时有基础错误提示
- 移动端页面可用
```

---

## 11. 首版验收标准

### 11.1 产品验收

```text
- 用户可以从首页进入测试
- 用户可以上传头发照片
- 用户可以完成问卷
- 用户可以获得发质画像
- 用户可以看到产品类型建议
- 用户可以看到示例产品
- 用户可以看到护理教程
- 用户可以提交反馈
```

---

### 11.2 技术验收

```text
- 项目可以通过 Vercel 部署上线
- Supabase 可以记录 session
- Supabase 可以记录问卷答案
- Supabase 可以记录 AI 结果
- Supabase 可以记录用户反馈
- Supabase 可以记录用户事件
- AI API 失败时页面不会崩溃
- 前端渲染不依赖自由文本结构
```

---

### 11.3 数据验收

```text
- 能看到总访问人数
- 能看到开始测试人数
- 能看到完成问卷人数
- 能看到生成结果人数
- 能看到用户反馈数量
- 能看到 AI 请求成功率
- 能看到用户在哪一步流失
```

---

## 12. 其他注意事项

| 问题        | 简要方案                                 |
| --------- | ------------------------------------ |
| 首页案例真实性   | 首版可使用模拟案例，但需要标注为示例案例；后续替换为真实用户授权案例。  |
| 照片隐私      | 上传页说明照片仅用于生成护理建议；MVP 阶段默认不长期保存原图。    |
| AI 输出不稳定  | 所有 AI 结果使用结构化 JSON，前端只渲染固定字段。        |
| 推荐显得不可信   | 每个产品类型和示例产品都附带“为什么适合你”和“怎么使用”。       |
| 产品数据不足    | 优先推荐产品类型，再给少量示例产品。                   |
| 护理建议过度承诺  | 避免“保证有效”“专业诊断”等表达，统一写成“护理参考建议”。      |
| 用户不知道如何反馈 | 结果页底部提供明确反馈按钮。                       |
| AI 对话暂不做  | 首版结果页保留“继续优化方案”入口，但可以先做成反馈按钮，不接实时聊天。 |

---

## 13. 下一阶段方向

首版 MVP 跑通后，可以继续迭代：

```text
1. 增加 AI 对话，根据用户反馈实时调整方案
2. 扩大产品库，从 30 条扩展到 100-300 条
3. 引入真实用户案例和前后对比
4. 增加方案保存和分享
5. 增加商品跳转和导购转化
6. 支持用户历史记录
7. 优化照片分析 prompt
8. 根据回流数据优化问卷题目
9. 为欧美市场做语言和产品适配
```

---

## 14. 当前开发优先级

### P0：必须完成

```text
首页
照片上传
问卷
AI 分析
结果页
产品推荐
护理教程
数据回流
部署上线
```

### P1：上线后尽快补充

```text
反馈入口优化
产品数据扩充
AI 输出质量优化
基础数据看板
移动端体验优化
```

### P2：后续迭代

```text
AI 对话
登录系统
收藏功能
导购跳转
用户案例系统
多语言和欧美市场适配
```
