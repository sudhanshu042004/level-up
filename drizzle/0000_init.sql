CREATE TYPE "public"."difficulty" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "public"."rank" AS ENUM('Dormant', 'Awakened', 'Ascended', 'Transcendent');--> statement-breakpoint
CREATE TABLE "skills" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "skills_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"skillName" varchar(256) NOT NULL,
	"difficulty" "difficulty" DEFAULT 'medium' NOT NULL,
	"skills" integer,
	"tracks" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tracks" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tracks_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"trackName" varchar(256) NOT NULL,
	"difficulty" "difficulty" DEFAULT 'medium' NOT NULL,
	"visibility" boolean DEFAULT true,
	"dueDate" timestamp,
	"users" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"username" varchar(256) NOT NULL,
	"password" varchar(256) NOT NULL,
	"rank" "rank" DEFAULT 'Dormant',
	"level" integer DEFAULT 0,
	"exp" integer DEFAULT 0,
	"avatar" varchar(1000) DEFAULT 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe0VDY4CWWO8S2h_WPo2EfRNUu8xPs9HD_-g&s' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "users_skills" (
	"users" integer NOT NULL,
	"skills" integer NOT NULL,
	"completed" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "users_tracks" (
	"users" integer NOT NULL,
	"tracks" integer NOT NULL,
	"completed" boolean DEFAULT false
);
--> statement-breakpoint
ALTER TABLE "skills" ADD CONSTRAINT "skills_skills_skills_id_fk" FOREIGN KEY ("skills") REFERENCES "public"."skills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skills" ADD CONSTRAINT "skills_tracks_tracks_id_fk" FOREIGN KEY ("tracks") REFERENCES "public"."tracks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_users_users_id_fk" FOREIGN KEY ("users") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_skills" ADD CONSTRAINT "users_skills_users_users_id_fk" FOREIGN KEY ("users") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_skills" ADD CONSTRAINT "users_skills_skills_skills_id_fk" FOREIGN KEY ("skills") REFERENCES "public"."skills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_tracks" ADD CONSTRAINT "users_tracks_users_users_id_fk" FOREIGN KEY ("users") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_tracks" ADD CONSTRAINT "users_tracks_tracks_tracks_id_fk" FOREIGN KEY ("tracks") REFERENCES "public"."tracks"("id") ON DELETE no action ON UPDATE no action;