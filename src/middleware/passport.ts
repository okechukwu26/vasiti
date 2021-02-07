import _ from 'lodash';
import { ExtractJwt, Strategy as JWTstrategy } from 'passport-jwt';
// import { APP_URL } from './../config/index';

export const jwtStrategy = new JWTstrategy(
  {
    secretOrKey: "AIzaSyDnN72_PIUPd6mHgVQv2GuhpLn4wot3ke4", 
    // issuer: APP_URL,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  async (token, done) => {
    // Pass the user details to the next middleware
    return done(null, token.user);
  }
);
//f9bdd615-53c2-41b9-bfba-80e7295836e
