import app from './app';

import { logger } from './utils/logger';

let port = process.env.PORT || 4000;

app.listen(port, () => { 

  return logger.info(`server is listening on ${port}`);
});

// {
//   "type":"mysql",
//   "host":"aws-test.c6jrsctnu0a8.eu-west-2.rds.amazonaws.com",
//   "port":3306,
//   "username":"admin",
//   "password":"okechukwu26",
//   "database":"Motor",
//   "synchronize":false,
//   "logging":false,
//  "entities":["**/api/**/*Model.js"],
//   "migrations":["src/migration/*.js"],
//   "cli":{
//       "migrationsDir":"src/migration"
//   }
// }


