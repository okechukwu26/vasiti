
import express from 'express'
  import 'reflect-metadata'
 import {createConnection} from 'typeorm-plus'
 import {logger} from './utils/logger'


  import { errorHandler, global } from './middleware';
 import {
  productRouter,
        
} from './api'





class App {
    public express = express()
    // public basePath = BASE_PATH || '';
    
    constructor(){
         this.boot()
    }
    private boot (){
        this.initializeDB()
        this.registerMiddlewares()
        this.Routers()
         this.handleUncaughtError()
    }

    private registerMiddlewares(){
        global(this.express)
    }
    private Routers(){
         this.express.use('/product', productRouter)
      
        
    }

    private async initializeDB(){
        try {
              
            // })
            await createConnection(
            
            )
         
          
            logger.info('Database connection was succesful')
            
        } catch (error) {
            throw new Error('unable to connect to database ' + error)
            
        }

    }
    private handleUncaughtError(){
        process.on('unhandledRejection', (reason, promise) => {
            throw reason;
          });
      
          process.on('uncaughtException', (error) => {
            logger.error(
              `Uncaught Exception: ${500} - ${error.message}, Stack: ${error.stack}`
            );
            process.exit(1);
          });
      
          process.on('SIGINT', () => {
            logger.info(' Alright! Bye bye!');
            process.exit();
          });
         
      
          this.express.use(errorHandler);
      


    }

    

}

const app = new App().express

export default app
