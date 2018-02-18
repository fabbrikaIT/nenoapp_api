import * as express from "express";

import { BaseRoute } from './base.routes';
import { AdminController } from "../controllers/Admin/admin.controller";
import { PlansController } from "../controllers/Admin/plans.controller";
import { SchoolController } from '../controllers/Admin/school.controller';

export class AdminRoutes extends BaseRoute {
    private controller: AdminController = new AdminController();
    private plansController: PlansController = new PlansController();
    private schoolController: SchoolController = new SchoolController();

    constructor() {
        super();
    
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
      }
}