import { Router } from "express";
import { TableRouter } from "./table/routes";


export class AppRoutes {

  static get router(): Router {
    const routes = Router()

    routes.use('/api/restaurant', TableRouter.router)

    return routes
  }

}