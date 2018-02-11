import * as express from "express";
import dotenv from "dotenv";
import * as parser from "body-parser";
import * as framework from "swt-framework";
import * as expressValidator from "express-validator";

import { IndexRoutes } from "../routes/index.route";
import trafficControl from "../shared/network/traffic-control";
import { AuthRoutes } from "./../routes/auth.routes";
import { AdminRoutes } from '../routes/admin.routes';

declare function require(moduleName: string): any;

class Server {
  public express;
  private apiVersion: string = "/v0";

  constructor() {
    this.express = express();
    this.ApplySettings();
    this.ConfigurateRoutes();
  }

  private ApplySettings() {
    const dotenv: any = require("dotenv");

    // Linux
    // -----------------------------------------------------------------
    // if (process.env.NODE_ENV == "production") {
    //   dotenv.config({ path: __dirname + "/settings/prod.env" });
    // } else {
    //   dotenv.config({ path: __dirname + "/settings/dev.env" });
    // }

    // Windows
    // -----------------------------------------------------------------
    if (process.env.NODE_ENV == "production") {
        dotenv.config({ path: __dirname + "\\settings\\prod.env" });
    }
    else {
        dotenv.config({ path: __dirname + "\\settings\\dev.env" });
    }

    //Configurando o body parser
    this.express.use(parser.json());
    this.express.use(parser.urlencoded({ extended: true }));

    //Configurando Pre-Flight
    this.express.use(framework.security.enablePreflight);

    /* configurar o middleware express-validator para validação de dados */
    this.express.use(expressValidator());

    //Configurando Inspetores de Chamadas
    this.express.use(trafficControl.CheckPostBody);
    this.express.use(trafficControl.LogRequest);

    // Configurando status de retorno
    this.express.use(trafficControl.SetStatusCode);
  }

  private ConfigurateRoutes() {
    const indexRoutes = new IndexRoutes();
    const authRoutes = new AuthRoutes();
    const adminRoutes = new AdminRoutes();

    // Rota raiz - Controle de Versão
    this.express.use("/", indexRoutes.router);
    // Rota com as interfaces de Autenticação
    this.express.use(this.apiVersion + "/auth", authRoutes.router);    
    // Rota com as interfaces administrativas da aplicação
    this.express.use(this.apiVersion + "/admin", adminRoutes.router);
  }
}

export default new Server().express;
