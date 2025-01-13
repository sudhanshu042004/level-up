CREATE TABLE "subSkills" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "subSkills_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"subSkillName" varchar(256) NOT NULL,
	"skills" integer
);
--> statement-breakpoint
ALTER TABLE "subSkills" ADD CONSTRAINT "subSkills_skills_skills_id_fk" FOREIGN KEY ("skills") REFERENCES "public"."skills"("id") ON DELETE no action ON UPDATE no action;