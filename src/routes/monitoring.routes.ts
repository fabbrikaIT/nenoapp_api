import { BaseRoute } from "./base.routes";
import { LogsController } from '../controllers/Monitoring/logs.controller';

export class MonitoringRoutes extends BaseRoute {
    private controller: LogsController = new LogsController();
  
    constructor() {
    super();

    this.buildRoutes();
  }

  private buildRoutes() {
    this.router.get("/logs", this.controller.ListApplicationLogs);
    this.router.get("/logs/:type", this.controller.ListApplicationByStatusLogs);
  }
}
