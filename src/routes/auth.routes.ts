import { BaseRoute } from "./base.routes";
import { AuthController } from '../controllers/Auth/auth.controller';

export class AuthRoutes extends BaseRoute {
    private controller: AuthController = new AuthController();
  
    constructor() {
    super();

    this.buildRoutes();
  }

  private buildRoutes() {
    this.router.post("/", this.controller.Login);
    
    this.router.post("/newuser", this.controller.CreateUser);
  }
}
