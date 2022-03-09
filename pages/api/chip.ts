// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Chip from "../../models/chip";
import dbConnect from "../../util/mongodb";
import { setCookie } from "../../util/tokens";
import Login from "../login";
import { authFailed, databaseFailed, validationFailed } from "./auth";
import * as proccess from "child_process";
import measurement from "../../models/measurement";
import chip from "../../models/chip";

type Data = {
  msg: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  var resp = { status: 404, msg: "Wrong method" };
  if (
    req.body.chipValidator !== process.env.REALCHIP ||
    req.query.chipValidator !== process.env.REALCHIP
  )
    return { status: 401, msg: "Device is not our esp32" };
  switch (req.method) {
    case "GET":
      mainCommunication(req.body);
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

const mainCommunication = async (body: any) => {
  if (!body.temperature || !body.senzors || !body.heatState || !body.esp32id)
    return validationFailed;
  const thisChip = await chip.findOne({ chipId: body.esp32id });
  if (!thisChip) return authFailed;
  var start = new Date();
  start.setHours(0, 0, 0, 0);
  const previousState = await measurement.find({
    createdAt: { $gte: start },
    chipId: body.esp32id,
  });
  const someData = JSON.stringify({ body, previousState });
  const pythonScript = proccess.spawn("python", [
    "util/python/main.py",
    someData,
  ]);
  var resolved;
  pythonScript.stdout.on("data", (data) => {
    const parsedData = JSON.parse(data.toString());
    console.log(parsedData);
    resolved = parsedData;
  });
  const data = {
    time: {
      hour: 0,
      minute: 0,
      second: 0,
    },
    temperature: 0,
    senzors: {
      humidity: 0,
      brightness: 0,
    },
    heatingOn: false,
  };
  if (previousState)
    measurement.updateOne(
      { chipId: body.esp32id },
      {
        $push: {
          data,
        },
      }
    );
  const newMeasurement = new measurement({
    chipId: body.esp32id,
    data: [data],
  });
  try {
    await newMeasurement.save();
  } catch (err) {
    console.log(err);
    return databaseFailed;
  }
  return { status: 200, msg: { heating: true } };
};
