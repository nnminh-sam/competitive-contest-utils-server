CREATE TABLE IF NOT EXISTS public.team
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    name character varying COLLATE pg_catalog."default" NOT NULL,
    description character varying COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp without time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY (id),
    CONSTRAINT "UQ_cf461f5b40cf1a2b8876011e1e1" UNIQUE (name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.team
    OWNER to postgres;