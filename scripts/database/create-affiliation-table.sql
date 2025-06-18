CREATE TABLE IF NOT EXISTS public.affiliation
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    name character varying COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp without time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT "PK_faec2110a0fda4a0b7f93df6e6a" PRIMARY KEY (id),
    CONSTRAINT "UQ_0a266ecb9defdbfb5088e8a9ee6" UNIQUE (name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.affiliation
    OWNER to postgres;