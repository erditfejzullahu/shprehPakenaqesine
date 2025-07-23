/*
  Warnings:

  - The values [KLOKOT,NOVO_BRDO,SHARR] on the enum `Municipality` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Municipality_new" AS ENUM ('DECAN', 'DRAGASH', 'FERIZAJ', 'FUSHE_KOSOVE', 'GJAKOVE', 'GJILAN', 'GLLOGOC', 'GRACANICE', 'HANI_I_ELEZIT', 'ISTOG', 'JUNIK', 'KACANIK', 'KAMENICE', 'KLINA', 'KLLOKOT', 'LEPOSAVIQ', 'LIPJAN', 'MALISHEVE', 'MITROVICE_JUG', 'MITROVICE_VERI', 'NOVOBERDE', 'OBILIQ', 'PARTESH', 'PEJE', 'PODUJEVE', 'PRISHTINE', 'PRIZREN', 'RAHOVEC', 'RANILLUG', 'SHTERPCE', 'SKENDERAJ', 'SUHAREKE', 'VITI', 'VUSHTRRI', 'ZUBIN_POTOK', 'ZVECAN');
ALTER TABLE "Complaint" ALTER COLUMN "municipality" DROP DEFAULT;
ALTER TABLE "Complaint" ALTER COLUMN "municipality" TYPE "Municipality_new" USING ("municipality"::text::"Municipality_new");
ALTER TYPE "Municipality" RENAME TO "Municipality_old";
ALTER TYPE "Municipality_new" RENAME TO "Municipality";
DROP TYPE "Municipality_old";
ALTER TABLE "Complaint" ALTER COLUMN "municipality" SET DEFAULT 'PRISHTINE';
COMMIT;
