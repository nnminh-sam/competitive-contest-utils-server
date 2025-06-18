CREATE TABLE IF NOT EXISTS public.contestants
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    email character varying COLLATE pg_catalog."default" NOT NULL,
    username character varying COLLATE pg_catalog."default" NOT NULL,
    password character varying COLLATE pg_catalog."default" NOT NULL,
    "firstName" character varying COLLATE pg_catalog."default" NOT NULL,
    "lastName" character varying COLLATE pg_catalog."default" NOT NULL,
    "studentId" character varying COLLATE pg_catalog."default" NOT NULL,
    gender character varying COLLATE pg_catalog."default" NOT NULL DEFAULT 'Other'::character varying,
    availability boolean NOT NULL DEFAULT true,
    "createdAt" timestamp without time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp without time zone NOT NULL DEFAULT now(),
    "teamId" uuid,
    "affiliationId" uuid NOT NULL,
    role integer DEFAULT 0,
    CONSTRAINT "PK_f6498cae7d3735ecfe149db4fff" PRIMARY KEY (id),
    CONSTRAINT "UQ_6402aa94a362abf813f8d66f722" UNIQUE ("studentId"),
    CONSTRAINT "UQ_ce14297526209a2488160dfe5d4" UNIQUE (email),
    CONSTRAINT "UQ_eac2e0d4bc5069ac938317f03a3" UNIQUE (username),
    CONSTRAINT "FK_4cee0183f8a2c2a024f82ce211d" FOREIGN KEY ("affiliationId")
        REFERENCES public.affiliation (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "FK_8a06abd785a83f9a393b53943af" FOREIGN KEY ("teamId")
        REFERENCES public.team (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.contestants
    OWNER to postgres;