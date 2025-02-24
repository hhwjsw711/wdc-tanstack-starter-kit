CREATE TABLE "app_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"googleId" text,
	CONSTRAINT "app_accounts_googleId_unique" UNIQUE("googleId")
);
--> statement-breakpoint
CREATE TABLE "app_attachment" (
	"id" serial PRIMARY KEY NOT NULL,
	"segmentId" serial NOT NULL,
	"fileName" text NOT NULL,
	"fileKey" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app_bookmark" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"courseId" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app_course" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"videoKey" text
);
--> statement-breakpoint
CREATE TABLE "app_exercise" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"exercise" text NOT NULL,
	"weight" integer NOT NULL,
	"reps" integer NOT NULL,
	"sets" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app_profile" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"displayName" text,
	"imageId" text,
	"image" text,
	"bio" text DEFAULT '' NOT NULL,
	CONSTRAINT "app_profile_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "app_segment" (
	"id" serial PRIMARY KEY NOT NULL,
	"courseId" serial NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"order" integer NOT NULL,
	"videoKey" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app_session" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app_user" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text,
	"emailVerified" timestamp,
	CONSTRAINT "app_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "app_accounts" ADD CONSTRAINT "app_accounts_userId_app_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."app_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_attachment" ADD CONSTRAINT "app_attachment_segmentId_app_segment_id_fk" FOREIGN KEY ("segmentId") REFERENCES "public"."app_segment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_bookmark" ADD CONSTRAINT "app_bookmark_userId_app_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."app_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_bookmark" ADD CONSTRAINT "app_bookmark_courseId_app_course_id_fk" FOREIGN KEY ("courseId") REFERENCES "public"."app_course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_course" ADD CONSTRAINT "app_course_userId_app_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."app_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_exercise" ADD CONSTRAINT "app_exercise_userId_app_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."app_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_profile" ADD CONSTRAINT "app_profile_userId_app_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."app_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_segment" ADD CONSTRAINT "app_segment_courseId_app_course_id_fk" FOREIGN KEY ("courseId") REFERENCES "public"."app_course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_session" ADD CONSTRAINT "app_session_userId_app_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."app_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_id_google_id_idx" ON "app_accounts" USING btree ("userId","googleId");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "app_session" USING btree ("userId");