import { readApiEnv } from "@experts/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AppConfigService {
  readonly env = readApiEnv(process.env);
}
