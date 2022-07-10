import { config } from "dotenv-flow";
import { expand } from "dotenv-expand";
import { createServer } from "./middleware/server";
import "reflect-metadata";

import "./controllers";
import { Logger } from "./shared/logging/logger";

const environmentVariables = config({
    path: 'config',
})
expand(environmentVariables)

Logger.initialize();

Logger.warn('JWT', process.env.JWT_SECRET)

createServer().then((server) => {
    const port = process.env.PORT || 5000

    server.listen(port, () => console.log(`Api running on PORT ${port}`))
})



