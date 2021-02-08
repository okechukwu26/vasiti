import app from './app';
import { PORT } from './config';
import { logger } from './utils/logger';

const port = PORT || 5000;

app.listen(port, () => { 

  return logger.info(`server is listening on ${port}`);
});

