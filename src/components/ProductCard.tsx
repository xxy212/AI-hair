"use client";

import { ShoppingBag } from "lucide-react";
import { trackEvent } from "@/lib/tracking/trackEvent";
import type { Product } from "@/lib/types";

const priceLabel = {
  low: "入门",
  medium: "中等",
  high: "高预算"
};

export function ProductCard({ product, sessionId }: { product: Product; sessionId: string }) {
  return (
    <button
      type="button"
      onClick={() => trackEvent("product_card_clicked", { product_id: product.id, category: product.category }, sessionId)}
      className="focus-ring compact-card w-full p-5 text-left transition hover:-translate-y-0.5 hover:border-moss"
    >
      <div className="flex gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-lg bg-sky text-ink">
          <ShoppingBag size={20} aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-coral">{product.brand}</p>
          <h3 className="mt-1 font-semibold text-ink">{product.name}</h3>
          <p className="mt-1 text-sm text-muted">{product.category_label} · {priceLabel[product.price_level]}</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted">{product.reason_template}</p>
      <p className="mt-3 text-sm font-medium text-ink">用法：{product.usage}</p>
    </button>
  );
}
