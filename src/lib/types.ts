export type QuizAnswers = {
  main_concerns: string[];
  cgm_experience: string;
  cgm_duration?: string;
  cgm_routine?: string[];
  chemical_history: string;
  porosity: string;
  region: string;
  budget: string;
  current_products_status: string;
  current_product_names?: string;
  product_photo_count?: number;
};

export type PhotoAnalysis = {
  curl_pattern_guess: string;
  frizz_level: string;
  volume_level: string;
  dryness_guess: string;
  confidence: "low" | "medium" | "high";
  visual_notes: string[];
};

export type HairProfile = {
  profile_title: string;
  hair_summary: string;
  main_concerns: string[];
  care_strategy: string;
  avoid: string[];
};

export type RecommendedCategory = {
  category: string;
  why_needed: string;
  priority: "high" | "medium" | "low";
  how_to_choose: string;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  category_label: string;
  price_level: "low" | "medium" | "high";
  suitable_for: string[];
  not_suitable_for: string[];
  texture: string;
  usage: string;
  reason_template: string;
};

export type Recommendation = {
  routine_level: string;
  recommended_categories: RecommendedCategory[];
  example_products: Product[];
};

export type TutorialStep = {
  step: number;
  title: string;
  detail: string;
};

export type Tutorial = {
  wash_day_tutorial: TutorialStep[];
  refresh_tutorial: string[];
  beginner_tips: string[];
};

export type AiResult = {
  session_id: string;
  photo_analysis: PhotoAnalysis;
  hair_profile: HairProfile;
  recommendations: Recommendation;
  tutorial: Tutorial;
  ai_model: string;
  latency_ms: number;
  is_success: boolean;
  error_message?: string | null;
};

export type UserSession = {
  id: string;
  created_at: string;
  source: string;
  status: "started" | "completed" | "abandoned";
  current_step: string;
  completed_at?: string | null;
};

export type UploadedImage = {
  id: string;
  session_id: string;
  image_url: string;
  storage_path: string;
  upload_status: "success" | "failed";
  created_at: string;
};

export type UserEvent = {
  id: string;
  session_id?: string | null;
  event_name: string;
  event_payload: Record<string, unknown>;
  created_at: string;
};

export type UserFeedback = {
  id: string;
  session_id: string;
  feedback_type: "helpful" | "inaccurate" | "too_complex" | "too_expensive";
  feedback_text?: string;
  created_at: string;
};
