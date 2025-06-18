CREATE TABLE IF NOT EXISTS public.contest_participations
(
    "contestId" uuid NOT NULL,
    "contestantId" uuid NOT NULL,
    "createdAt" timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT "PK_da71f8a5ff1c31604d2585ef1ea" PRIMARY KEY ("contestId", "contestantId"),
    CONSTRAINT "FK_0f9c67107e2d270d9c1bc4a5481" FOREIGN KEY ("contestantId")
        REFERENCES public.contestants (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT "FK_549679dafe31ecd07dee499adac" FOREIGN KEY ("contestId")
        REFERENCES public.contest (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.contest_participations
    OWNER to postgres;