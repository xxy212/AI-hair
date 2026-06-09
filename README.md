# AI 自然卷护理助手 P0

这是一个基于 Next.js 的 Web MVP，用来跑通「上传头发照片 -> 填写自然卷问卷 -> 生成护理方案 -> 查看产品建议和教程 -> 提交反馈」的 P0 流程。

## 技术栈

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Next.js API Routes
- 可选 Supabase 数据写入

## 已实现

- 首页：产品介绍、示例案例、功能说明、开始测试入口。
- 照片上传页：头发照片选择、本地预览、上传行为记录。
- 问卷页：已使用 `curly_quiz.html` 中的 7 题问卷内容，包括 CGM 分支追问、染烫、孔隙度、地区、预算和当前产品。
- 分析等待页：展示 AI 分析中的阶段文案，并调用 `/api/analyze`。
- 结果页：展示发质画像、初步判断、护理策略、产品类型建议、示例产品、洗头日教程、第二天 refresh 和新手避坑。
- 反馈入口：支持提交「有帮助 / 不准确 / 太复杂 / 想要更低预算」等反馈。
- API：
  - `POST /api/session`
  - `POST /api/upload`
  - `POST /api/analyze`
  - `GET /api/result/[sessionId]`
  - `POST /api/feedback`
  - `POST /api/track`
- 数据回流：
  - 当前默认写入服务端内存 store。
  - 如果配置 Supabase 环境变量，会尝试写入 Supabase。
  - Supabase 建表 SQL 在 `src/lib/db/schema.sql`。

## 未实现

- 真实 AI 图片识别。
- 真实 LLM 结构化生成。
- Supabase Storage 图片长期存储。
- 用户登录和历史方案保存。
- 真实商品库、商品详情页、电商跳转。
- AI 对话式追问和实时方案调整。
- 后台数据看板。
- 真实用户案例系统。
- 方案导出、收藏、分享。
- 多语言或海外产品适配。

## 当前静态写死 / 临时 fallback 的部分

- 首页案例是示例内容，不是真实用户授权案例。
- 首页视觉图是 CSS 生成的示意图，不是真实头发图片。
- 上传的头发照片只在浏览器做本地预览，API 返回 `local-preview://...`，没有真正上传到对象存储。
- 第 7 题产品照片只记录选择数量，没有做产品图识别、OCR 或成分分析。
- `/api/analyze` 没有调用真实 AI，而是使用 `src/lib/ai/generateResult.ts` 中的规则化 fallback。
- 发质画像由问卷答案规则推断，不是多模态模型判断。
- 产品推荐来自 `src/lib/data/seedProducts.ts` 中的种子产品数组，不是真实商品数据库。
- 产品匹配逻辑是关键词和预算规则，不是个性化推荐模型。
- 护理教程是规则模板生成，不是 LLM 动态生成。
- 埋点和业务数据默认保存在进程内存，服务重启后会丢失。
- Supabase 写入是可选能力，只在配置环境变量且建表完成后生效。

## 环境变量

当前不配置环境变量也可以跑通演示流程。

可选变量：

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

AI_API_KEY=
AI_MODEL_TEXT=
AI_MODEL_VISION=

NEXT_PUBLIC_APP_URL=
```

说明：

- `SUPABASE_SERVICE_ROLE_KEY` 仅用于服务端 API 写入数据，不要暴露到前端。
- `AI_API_KEY` 目前只作为占位，当前代码还没有接入真实 AI 调用。

## 本地开发

```bash
npm install
npm run dev
```

默认访问：

```text
http://127.0.0.1:3000
```

## 构建和检查

```bash
npm run lint
npm run build
```

当前已验证：

- `npm run lint` 通过。
- `npm run build` 通过。

注意：`npm audit --omit=dev` 当前会报告 Next.js 内部 PostCSS 依赖的 moderate 风险。npm 给出的自动修复会把 Next 降级到旧大版本，不建议直接执行 `npm audit fix --force`。

## 代码结构

```text
src/
├── app/
│   ├── page.tsx
│   ├── upload/page.tsx
│   ├── quiz/page.tsx
│   ├── analyzing/page.tsx
│   ├── result/[sessionId]/page.tsx
│   └── api/
├── components/
└── lib/
    ├── ai/
    ├── data/
    ├── db/
    └── tracking/
```

## 注意

- 如果要接真实 AI，优先替换 `src/lib/ai/generateResult.ts`，保持返回结构不变，避免结果页渲染被自由文本破坏。
- 如果要接 Supabase，先执行 `src/lib/db/schema.sql`，再配置环境变量。
