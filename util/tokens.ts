import jwt, { JwtPayload } from "jsonwebtoken";
import { serialize, parse } from "cookie";
import { setCookie as setCookies } from "nookies";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { IncomingMessage } from "http";
import Chip from "../models/chip";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
// You should really not use the fallback and perhaps
// throw an error if this value is not set!
const JWT_TOKEN_KEY = process.env.JWT_TOKEN_KEY || "";

export function setCookie(
  res: any,
  name: string,
  value: string
  //   options: Record<string, unknown> = {}
): void {
  const cookieOptions = {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  const stringValue = JSON.stringify(value);
  setCookies({res}, name, stringValue, cookieOptions)
  // res.setHeader("Set-Cookie", serialize(name, stringValue), cookieOptions);
}

// This sets the cookie on a NextApiResponse so we can authenticate
// users on API routes.
export function authenticateUser(res: NextApiResponse, user: any): void {
  if (!user) return;

  const token = jwt.sign({ _id: user._id }, JWT_TOKEN_KEY);
  setCookie(res, "auth", token);
}

// This removes the auth cookie, effectively logging out
// the user.
export function clearUser(res: NextApiResponse): void {
  setCookie(res, "auth", "0");
}

// This gives back the user behind a given request
// either on API routes or getServerSideProps
export async function userFromRequest(
  req: IncomingMessage & { cookies: NextApiRequestCookies }
): Promise<any> {
  const { auth } = parse(req.headers.cookie || "");

  if (!auth) return undefined;
  const token = JSON.parse(auth);
  try {
    // const { chipId } = jwt.verify(token, JWT_TOKEN_KEY) as JwtPayload;
    const { _id } = jwt.verify(token, JWT_TOKEN_KEY) as JwtPayload;

    if (!_id) return undefined;

    const chip = await Chip.findOne({ _id }).lean();

    if (chip) {
      chip.password = "";
      chip._id = ""; 
      chip.lastConnection = String(chip.lastConnection); 
      return chip;
    }
    return undefined;
  } catch (error) {
    return undefined;
  }
}
export function requireAuthentication(gssp: any) {
  return async (context: GetServerSidePropsContext) => {
    const { req, res } = context;
    const auth = await userFromRequest(req);

    if (!auth?.username) {
      return {
        redirect: {
          destination: "/login",
          statusCode: 302,
        },
      };
    }

    return await gssp(context);
  };
}
export function noAuthentication(gssp: any) {
  return async (context: GetServerSidePropsContext) => {
    const { req, res } = context;
    const auth = await userFromRequest(req);

    if (auth?.username) {
      return {
        redirect: {
          destination: "/",
          statusCode: 302,
        },
      };
    }

    return await gssp(context);
  };
}
