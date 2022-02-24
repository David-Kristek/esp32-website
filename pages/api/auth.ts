// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Chip from "../../models/chip";
import jwt from "jsonwebtoken";
import { compare } from "bcryptjs";
import { authenticateUser, clearUser, userFromRequest } from "../../util/tokens";

export const validationFailed = { status: 400, msg: "Validation failed" };
export const authFailed = { status: 401, msg: "Špatné příhlašovací údaje" };
export const databaseFailed = { status: 500, msg: "Saving to database failed" };

type Data = {
  msg: string;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  var resp = { status: 404, msg: "Wrong method" };
  switch (req.method) {
    // case "GET":
    //   break;
    case "POST":
      resp = await login(res, req.body, req);
      break;
    case "DELETE":
      resp = logout(res);
      break;
  }
  return res.status(resp?.status).json({ msg: resp.msg });
}
const login = async (res: NextApiResponse, body: any, req : NextApiRequest) => {
  if (!body.username || !body.password) return validationFailed;
  const { username, password } = body;
  const chip = await Chip.findOne({ username });
  if (!chip) return authFailed;
  const validPass = await compare(password, chip.password);
  if (!validPass) return authFailed;
  authenticateUser(res, chip);
  return { status: 200, msg: chip };
};

const logout = (res: NextApiResponse) => {
  clearUser(res);
  return { status: 200, msg: "User logged out" };
};

// priste cookies, potom register and login in frontend
