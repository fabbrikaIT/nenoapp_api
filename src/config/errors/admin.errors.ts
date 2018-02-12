import { ServiceResult } from "./../../models/serviceResult.model";
import logProvider from "../../shared/log/log-provider";

export enum EAdminErrors {
  InvalidPlanId = 1,
  InvalidRequiredPlansParams = 2,
  InvalidSchoolId = 3,
  InvalidRequiredSchoolParams = 4,
}

export class AdminErrorsProvider {
  public static GetError(error: EAdminErrors) {
    const errorResult: ServiceResult = new ServiceResult();
    errorResult.Executed = false;

    switch (error) {
        case EAdminErrors.InvalidPlanId:
            errorResult.ErrorCode = "PLAN001";
            errorResult.ErrorMessage = "Id do plano inválido ou nulo";        
            break;   
        case EAdminErrors.InvalidRequiredPlansParams:
            errorResult.ErrorCode = "PLAN002",
            errorResult.ErrorMessage = "Parâmetros obrigatórios de plano nulos ou inválidos"
        case EAdminErrors.InvalidSchoolId:
            errorResult.ErrorCode = "SCHO001";
            errorResult.ErrorMessage = "Id do escola inválido ou nulo";        
            break;   
        case EAdminErrors.InvalidRequiredSchoolParams:
            errorResult.ErrorCode = "SCHO002",
            errorResult.ErrorMessage = "Parâmetros obrigatórios de escola nulos ou inválidos"
      default:
        break;
    }

    logProvider.SetErrorLog(errorResult);

    return errorResult;
  }

  public static GetErrorDetails(error: EAdminErrors, details: any) {
    const errorResult = this.GetError(error);
    errorResult.ErrorDetails = JSON.stringify(details);

    return errorResult;
  }
}
