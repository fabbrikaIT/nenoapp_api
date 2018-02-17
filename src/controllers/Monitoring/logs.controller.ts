import { Request, Response } from 'express';

import { BaseController } from '../base.controller';
import { LogsDAO } from '../../dataaccess/monitoring/logsDAO';

export class LogsController extends BaseController { 
    private dataAccess: LogsDAO = new LogsDAO();

    public ListApplicationLogs = (req: Request, res: Response) => {
        return this.dataAccess.ListApplicationLogs(res, this.processDefaultResult);
    }

    public ListApplicationByStatusLogs = (req: Request, res: Response) => {
        const type = req.params["type"];

        return this.dataAccess.ListApplicationByTypeLogs(type, res, this.processDefaultResult);
    }
}