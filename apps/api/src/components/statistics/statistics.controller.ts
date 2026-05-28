import { Controller, Get, Query } from "@nestjs/common";
import { StatisticsService } from "./statistics.service";
import { ListStatisticsDto } from "./dto/list-statistics.dto";

@Controller("statistics")
export class StatisticsController {
  constructor(private readonly svc: StatisticsService) {}

  @Get()
  list(@Query() q: ListStatisticsDto) {
    return this.svc.list(q.page, q.perPage);
  }
}
