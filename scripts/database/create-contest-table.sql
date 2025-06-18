CREATE TABLE IF NOT EXISTS public.contest
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    name character varying COLLATE pg_catalog."default" NOT NULL,
    "formalName" character varying COLLATE pg_catalog."default" NOT NULL,
    description character varying COLLATE pg_catalog."default" NOT NULL,
    banner character varying COLLATE pg_catalog."default" NOT NULL,
    "startAt" timestamp without time zone NOT NULL,
    duration integer NOT NULL,
    type character varying COLLATE pg_catalog."default" NOT NULL DEFAULT 'SINGLE'::character varying,
    "createdAt" timestamp without time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT "PK_ba048331bed7d939b857e9c1c63" PRIMARY KEY (id),
    CONSTRAINT "UQ_539e3441ee788f535c7d0e2a048" UNIQUE (name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.contest
    OWNER to postgres;