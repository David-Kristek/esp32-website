// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Chip from "../../models/chip";
import { databaseFailed, validationFailed } from "./auth";
import jwt from "jsonwebtoken";
import { genSalt, hash } from "bcryptjs";
import cookie from "cookie";
import { authenticateUser, setCookie } from "../../util/tokens";
type Data = {
  msg: string;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  var resp = { status: 404, msg: "Wrong method" };
  switch (req.method) {
    case "GET":
      resp = await chipExist(res, req.query);
      break;
    case "POST":
      resp = await register(req, res);
      break;
  }
  return res.status(resp?.status).json({ msg: resp.msg });
}
const chipExist = async (res: NextApiResponse, body: any) => {
  if (!body.chip) return validationFailed;
  const chip = await Chip.findOne({ key: body.chip });
  if (!chip) return { status: 300, msg: "Chip has never been connected" };
  if (chip.username)
    return { status: 300, msg: "Username and password already set" };
  setCookie(res, "chip", body.chip);
  return { status: 200, msg: body.chip };
};

const register = async (req: NextApiRequest, res: NextApiResponse) => {
  //chip key se sem nejak musi dostat

  if (!req.body.username || !req.body.email || !req.body.password)
    return validationFailed;
  const cookies = cookie.parse(req.headers.cookie || "");
  const chipKey = JSON.parse(cookies.chip);

  const { username, email, password } = req.body;
  // setCookie(res, "chip", "") clearnuti cookie mozna pozdeji
  const salt = await genSalt(10);
  const hashedPassword = await hash(password, salt);

  const chip = await Chip.findOne({ key: chipKey });
  
  if (chip?.username || chip?.email) return validationFailed;
  try {
    await Chip.updateOne(
      { key: chipKey },
      {
        username,
        email,
        password: hashedPassword,
      }
    );
    authenticateUser(res, chip);

    return { status: 200, msg: "Success" };
  } catch (err) {
    console.error(err);
    return databaseFailed;
  }
};
