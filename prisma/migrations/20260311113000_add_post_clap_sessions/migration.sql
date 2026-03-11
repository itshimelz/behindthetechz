-- CreateTable
CREATE TABLE "post_clap_sessions" (
    "id" UUID NOT NULL,
    "session_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "clap_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_clap_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "post_clap_sessions_slug_idx" ON "post_clap_sessions"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "post_clap_sessions_session_id_slug_key" ON "post_clap_sessions"("session_id", "slug");

-- AddForeignKey
ALTER TABLE "post_clap_sessions" ADD CONSTRAINT "post_clap_sessions_slug_fkey" FOREIGN KEY ("slug") REFERENCES "posts"("slug") ON DELETE CASCADE ON UPDATE CASCADE;
