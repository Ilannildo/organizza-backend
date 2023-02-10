import crypto from "crypto";
import { Request, Response } from "express";
import { client } from "../../prisma/client";

// function encrypt(text: string): string {
//   let iv = crypto.randomBytes(16);
//   const cipher = crypto.createCipheriv(
//     process.env.SECRET_ALGORITHM,
//     Buffer.from(process.env.SECRET_KEY, "hex"),
//     iv
//   );
//   let encrypted = cipher.update(text, "utf8", "hex");
//   encrypted += cipher.final("hex");
//   return encrypted;
// }

// function decrypt(text: string): string {
//   let iv = crypto.randomBytes(16);
//   const decipher = crypto.createDecipheriv(
//     process.env.SECRET_ALGORITHM,
//     Buffer.from(process.env.SECRET_KEY, "hex"),
//     iv
//   );
//   let decrypted = decipher.update(text, "hex", "utf8");
//   decrypted += decipher.final("utf8");
//   return decrypted;
// }

const ALGORITHM = "aes-128-cbc";
const ENCRYPTION_KEY = process.env.SECRET_KEY; // or generate sample key Buffer.from('FoCKvdLslUuB4y3EZlKate7XGottHski1LmyqJHvUhs=', 'base64');
const IV = crypto.randomBytes(16);

const encrypt = (text: string) => {
  const hash = crypto.createHash("sha1");
  hash.update(ENCRYPTION_KEY);

  let key = Buffer.from(hash.digest("binary").substring(0, 16), "binary");

  let cipher = crypto.createCipheriv(ALGORITHM, key, IV);
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
};

const decrypt = (text: string) => {
  const hash = crypto.createHash("sha1");
  hash.update(ENCRYPTION_KEY);

  let key = Buffer.from(hash.digest("binary").substring(0, 16), "binary");

  let decipher = crypto.createDecipheriv(ALGORITHM, key, IV);
  let decrypted = decipher.update(text, "base64", "utf8");
  return decrypted + decipher.final("utf8");
};

export async function logRequest({
  request,
  response,
  user_id,
  description,
  response_body,
}: {
  request: Request;
  response: Response;
  user_id: string;
  response_body?: any;
  description?: string;
}) {
  try {
    const encryptedRequestBody = encrypt(JSON.stringify(request.body));
    const encryptedResponseBody = encrypt(JSON.stringify(response_body));
    const log = await client.log.create({
      data: {
        request_method: request.method,
        description,
        request_url: `${request.originalUrl}`,
        request_headers: JSON.stringify(request.headers),
        request_body: encryptedRequestBody,
        request_ip: request.ip,
        response_status: response.statusCode,
        response_headers: JSON.stringify(response.getHeaders()),
        response_body: encryptedResponseBody,
        user: {
          connect: {
            uid: user_id,
          },
        },
      },
    });
  } catch (error) {
    console.log("Error ::", error);
  }
}
