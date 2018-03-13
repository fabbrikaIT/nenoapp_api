import * as express from "express";

import { BaseRoute } from './base.routes';
import { AdminController } from "../controllers/Admin/admin.controller";
import { PlansController } from "../controllers/Admin/plans.controller";
import { SchoolController } from '../controllers/Admin/school.controller';
import { ConfigController } from "../controllers/Admin/config.controller";

export class AdminRoutes extends BaseRoute {
    private controller: AdminController = new AdminController();
    private plansController: PlansController = new PlansController();
    private schoolController: SchoolController = new SchoolController();
    private configController: ConfigController = new ConfigController();

    constructor() {
        super();

        //Rotas de Configuração do Sistema
        this.router.get("/screens", this.configController.ListScreens);
        this.router.get("/screenstree", this.configController.ListScreensTree);
        this.router.get("/screens/:id", this.configController.GetScreens);
        this.router.post("/screens", this.configController.CreateScreen);
        this.router.put("/screens", this.configController.UpdateScreen);
        this.router.delete("/screens/:id", this.configController.DeleteScreen);

        //Rotas de Perfis de Acesso do Sistema
        this.router.get("/profiles", this.configController.ListProfiles);
        this.router.get("/profiles/admin", this.configController.GetAdminProfile);
        this.router.get("/profiles/:id", this.configController.GetProfile);
        this.router.post("/profiles", this.configController.CreateProfile);
        this.router.put("/profiles", this.configController.UpdateProfile);
        this.router.delete("/profiles/:id", this.configController.DeleteProfile);
    
        // Rotas de Planos
        this.router.get("/plans", this.plansController.ListPlans);
        this.router.get("/plans/:id", this.plansController.GetPlan);
        this.router.post("/plans", this.plansController.CreatePlan);
        this.router.put("/plans", this.plansController.UpdatePlan);
        this.router.delete("/plans/:id", this.plansController.DeletePlan);

        //Rotas de Gestão de Escola
        this.router.get("/schools", this.schoolController.ListSchool);
        this.router.get("/schoolsByCity/:city", this.schoolController.ListSchoolByCity);
        this.router.get("/schools/:id", this.schoolController.GetSchool);
        this.router.get("/schools/list/city", this.schoolController.ListCities);
        this.router.post("/schools", this.schoolController.CreateSchool);
        this.router.put("/schools", this.schoolController.UpdateSchool);
        this.router.delete("/schools/:id", this.schoolController.DeleteSchool);

        //Rota para pesquisa de Doenças - 
        this.router.get("/cid/:searchText", this.controller.SearchDesease);
      }
}