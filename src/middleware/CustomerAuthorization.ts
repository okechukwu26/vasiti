import { Users } from '../api/User';
import passport from 'passport';
import { AppError } from '../utils/app-error';

/**
 * middleware for checking authorization with jwt
 */
export const authorize = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, async (error, token) => {
    if (error  || !token ) {
      console.log('error and token: ', error);
      return next(new AppError('Unauthorized', null, 401));
    }
      
    if (token) {
      try {
        const user = await Users.findOne({ id: token.id });
      
        if (!user) {
          return next(new AppError('Unauthorized', null, 401));
        }
        req.user = user;
        next();
      } catch (error) {
        return next(error);
      }
    }
   
  })(req, res, next);
};
