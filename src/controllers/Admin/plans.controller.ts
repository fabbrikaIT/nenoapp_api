import { Request, Response } from 'express';

import { BaseController } from "../base.controller";
import { PlansDAO } from '../../dataaccess/admin/plansDAO';
import { EAdminErrors, AdminErrorsProvider } from '../../config/errors/admin.errors';
import { PlansEntity } from '../../models/admin/plans.model';
import { ServiceResult } from '../../models/serviceResult.model';

export class PlansController extends BaseController {

    private dataAccess: PlansDAO = new PlansDAO();

    public ListPlans = (req: Request, res: Response) => {

        this.dataAccess.ListPlans(res, this.processDefaultResult);
    }

    public GetPlan = (req: Request, res: Response) => {
        req.checkParams("id").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(AdminErrorsProvider.GetErrorDetails(EAdminErrors.InvalidPlanId, errors));
        }

        const id = req.params["id"];

        this.dataAccess.GetPlan(id, res, this.processDefaultResult);
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

        this.dataAccess.Create(plan, (err, result) => { 
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

        this.dataAccess.Update(plan, (err, result) => { 
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

        this.dataAccess.DeletePlan(id, (err, result) => { 
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }

            return res.json(ServiceResult.HandlerSucess());
        });
    }
}