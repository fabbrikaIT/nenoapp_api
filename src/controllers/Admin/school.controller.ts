import { UserEntity } from './../../models/auth/user.model';
import { check, validationResult } from 'express-validator/check';
import { matchedData, sanitize } from 'express-validator/filter';
import { Request, Response } from 'express';
import * as passgen from 'generate-password';
import {Md5} from 'ts-md5/dist/md5';

import { SchoolManagerEntity } from './../../models/admin/schoolManager.model';
import { SchoolEntity } from './../../models/admin/school.model';
import { CPF, CNPJ } from 'cpf_cnpj';
import { BaseController } from "../base.controller";
import { SchoolDAO } from '../../dataaccess/admin/schoolDAO';
import { AdminErrorsProvider, EAdminErrors } from '../../config/errors/admin.errors';
import { ServiceResult } from '../../models/serviceResult.model';
import { SchoolConfigurationEntity } from '../../models/admin/schoolConfig.model';
import { Utils } from '../../shared/utils';
import { AuthDAO } from '../../dataaccess/auth/authDAO';

export class SchoolController extends BaseController {

    private dataAccess: SchoolDAO = new SchoolDAO();

    public InitSchool = (req: Request, res: Response) => {
        let school: SchoolEntity = SchoolEntity.GetInstance();
        school.Map(req.body);
        school.manager = SchoolManagerEntity.GetInstance();
        school.manager.Map(req.body.manager);
        school.configurations = SchoolConfigurationEntity.GetInstance();

        //Criar usuário administrador
        const authDataAccess: AuthDAO = new AuthDAO();
        const adminUser: UserEntity = UserEntity.GetInstance();
        adminUser.email = school.manager.email;
        adminUser.name = school.manager.name;
        adminUser.schoolId = school.id;

        // Gerando senha
        const password = passgen.generate({length: 10, numbers: true, symbols: true, excludeSimilarCharacters: true});
        const originalPassword = password;
        adminUser.password = Md5.hashStr(password).toString();

        authDataAccess.Insert(adminUser, (err, result) => {
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }                              

            //Cadastrar na lista

            //Enviar e-mail de boas vindas

            return res.json(ServiceResult.HandlerSucess());
        });
    }

    public ListSchool = (req: Request, res: Response) => {
        this.dataAccess.ListSchools(res, this.processDefaultResult);
    }

    public ListSchoolByCity = (req: Request, res: Response) => {
        req.checkParams("city").notEmpty();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(AdminErrorsProvider.GetErrorDetails(EAdminErrors.InvalidRequiredSchoolParams, errors));
        }

        const city = req.params["city"];

        this.dataAccess.ListSchoolsByCity(city, res, this.processDefaultResult);
    }

    public ListCities = (req: Request, res: Response) => {
        this.dataAccess.ListCities(res, this.processDefaultResult);
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
                errorMessage: "CNPJ da escola é obrigatório",
                notEmpty: true
            },
            legalName: {
                notEmpty: true,
                errorMessage: "Razão Social da escola é obrigatório"
            },
            email: {
                isEmail: true,
                errorMessage: "Email da escola é obrigatório",
                
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

        // Valida CNPJ
        if (!CNPJ.isValid(school.cnpj)) {
            return res.json(AdminErrorsProvider.GetError(EAdminErrors.InvalidCNPJ));
        }
        // Valida CPF
        if (!CPF.isValid(school.manager.document)) {
            return res.json(AdminErrorsProvider.GetError(EAdminErrors.InvalidCPF));
        }

        //Verifica se o CNPJ já não existe na base
        this.dataAccess.SearchCNPJ(school.cnpj, (qerror, qresult) => {
            if (qerror) {
                return res.json(ServiceResult.HandlerError(qerror));
            }

            if (qresult && qresult.length > 0) {
                return res.json(AdminErrorsProvider.GetError(EAdminErrors.CNPJAlreadyExists));
            }

            //Criando configurações de ambiente
            school.configurations.dbName =  `${CNPJ.strip(school.cnpj)}_db`;
            school.configurations.portalUrl = `http://${Utils.removeSpecialCaracters(school.name).replace( /\s/g, '' ).toLowerCase()}.nenoapp.com.br`;

            this.dataAccess.CreateSchool(school, (err, result) => { 
                if (err) { 
                    return res.json(ServiceResult.HandlerError(err));
                }                              

                return res.json(ServiceResult.HandlerSucess());
            });
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
        school.manager = SchoolManagerEntity.GetInstance();
        school.manager.Map(req.body.manager);
        school.configurations = SchoolConfigurationEntity.GetInstance();
        school.configurations.Map(req.body.configurations);

        // Valida CNPJ
        if (!CNPJ.isValid(school.cnpj)) {
            return res.json(AdminErrorsProvider.GetError(EAdminErrors.InvalidCNPJ));
        }
        // Valida CPF
        if (!CPF.isValid(school.manager.document)) {
            return res.json(AdminErrorsProvider.GetError(EAdminErrors.InvalidCPF));
        }

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