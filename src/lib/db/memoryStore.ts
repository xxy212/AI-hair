import type {
  AiResult,
  QuizAnswers,
  UploadedImage,
  UserEvent,
  UserFeedback,
  UserSession
} from "@/lib/types";

type MemoryStore = {
  sessions: Map<string, UserSession>;
  images: Map<string, UploadedImage>;
  quizAnswers: Map<string, QuizAnswers & { session_id: string; created_at: string }>;
  aiResults: Map<string, AiResult>;
  events: UserEvent[];
  feedback: UserFeedback[];
};

const globalForStore = globalThis as unknown as {
  __aiHairMemoryStore?: MemoryStore;
};

export const memoryStore: MemoryStore =
  globalForStore.__aiHairMemoryStore ??
  (globalForStore.__aiHairMemoryStore = {
    sessions: new Map(),
    images: new Map(),
    quizAnswers: new Map(),
    aiResults: new Map(),
    events: [],
    feedback: []
  });
