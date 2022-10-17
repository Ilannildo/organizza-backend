import { sign } from "jsonwebtoken";

export class GenerateAccessTokenProvider {
  execute(user_id: string) {
    const token = sign(
      {
        user_id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "60s",
      }
    );

    return token;
  }
}
