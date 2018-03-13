import { ServiceResult } from "./../../models/serviceResult.model";
import logProvider from "../../shared/log/log-provider";
import { ApplicationLog, ELogType } from "../../shared/log/app-log.model";

export enum EAuthErrors {
  InvalidUserOrPassword = 1,
  UserNotFound = 2,
  InvalidNewUserParameters = 3,
  InvalidProfile = 4
}

export class AuthErrorsProvider {
  public static GetError(error: EAuthErrors) {
    const errorResult = this.GetErrorEntity(error);

    logProvider.SetErrorLog(errorResult);

    return errorResult;
  }

  public static GetErrorDetails(error: EAuthErrors, details: any) {
    const errorResult = this.GetErrorEntity(error);
    errorResult.ErrorDetails = JSON.stringify(details);
    
    logProvider.SetErrorLog(errorResult);

    return errorResult;
  }

  private static GetErrorEntity(error: EAuthErrors): ServiceResult {
    const errorResult: ServiceResult = new ServiceResult();
    errorResult.Executed = false;
    
    switch (error) {
      case EAuthErrors.InvalidUserOrPassword:
        errorResult.ErrorCode = "AUTH001";
        errorResult.ErrorMessage = "Usuário ou Senha inválidos";
        break;
      case EAuthErrors.UserNotFound:
        errorResult.ErrorCode = "AUTH002";
        errorResult.ErrorMessage = "Falha na autenticação - Usuário não encontrado.";
        break;
      case EAuthErrors.InvalidNewUserParameters:
        errorResult.ErrorCode = "AUTH003";
        errorResult.ErrorMessage = "Parâmetros obrigatório inválidos ou nulos.";
      case EAuthErrors.InvalidProfile:
        errorResult.ErrorCode = "AUTH004";
        errorResult.ErrorMessage = "Perfil do usuário não encontrado."
      default:
        break;
    }

    return errorResult;
  }
}
