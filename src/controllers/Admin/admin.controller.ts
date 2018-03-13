import { Request, Response } from 'express';

import { BaseController } from "../base.controller";
import { CrudDAO } from '../../dataaccess/crudDAO';
import { CidEntity } from '../../models/admin/cid.model';
import { AdminErrorsProvider, EAdminErrors } from '../../config/errors/admin.errors';

export class AdminController extends BaseController {
    private dataAccess: CrudDAO<CidEntity> = new CrudDAO<CidEntity>(process.env.DB_NENO_GLOBAL || '', "CID10", ["IDCID"], CidEntity);

    // Search of CID 10 by keyword
    public SearchDesease = (req: Request, res: Response) => {
        req.checkParams("searchText").notEmpty();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(AdminErrorsProvider.GetErrorDetails(EAdminErrors.InvalidPlanId, errors));
        }

        const searchText = req.params["searchText"];

        this.dataAccess.SearchItems("DESCRIPTION", searchText, res, this.processDefaultResult);
    }
}