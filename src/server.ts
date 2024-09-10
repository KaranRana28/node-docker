import Logger from './core/Logger.js';
import { port } from './config.js';
import app from './app.js';

app.listen(port, () => {
  Logger.info(`Server running on port :: ${port}`);
})
  .on('Something went wrong while connecting server :: ', (e) => Logger.error(e));
