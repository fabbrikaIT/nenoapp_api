import { SchoolManagerEntity } from './../../models/admin/schoolManager.model';
import { SchoolEntity } from './../../models/admin/school.model';
import { Request, Response } from 'express';

import { BaseController } from "../base.controller";
import { SchoolDAO } from '../../dataaccess/admin/schoolDAO';
import { AdminErrorsProvider, EAdminErrors } from '../../config/errors/admin.errors';
import { ServiceResult } from '../../models/serviceResult.model';
import { SchoolConfigurationEntity } from '../../models/admin/schoolConfig.model';

export class SchoolController extends BaseController {

    private dataAccess: SchoolDAO = new SchoolDAO();

    public ListSchool = (req: Request, res: Response) => {
        this.dataAccess.ListSchools(res, this.processDefaultResult);
    }

    public GetSchool = (req: Request, res: Response) => {
        req.checkParams("id").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(AdminErrorsProvider.GetErrorDetails(EAdminErrors.InvalidSchoolId, errors));
        }

        const id = req.params["id"];

        this.dataAccess.GetSchool(id, res, this.processDefaultResult);
    }

    public CreateSchool = (req: Request, res: Response) => {
        // Validação dos dados de entrada
        req.checkBody({
            name: {
                notEmpty: true,
                errorMessage: "Nome da escola é obrigatório"
            },
            cnpj: {
                notEmpty: true,
                errorMessage: "CNPJ da escola é obrigatório"
            },
            legalName: {
                notEmpty: true,
                errorMessage: "Razão Social da escola é obrigatório"
            },
            email: {
                isEmail: true,
                errorMessage: "Email da escola é obrigatório"
            },
            phone: {
                notEmpty: true,
                errorMessage: "Telefone da escola é obrigatório"
            },
            street: {
                notEmpty: true,
                errorMessage: "Endereço da escola é obrigatório"
            },
            postcode: {
                notEmpty: true,
                errorMessage: "CEP da escola é obrigatório"
            },
            subscriptionPlanId: {
                isNumeric: true,
                errorMessage: "Plano do contrato é obrigatório"
            },
            manager: {
                notEmpty: true,
                errorMessage: "Dados do Responsável da escola é obrigatório"
            }
        });

        // Verifica se a entidade tem erros
        const errors = req.validationErrors();
        if (errors) {
            return res.json(AdminErrorsProvider.GetErrorDetails(EAdminErrors.InvalidRequiredSchoolParams, errors));
        }

        let school: SchoolEntity = SchoolEntity.GetInstance();
        school.Map(req.body);
        school.manager = SchoolManagerEntity.GetInstance();
        school.manager.Map(req.body.manager);
        school.configurations = SchoolConfigurationEntity.GetInstance();
        if (req.body.configurations) {
            school.configurations.Map(req.body.configurations);
        }

        this.dataAccess.CreateSchool(school, (err, result) => { 
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }

            return res.json(ServiceResult.HandlerSucess());
        });
    }

    public UpdateSchool = (req: Request, res: Response) => {
        // Validação dos dados de entrada
        req.checkBody({
            name: {
                notEmpty: true,
                errorMessage: "Nome da escola é obrigatório"
            },
            cnpj: {
                notEmpty: true,
                errorMessage: "CNPJ da escola é obrigatório"
            },
            legalName: {
                notEmpty: true,
                errorMessage: "Razão Social da escola é obrigatório"
            },
            email: {
                notEmpty: true,
                errorMessage: "Email da escola é obrigatório"
            },
            phone: {
                notEmpty: true,
                errorMessage: "Telefone da escola é obrigatório"
            },
            street: {
                notEmpty: true,
                errorMessage: "Endereço da escola é obrigatório"
            },
            postcode: {
                notEmpty: true,
                errorMessage: "CEP da escola é obrigatório"
            },
            subscriptionPlanId: {
                isNumeric: true,
                errorMessage: "Plano do contrato é obrigatório"
            }
        });

        // Verifica se a entidade tem erros
        const errors = req.validationErrors();
        if (errors) {
            return res.json(AdminErrorsProvider.GetErrorDetails(EAdminErrors.InvalidRequiredSchoolParams, errors));
        }

        let school: SchoolEntity = SchoolEntity.GetInstance();
        school.Map(req.body);

        this.dataAccess.UpdateSchool(school, (err, result) => { 
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }

            return res.json(ServiceResult.HandlerSucess());
        });
    }

    public DeleteSchool = (req: Request, res: Response) => {
        req.checkParams("id").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(AdminErrorsProvider.GetErrorDetails(EAdminErrors.InvalidPlanId, errors));
        }

        const id = req.params["id"];

        this.dataAccess.DeleteSchool(id, (err, result) => { 
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }

            return res.json(ServiceResult.HandlerSucess());
        });
    }
}