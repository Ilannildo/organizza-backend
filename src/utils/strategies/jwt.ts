import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { client } from "../../prisma/client";

// Setup work and export for the JWT passport strategy
module.exports = (passport: any) => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY,
  };

  passport.use(
    new JwtStrategy(opts, function (jwt_payload, done) {
      console.log('Token  id', jwt_payload)
      client.user
        .findFirst({
          where: {
            uid: jwt_payload.user_id,
          },
          include: {
            role: true,
          },
        })
        .then((user) => {
          console.log("Usuário", user);
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
