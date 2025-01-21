ALTER TABLE "skills" DROP CONSTRAINT "skills_skills_skills_id_fk";
--> statement-breakpoint
ALTER TABLE "skills" ALTER COLUMN "tracks" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "subSkills" ALTER COLUMN "skills" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "skills" DROP COLUMN "skills";