import cors from 'cors'
import {trimInput} from './trimInputs'
import express, { Express } from "express";
import logger from "morgan";
import passport from 'passport'
import {jwtStrategy} from './passport'
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import bodyParser from 'body-parser'

export default (app: Express) => {
    app.enable("trust proxy");
    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 1000, // limit each IP to 100 requests per windowMs
        }),
    );
    app.use(helmet());
    
    app.use(cors({maxAge:1728000}));
        app.use(express.json())
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
   
 
    app.use(logger("dev"));
    passport.use("jwt", jwtStrategy);
    app.use(trimInput)
    
};
