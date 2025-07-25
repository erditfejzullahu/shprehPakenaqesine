-- CreateIndex
CREATE INDEX "Complaint_id_deleted_idx" ON "Complaint"("id", "deleted");

-- CreateIndex
CREATE INDEX "Complaint_status_deleted_idx" ON "Complaint"("status", "deleted");

-- CreateIndex
CREATE INDEX "Complaint_deleted_idx" ON "Complaint"("deleted");
