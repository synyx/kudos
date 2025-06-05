CREATE TABLE "Kudo" (
	"id" serial PRIMARY KEY NOT NULL,
	"kudoTitle" varchar(20) DEFAULT 'WELL_DONE',
	"createdAt" timestamp (6) DEFAULT now() NOT NULL,
	"content" varchar(1000) DEFAULT '',
	"from" varchar(255) DEFAULT '-',
	"to" varchar(255) DEFAULT '-',
	"img" text DEFAULT '',
	"archived" boolean DEFAULT false
);
