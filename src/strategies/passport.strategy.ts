import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy } from "passport-jwt";
import ENVDATA from "../lib/env-file";
import argon from "argon2"
import AuthValidations from "../routes/auth/auth.validations";
import { Validation } from "../lib/zod";
import prisma from "../lib/prisma";


passport.use(
  new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    try {
       const val=Validation.validate({email,password},AuthValidations.login);
       if(!val.success){
        return done(null, false, { message: "Validation failed" });
       }
      const user = await prisma.user.findUnique({ where: { email }, select:{
        id: true,
        email: true,
        isVerified: true,
        password: true
      } });
      if (!user) {
        return done(null, false, { message: "User not found" });
      }

      const isMatch = await argon.verify(user.password || '', password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, {
        id: user.id,
        email: user.email,
        isVerified: user.isVerified
      });
    } catch (err) {
      return done(err);
    }
  })
);


passport.use(
  new JwtStrategy(
    {
      jwtFromRequest:  (req) => req.cookies["substack-clone-accessToken"] || null,
      secretOrKey: ENVDATA.AUTH_SECRET!,
    },
    async (jwt_payload, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { id: jwt_payload.id } });
        if (user) return done(null, user);
        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user?.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
