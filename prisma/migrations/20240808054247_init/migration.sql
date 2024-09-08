-- CreateTable
CREATE TABLE "RequestType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "duration" INTEGER,
    "stagesFlow" JSONB NOT NULL,
    "declarationText" TEXT NOT NULL,

    CONSTRAINT "RequestType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stage" (
    "key" TEXT NOT NULL,
    "header" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "schema" JSONB,
    "options" JSONB,

    CONSTRAINT "Stage_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "selectItem" (
    "listName" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "selectItem_pkey" PRIMARY KEY ("name","listName")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" SERIAL NOT NULL,
    "requestTypeId" INTEGER NOT NULL,
    "userIdentity" TEXT NOT NULL,
    "createdOn" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "lastChangeStatus" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestDetails" (
    "id" SERIAL NOT NULL,
    "requestId" INTEGER NOT NULL,
    "fieldName" TEXT NOT NULL,
    "fieldType" TEXT NOT NULL,
    "data" TEXT,

    CONSTRAINT "RequestDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stage_key_key" ON "Stage"("key");

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_requestTypeId_fkey" FOREIGN KEY ("requestTypeId") REFERENCES "RequestType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestDetails" ADD CONSTRAINT "RequestDetails_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
