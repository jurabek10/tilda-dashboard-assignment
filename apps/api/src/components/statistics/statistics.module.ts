import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { StatisticsController } from "./statistics.controller";
import { StatisticsService } from "./statistics.service";

@Module({
  imports: [HttpModule.register({ timeout: 10_000 })],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
