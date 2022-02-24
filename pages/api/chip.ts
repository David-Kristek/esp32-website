// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Chip from "../../models/chip";
import dbConnect from "../../util/mongodb";
import { setCookie } from "../../util/tokens";
import Login from "../login";
import { databaseFailed } from "./auth";

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
      break;
    case "POST":
      resp = await connect(req.body, res);
      break;
  }
  return res.status(resp?.status).json({ msg: resp.msg });
}

const connect = async (body: any, res: NextApiResponse) => {
  if (!body.id || !body.chipValidator)
    return { status: 400, msg: "Property 'id' is missing" };
  if (body.chipValidator !== process.env.REALCHIP)
    return { status: 401, msg: "Device is not our esp32" };

  const bodyChipData = { key: body.id };

  await dbConnect();

  const chip = await Chip.findOne({ key: String(body.id) });

  if (!chip) {
    try {
      const newChip = new Chip(bodyChipData);
      await newChip.save();
      return { status: 200, msg: `new chip ${body.id} created` };
    } catch (err) {
      console.error(err);
      return databaseFailed;
    }
  }
  try {
    await Chip.updateOne({ key: chip.key }, { lastConnection: new Date() });
    return { status: 200, msg: `chip ${body.id} connected` };
  } catch (err) {
    console.error(err);
    return databaseFailed;
  }
};
