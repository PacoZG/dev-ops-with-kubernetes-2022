-- CreateTable
CREATE TABLE "Pong" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pong_pkey" PRIMARY KEY ("id")
);
