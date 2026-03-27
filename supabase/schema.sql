-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.default_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  template jsonb NOT NULL,
  template_type text NOT NULL CHECK (template_type = ANY (ARRAY['sharepic'::text, 'overlay'::text])),
  enabled boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT default_templates_pkey PRIMARY KEY (id)
);
CREATE TABLE public.shared_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  template jsonb NOT NULL CHECK (pg_column_size(template) < 524288),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT shared_templates_pkey PRIMARY KEY (id)
);
-- RLS: anon darf insert + select
CREATE TABLE public.template_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  template jsonb NOT NULL,
  message text,
  submitted_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT template_submissions_pkey PRIMARY KEY (id)
);
