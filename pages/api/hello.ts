// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

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
      break;
  }
  return res.status(resp?.status).json({ msg: resp.msg });
}