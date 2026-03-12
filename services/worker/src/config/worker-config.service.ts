import { readWorkerEnv } from "@experts/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class WorkerConfigService {
  readonly env = readWorkerEnv(process.env);
}
