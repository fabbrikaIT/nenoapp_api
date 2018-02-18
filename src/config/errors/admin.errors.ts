import { ServiceResult } from "./../../models/serviceResult.model";
import logProvider from "../../shared/log/log-provider";

export enum EAdminErrors {
  InvalidPlanId = 1,
  InvalidRequiredPlansParams = 2,
  InvalidSchoolId = 3,
  InvalidRequiredSchoolParams = 4,
  InvalidCNPJ = 5,
  InvalidCPF = 6,
  CNPJAlreadyExists = 7
}

export class AdminErrorsProvider {
  public static GetError(error: EAdminErrors) {
    let errorResult: ServiceResult = new ServiceResult();
    errorResult = this.GetErrorEntity(error);

    logProvider.SetErrorLog(errorResult);

    return errorResult;
  }

  public static GetErrorDetails(error: EAdminErrors, details: any) {
    const errorResult = this.GetErrorEntity(error);
    errorResult.ErrorDetails = JSON.stringify(details);
    
    logProvider.SetErrorLog(errorResult);

    return errorResult;
  }

  private static GetErrorEntity(error: EAdminErrors): ServiceResult {
    const errorResult: ServiceResult = new ServiceResult();
    errorResult.Executed = false;

    switch (error) {
        case EAdminErrors.InvalidPlanId:
            errorResult.ErrorCode = "PLAN001";
            errorResult.ErrorMessage = "Id do plano inválido ou nulo";        
            break;   
        case EAdminErrors.InvalidRequiredPlansParams:
            errorResult.ErrorCode = "PLAN002";
            errorResult.ErrorMessage = "Parâmetros obrigatórios de plano nulos ou inválidos";
        case EAdminErrors.InvalidSchoolId:
            errorResult.ErrorCode = "SCHO001";
            errorResult.ErrorMessage = "Id do escola inválido ou nulo";        
            break;   
        case EAdminErrors.InvalidRequiredSchoolParams:
            errorResult.ErrorCode = "SCHO002";
            errorResult.ErrorMessage = "Parâmetros obrigatórios de escola nulos ou inválidos";
            break;
        case EAdminErrors.InvalidCNPJ:
            errorResult.ErrorCode = "SCHO003";
            errorResult.ErrorMessage = "CNPJ Inválido";
            break;
        case EAdminErrors.InvalidCPF:
            errorResult.ErrorCode = "SCHO004";
            errorResult.ErrorMessage = "CPF Inválido";
            break;
        case EAdminErrors.CNPJAlreadyExists:
            errorResult.ErrorCode = "SCHO005";
            errorResult.ErrorMessage = "CNPJ já cadastrado no neno app";
            break;
      default:
        break;
    }

    return errorResult;
  }
}
