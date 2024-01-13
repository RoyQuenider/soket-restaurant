import { CustomError } from "../errors/cutom.errors"

export class TableEntity {

  constructor(
    public id: string,
    public name: string,
    public state: string[],
    public userUpdate?: string,
  ) { }

  static fromObject(object: { [key: string]: any }) {
    const { id, _id, name, userUpdate, state = ['EMPTY'] } = object
    if (!id && _id) {
      throw CustomError.badRequest('Missing id')
    }
    if (!name) throw CustomError.badRequest('Missing name')
    return new TableEntity(_id || id, name, state, userUpdate)
  }


}