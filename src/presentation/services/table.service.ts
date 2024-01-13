import { TableModel } from '../../data'
import { CustomError, UpdateTableDto } from '../../domain';
import { RegisterTableDto } from "../../domain";
import { TableEntity } from '../../domain/entities/table.entity';
import { WssService } from './ws.service';


export class TableService {
  constructor(
    private readonly wssService = WssService.instance
  ) { }

  public getAllTable = async () => {
    const tables = (await TableModel.find()).map(table => TableEntity.fromObject(table))
    return tables
  }

  public registerTable = async (registerTableDto: RegisterTableDto) => {
    const existTable = await TableModel.findOne({ name: registerTableDto.name })
    if (existTable) throw CustomError.badRequest('table already exists')

    try {
      const table = new TableModel(registerTableDto)
      await table.save()

      const tableEntity = TableEntity.fromObject(table)
      return tableEntity
    } catch (error) {
      throw CustomError.internalServer(`${error}`)
    }
  }

  public updateStateTable = async (updateTableDto: UpdateTableDto): Promise<boolean> => {

    try {
      const table = await TableModel.findById(updateTableDto.id)
      if (!table) throw CustomError.internalServer('Email not exists')
      table.userUpdate = updateTableDto.userUpdate

      if (table.state.includes('EMPTY')) {
        table.state = ["BUSY"]
      } else if (table.state.includes('BUSY')) {
        table.state = ["EMPTY"]
      }
      await table.save()
      this.onTableStateChange(TableEntity.fromObject(table))
      return true
    } catch (error) {
      throw CustomError.internalServer(`${error}`)
    }
  }

  private onTableStateChange(table: TableEntity) {
    this.wssService.sendUpdateTable('on-table-state-change', table)
  }

}