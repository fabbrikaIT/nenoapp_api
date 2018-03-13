import { ConfigDAO } from './../../dataaccess/admin/configDAO';
import { UserEntity } from './../../models/auth/user.model';
import { Request, Response } from 'express';

import { BaseController } from '../base.controller';
import { AuthDAO } from './../../dataaccess/auth/authDAO';
import { AuthUserEntity } from '../../models/auth/authUser';
import { ServiceResult } from '../../models/serviceResult.model';
import { AuthEntity } from '../../models/auth/authEntity';
import { AuthErrorsProvider, EAuthErrors } from '../../config/errors/authErrors';
import { ProfileEntity } from '../../models/config/profile.model';

export class AuthController extends BaseController {
    private dataAccess: AuthDAO = new AuthDAO();

    public CreateUser = (req: Request, res: Response) => {
        // Validação dos dados de entrada
        req.checkBody({
            name: {
                notEmpty: true,
                errorMessage: "Nome é obrigatório"
            },
            email: {
                notEmpty: true,
                errorMessage: "Email é obrigatório"
            },
            password: {
                notEmpty: true,
                errorMessage: "Senha é obrigatório"
            },
            schoolId: {
                isNumeric: true,
                errorMessage: "Escola do é obrigatório"
            },
        });

        // Verifica se a entidade tem erros
        const errors = req.validationErrors();
        if (errors) {
             return res.json(AuthErrorsProvider.GetErrorDetails(EAuthErrors.InvalidNewUserParameters, errors));
        }

        let user: UserEntity = UserEntity.GetInstance();
        user.Map(req.body);

        const configDataAccess: ConfigDAO = new ConfigDAO();
        configDataAccess.Profile.GetItem([req.body.profileId], res, (res, err, profile: ProfileEntity) => {
            if (err) {
                return res.json(ServiceResult.HandlerError(err));
            }

            if (!profile) {
                return res.json(AuthErrorsProvider.GetError(EAuthErrors.InvalidProfile));
            }

            user.profile = profile;
            this.dataAccess.Insert(user, (err, result) => {
                return res.json(ServiceResult.HandlerSucess());
            });
        });

        
    }

    public Login = (req: Request, res: Response) => {

        let authUser: AuthUserEntity = new AuthUserEntity();
        authUser.Map(req.body);

        if (authUser && authUser.user !== "" && authUser.password !== "") {
            
            this.dataAccess.GetUser(authUser.user, authUser.password, (error, ret) => {
                let result: ServiceResult = new ServiceResult();

                // Verifica se ocorreu algum erro
                if (error) {                    
                    result.ErrorCode = "ERR999";
                    result.ErrorMessage = JSON.stringify(error);
                    result.Executed = false;
                } 
                else {
                    if (ret){
                        const auth: AuthEntity = new AuthEntity();
                        auth.loginAccept = true;
                        auth.authenticationToken = this.GenerateAuthToken(ret[0]);
                        auth.userName = ret.name;
                        auth.user = ret;

                        return res.json(ServiceResult.HandlerSucessResult(auth));
                    } else {
                        result = AuthErrorsProvider.GetError(EAuthErrors.UserNotFound)
                    }
                }

                res.json(result);
            });
        } else {
            console.log("valid invalid");
            res.json(AuthErrorsProvider.GetError(EAuthErrors.InvalidUserOrPassword));
        }        
    }

    // Private Methods
    private GenerateAuthToken = (authUser): string => {
        return '';
    }
}