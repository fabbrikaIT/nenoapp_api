import { Request, Response } from 'express';

import { BaseController } from "../base.controller";

export class SchoolController extends BaseController {

    public ListSchool(req: Request, res: Response) {
        res.json("Listagem de Escolas");
    }

    public GetSchool(req: Request, res: Response) {
        res.json("Busca de Schoolos");
    }

    public CreateSchool(req: Request, res: Response) {
        res.json("Criação de Schoolos");
    }

    public UpdateSchool(req: Request, res: Response) {
        res.json("Atualização de Schoolos");
    }

    public DeleteSchool(req: Request, res: Response) {
        res.json("Deleção de Schoolos");
    }
}