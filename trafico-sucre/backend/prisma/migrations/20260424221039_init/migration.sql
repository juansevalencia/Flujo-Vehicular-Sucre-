-- CreateTable
CREATE TABLE "Node" (
    "id" TEXT NOT NULL,
    "osmid" BIGINT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lon" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Edge" (
    "id" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "length" DOUBLE PRECISION NOT NULL,
    "name" TEXT,
    "maxspeed" TEXT,

    CONSTRAINT "Edge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Intersection" (
    "id" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "arrivalRate" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "serviceRate" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "greenTime" INTEGER NOT NULL DEFAULT 30,
    "redTime" INTEGER NOT NULL DEFAULT 30,

    CONSTRAINT "Intersection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Node_osmid_key" ON "Node"("osmid");

-- CreateIndex
CREATE UNIQUE INDEX "Intersection_nodeId_key" ON "Intersection"("nodeId");

-- AddForeignKey
ALTER TABLE "Edge" ADD CONSTRAINT "Edge_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "Node"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edge" ADD CONSTRAINT "Edge_toId_fkey" FOREIGN KEY ("toId") REFERENCES "Node"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
