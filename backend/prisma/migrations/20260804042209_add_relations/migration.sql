-- AddForeignKey
ALTER TABLE "Players" ADD CONSTRAINT "Players_Match_id_fkey" FOREIGN KEY ("Match_id") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goals" ADD CONSTRAINT "Goals_Match_id_fkey" FOREIGN KEY ("Match_id") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goals" ADD CONSTRAINT "Goals_Player_id_fkey" FOREIGN KEY ("Player_id") REFERENCES "Players"("id") ON DELETE CASCADE ON UPDATE CASCADE;
