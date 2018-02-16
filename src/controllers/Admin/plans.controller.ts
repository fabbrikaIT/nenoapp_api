import { CrudDAO } from './../../dataaccess/crudDAO';
import { Request, Response } from 'express';

import { BaseController } from "../base.controller";
import { PlansDAO } from '../../dataaccess/admin/plansDAO';
import { EAdminErrors, AdminErrorsProvider } from '../../config/errors/admin.errors';
import { PlansEntity } from '../../models/admin/plans.model';
import { ServiceResult } from '../../models/serviceResult.model';

export class PlansController extends BaseController {

    // private dataAccess: PlansDAO = new PlansDAO();
    private dataAccess: CrudDAO<PlansEntity> = new CrudDAO<PlansEntity>(process.env.DB_NENO_GLOBAL || '', "PLANS", ["ID"], PlansEntity);

    public ListPlans = (req: Request, res: Response) => {

        //this.dataAccess.ListPlans(res, this.processDefaultResult);
        this.dataAccess.ListAllItems(res, this.processDefaultResult);
    }

    public GetPlan = (req: Request, res: Response) => {
        req.checkParams("id").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(AdminErrorsProvider.GetErrorDetails(EAdminErrors.InvalidPlanId, errors));
        }

        const id = req.params["id"];

        // this.dataAccess.GetPlan(id, res, this.processDefaultResult);
        this.dataAccess.GetItem([id], res, this.processDefaultResult);
        
    }

    public CreatePlan = (req: Request, res: Response) => {
        // Validação dos dados de entrada
        req.checkBody({
            name: {
                notEmpty: true,
                errorMessage: "Nome do plano é obrigatório"
            },
            cost: {
                notEmpty: true,
                errorMessage: "Valor do plano é obrigatório"
            },
            contractType: {
                isNumeric: true,
                errorMessage: "Tipo do contrato é obrigatório"
            }
        });

        // Verifica se a entidade tem erros
        const errors = req.validationErrors();
        if (errors) {
            return res.json(AdminErrorsProvider.GetErrorDetails(EAdminErrors.InvalidRequiredPlansParams, errors));
        }

        let plan: PlansEntity = PlansEntity.GetInstance();
        plan.Map(req.body);

        this.dataAccess.CreateItem(plan, res, (res, err, result) => { 
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }

            return res.json(ServiceResult.HandlerSucess());
        });
    }

    public UpdatePlan = (req: Request, res: Response) => {
        // Validação dos dados de entrada
        req.checkBody({
            name: {
                notEmpty: true,
                errorMessage: "Nome do plano é obrigatório"
            },
            cost: {
                notEmpty: true,
                errorMessage: "Valor do plano é obrigatório"
            },
            contractType: {
                isNumeric: true,
                errorMessage: "Tipo do contrato é obrigatório"
            }
        });

        // Verifica se a entidade tem erros
        const errors = req.validationErrors();
        if (errors) {
            return res.json(AdminErrorsProvider.GetErrorDetails(EAdminErrors.InvalidRequiredPlansParams, errors));
        }

        let plan: PlansEntity = PlansEntity.GetInstance();
        plan.Map(req.body);

        this.dataAccess.UpdateItem(plan, [plan.id.toString()], res, (res, err, result) => { 
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }

            return res.json(ServiceResult.HandlerSucess());
        });
    }

    public DeletePlan = (req: Request, res: Response) => {
        req.checkParams("id").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(AdminErrorsProvider.GetErrorDetails(EAdminErrors.InvalidPlanId, errors));
        }

        const id = req.params["id"];

        this.dataAccess.DeleteItem([id], res, (res, err, result) => { 
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }

            return res.json(ServiceResult.HandlerSucess());
        });
    }
}