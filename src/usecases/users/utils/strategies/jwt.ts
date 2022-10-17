import { NextFunction, Request, Response } from "express";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { client } from "../../../../prisma/client";
import { ErrorHandler } from "../../../../utils/types/utils/errorHandler";

// Setup work and export for the JWT passport strategy
module.exports = (passport: any) => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY,
  };

  passport.use(
    new JwtStrategy(opts, function (jwt_payload, done) {
      client.user
        .findFirst({
          where: {
            uid: jwt_payload.uid,
          },
          include: {
            role: true,
          },
        })
        .then((user) => {
          if (user) {
            return done(undefined, user);
          } else {
            return done(undefined, false);
          }
        })
        .catch((err: Error) => {
          return done(err, false);
        });
    })
  );
};
