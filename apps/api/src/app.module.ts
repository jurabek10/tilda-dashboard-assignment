import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./components/auth/auth.module";
import { UsersModule } from "./components/users/users.module";
import { StatisticsModule } from "./components/statistics/statistics.module";
import { HealthController } from "./components/health/health.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", "../../.env"],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    StatisticsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
