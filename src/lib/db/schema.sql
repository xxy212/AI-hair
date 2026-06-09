create table if not exists user_sessions (
  id uuid primary key,
  created_at timestamptz not null default now(),
  source text not null,
  status text not null,
  current_step text not null,
  completed_at timestamptz
);

create table if not exists uploaded_images (
  id uuid primary key,
  session_id uuid references user_sessions(id),
  image_url text,
  storage_path text,
  upload_status text not null,
  created_at timestamptz not null default now()
);

create table if not exists quiz_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references user_sessions(id),
  main_concerns jsonb,
  cgm_experience text,
  cgm_duration text,
  cgm_routine jsonb,
  chemical_history text,
  porosity text,
  region text,
  budget text,
  current_products_status text,
  current_product_names text,
  product_photo_count integer,
  created_at timestamptz not null default now()
);

create table if not exists ai_results (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references user_sessions(id),
  photo_analysis jsonb,
  hair_profile jsonb,
  recommendations jsonb,
  tutorial jsonb,
  ai_model text,
  latency_ms integer,
  is_success boolean,
  error_message text,
  created_at timestamptz not null default now()
);

create table if not exists user_feedback (
  id uuid primary key,
  session_id uuid references user_sessions(id),
  feedback_type text not null,
  feedback_text text,
  created_at timestamptz not null default now()
);

create table if not exists user_events (
  id uuid primary key,
  session_id uuid,
  event_name text not null,
  event_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
