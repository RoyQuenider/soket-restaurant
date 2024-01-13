import { Router } from "express";
import { TableController } from "./controller";
import { TableService } from "../services/table.service";

export class TableRouter {

  static get router(): Router {
    const router = Router()

    const tableService = new TableService()
    const tableController = new TableController(tableService)
    router.get('/', tableController.getAllTable)
    router.post('/', tableController.registerTable)
    router.put('/updateState', tableController.updateStateTable)
    return router
  }

}