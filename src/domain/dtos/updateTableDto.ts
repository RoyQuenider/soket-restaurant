export class UpdateTableDto {
  constructor(
    public id: string,
    public userUpdate: string
  ) { }

  static create(object: { [key: string]: any }): [string?, UpdateTableDto?] {
    const { id, userUpdate } = object;
    if (!id) return ['Missing id']
    if (!userUpdate) return ['Missing user update']
    return [undefined, new UpdateTableDto(id, userUpdate)]
  }
}