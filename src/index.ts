import app from './app';

import { logger } from './utils/logger';

let port = process.env.PORT || 5000;

app.listen(port, () => { 

  return logger.info(`server is listening on ${port}`);
});

