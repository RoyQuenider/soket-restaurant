export class RegisterTableDto {
  constructor(
    public name: string,
    public state: string[],
    public userUpdate: string
  ) { }

  static create(object: { [key: string]: any }): [string?, RegisterTableDto?] {
    const { name, state, userUpdate } = object;
    if (!name) return ['Missin name']
    return [undefined, new RegisterTableDto(name, state, userUpdate)]
  }
}