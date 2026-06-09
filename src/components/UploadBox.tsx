"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ImagePlus, Loader2, ShieldCheck } from "lucide-react";
import { FlowSteps } from "@/components/FlowSteps";
import { trackEvent } from "@/lib/tracking/trackEvent";

export function UploadBox() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const canContinue = Boolean(file && sessionId);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSessionId(window.localStorage.getItem("haircare:sessionId"));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const fileLabel = useMemo(() => {
    if (!file) return "选择或拖入一张头发照片";
    return `${file.name} · ${(file.size / 1024 / 1024).toFixed(1)} MB`;
  }, [file]);

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0];
    if (!nextFile) return;
    setFile(nextFile);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setPreview(dataUrl);
      window.localStorage.setItem("haircare:imagePreview", dataUrl);
    };
    reader.readAsDataURL(nextFile);
  }

  async function submit() {
    if (!file || !sessionId) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      if (!response.ok) throw new Error("upload_failed");
      const data = (await response.json()) as { image_id: string; image_url: string };
      window.localStorage.setItem("haircare:imageId", data.image_id);
      window.localStorage.setItem("haircare:imageUrl", data.image_url);
      await trackEvent("upload_photo_success", { image_id: data.image_id }, sessionId);
      router.push("/quiz");
    } catch {
      await trackEvent("upload_photo_failed", {}, sessionId);
      alert("上传没有成功，请重新选择图片。");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <main className="page-shell">
      <FlowSteps current={0} />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="compact-card p-5 sm:p-7">
          <p className="text-sm font-semibold text-coral">照片上传</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">上传你的头发照片</h1>
          <p className="mt-3 max-w-2xl text-muted">
            建议自然光、自然状态，不需要露脸。P0 阶段默认不长期保存原图，只记录上传行为和流程数据。
          </p>

          <label className="mt-6 block rounded-lg border-2 border-dashed border-line bg-paper p-4 transition hover:border-moss">
            <input type="file" accept="image/*" className="sr-only" onChange={onFileChange} />
            <div className="grid min-h-72 place-items-center rounded-lg bg-white">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="上传预览" className="max-h-72 w-full rounded-lg object-contain" />
              ) : (
                <div className="text-center">
                  <ImagePlus className="mx-auto text-moss" size={34} aria-hidden />
                  <p className="mt-3 font-semibold text-ink">{fileLabel}</p>
                  <p className="mt-1 text-sm text-muted">支持 JPG、PNG、HEIC 浏览器可读格式</p>
                </div>
              )}
            </div>
          </label>

          <button
            type="button"
            onClick={submit}
            disabled={!canContinue || isUploading}
            className="focus-ring mt-5 inline-flex min-h-12 items-center gap-2 rounded-lg bg-moss px-5 py-3 font-semibold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploading ? <Loader2 className="animate-spin" size={18} aria-hidden /> : <ArrowRight size={18} aria-hidden />}
            下一步
          </button>
        </section>

        <aside className="grid gap-4">
          {["尽量使用自然光", "尽量拍到整体轮廓", "尽量拍到发尾状态", "不要过度美颜或滤镜"].map((tip) => (
            <div key={tip} className="compact-card flex items-center gap-3 p-4">
              <ShieldCheck className="text-moss" size={20} aria-hidden />
              <span className="font-medium text-ink">{tip}</span>
            </div>
          ))}
        </aside>
      </div>
    </main>
  );
}
