import { AppHeader } from "@/components/AppHeader";
import { ResultView } from "@/components/ResultView";

export default async function ResultPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;

  return (
    <>
      <AppHeader />
      <ResultView sessionId={sessionId} />
    </>
  );
}
