import { createServer } from "https"
import { envs } from "./config/envs"
import { MongoDatabase } from "./data"
import { AppRoutes } from "./presentation/routes"
import { Server } from "./presentation/server"
import { WssService } from "./presentation/services/ws.service"

(async () => {
  main()
})()


async function main() {


  await MongoDatabase.connect({
    mongoUrl: envs.MONGO_URL,
    dbName: envs.MONGO_DB_NAME
  })

  const server = new Server({ port: envs.PORT, publicPath: envs.PUBLIC_PATH })

  const httpServer = createServer(server.app)
  WssService.initWss({ server: httpServer })
  server.setRoutes(AppRoutes.router)
  // server.start()
  httpServer.listen(envs.PORT, () => {
    console.log(`Server runnig port ${envs.PORT}`);
  })

}
