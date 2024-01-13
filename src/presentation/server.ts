import express, { Router } from 'express'
import path from 'path'
import cors from 'cors'

interface Props {
  port: number,
  publicPath?: string
}

export class Server {
  public app = express()
  private readonly port: number
  private readonly publicPath: string

  constructor(props: Props) {
    const { port, publicPath = 'public' } = props
    this.port = port
    this.publicPath = publicPath
    this.config()
  }


  private config() {
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(express.static(this.publicPath))

    this.app.get(/^\/(?!api).*/, (req, res) => {
      const indexPath = path.join(__dirname + `../../../${this.publicPath}/index.html`);
      res.sendFile(indexPath);
    });
  }

  public setRoutes(routes: Router) {
    this.app.use(routes)
  }
  public start() {

    this.app.listen(this.port, () => {
      console.log(`Server running in ${this.port}`)
    })
  }

}