-- CreateTable
CREATE TABLE "TokenMarketData" (
    "id" SERIAL NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "marketCap" DOUBLE PRECISION,
    "lastFetch" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenMarketData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TokenMarketData_tokenAddress_key" ON "TokenMarketData"("tokenAddress");
