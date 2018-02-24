import { Request, Response } from 'express';

import { ConfigDAO } from './../../dataaccess/admin/configDAO';
import { BaseController } from "../base.controller";
import { AdminErrorsProvider, EAdminErrors } from '../../config/errors/admin.errors';
import { ServiceResult } from '../../models/serviceResult.model';
import { ScreenEntity } from '../../models/config/screen.model';

export class ConfigController extends BaseController {
    private dataAccess: ConfigDAO = new ConfigDAO();
    
    // Metodos de manupulação de Telas do sistema
    public ListScreens = (req: Request, res: Response) => {
        this.dataAccess.Screens.ListAllItems(res, this.processDefaultResult);
    }

    public ListScreensTree = (req: Request, res: Response) => {
        this.dataAccess.Screens.ListAllItems(res, (res, err, screens: Array<ScreenEntity>) => {
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }

            const result: Array<ScreenEntity> = screens.filter(x=> x.parentId === null);
            result.forEach(item => {    
                item.children = screens.filter(x => x.parentId === item.id);
            });

            return res.json(ServiceResult.HandlerSucessResult(result));
        });
    }

    public GetScreens = (req: Request, res: Response) => {
        req.checkParams("id").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(AdminErrorsProvider.GetErrorDetails(EAdminErrors.InvalidPlanId, errors));
        }

        const id = req.params["id"];

        this.dataAccess.Screens.GetItem([id], res, (res, err, result: ScreenEntity) => {
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }

            this.dataAccess.Screens.ListFilteredItems(["PARENT_ID"], [result.id.toString()], res, (res, error, ret) => {
                if (error) { 
                    return res.json(ServiceResult.HandlerError(err));
                }

                result.children = ret;

                return res.json(ServiceResult.HandlerSucessResult(result));
            })
        } );
    }

    public CreateScreen = (req: Request, res: Response) => {
        // Validação dos dados de entrada
        req.checkBody({
            name: {
                notEmpty: true,
                errorMessage: "Nome da tela é obrigatório"
            },
            code: {
                notEmpty: true,
                errorMessage: "Código da tela é obrigatório"
            },
            path: {
                notEmpty: true,
                errorMessage: "Caminho de acesso da tela é obrigatório"
            },
            icon: {
                notEmpty: true,
                errorMessage: "Ícone da tela é obrigatório"
            },
        });

        // Verifica se a entidade tem erros
        const errors = req.validationErrors();
        if (errors) {
            return res.json(AdminErrorsProvider.GetErrorDetails(EAdminErrors.InvalidRequiredPlansParams, errors));
        }

        let screen: ScreenEntity = ScreenEntity.GetInstance();
        screen.Map(req.body);

        this.dataAccess.Screens.CreateItem(screen, res, (res, err, result) => { 
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }

            return res.json(ServiceResult.HandlerSucess());
        });
    }

    public UpdateScreen = (req: Request, res: Response) => {
        // Validação dos dados de entrada
        req.checkBody({
            id: {
                isNumeric: true,
                errorMessage: "Id da tela é obrigatório"
            }, 
            name: {
                notEmpty: true,
                errorMessage: "Nome da tela é obrigatório"
            },
            code: {
                notEmpty: true,
                errorMessage: "Código da tela é obrigatório"
            },
            path: {
                notEmpty: true,
                errorMessage: "Caminho de acesso da tela é obrigatório"
            },
            icon: {
                notEmpty: true,
                errorMessage: "Ícone da tela é obrigatório"
            },
        });

        // Verifica se a entidade tem erros
        const errors = req.validationErrors();
        if (errors) {
            return res.json(AdminErrorsProvider.GetErrorDetails(EAdminErrors.InvalidRequiredPlansParams, errors));
        }

        let screen: ScreenEntity = ScreenEntity.GetInstance();
        screen.Map(req.body);

        this.dataAccess.Screens.UpdateItem(screen, [screen.id.toString()], res, (res, err, result) => { 
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }

            return res.json(ServiceResult.HandlerSucess());
        });
    }

    public DeleteScreen = (req: Request, res: Response) => {
        req.checkParams("id").isNumeric();

        const errors = req.validationErrors();
        if (errors) {
            return res.json(AdminErrorsProvider.GetErrorDetails(EAdminErrors.InvalidPlanId, errors));
        }

        const id = req.params["id"];

        this.dataAccess.Screens.DeleteItem([id], res, (res, err, result) => { 
            if (err) { 
                return res.json(ServiceResult.HandlerError(err));
            }

            return res.json(ServiceResult.HandlerSucess());
        });
    }
}