import { Request, Response } from "express";
import { TableService } from "../services/table.service";
import { RegisterTableDto, UpdateTableDto } from "../../domain";
import { CustomError } from "../../domain";


export class TableController {

  constructor(
    private readonly tableService: TableService
  ) { }

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message })
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal Server Error' })
  }

  public getAllTable = (req: Request, res: Response) => {

    this.tableService.getAllTable().then(tables => res.status(200).json(tables))
  }

  public registerTable = (req: Request, res: Response) => {
    console.log(req.body);
    const [error, registerTableDto] = RegisterTableDto.create(req.body)
    if (error) return res.status(400).json({ error })

    this.tableService.registerTable(registerTableDto!)
      .then(table => res.status(201).json(table))
      .catch(error => this.handleError(error, res))
  }

  public updateStateTable = (req: Request, res: Response) => {
    const [error, updateTableDto] = UpdateTableDto.create(req.body)
    if (error) return res.status(400).json({ error })

    this.tableService.updateStateTable(updateTableDto!)
      .then(ok => res.status(200).json(ok))
      .catch(error => this.handleError(error, res))
  }

}