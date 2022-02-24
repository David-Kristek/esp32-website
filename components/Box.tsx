import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

interface BoxInteface {
  value: string;
  imgpath?: string;
  active?: boolean;
}

const Box: NextPage<BoxInteface> = ({
  value,
  imgpath,
  active,
}: BoxInteface) => {
  return (
    <div
      className={`bg-black/20 shadow-xl px-8 py-4 text-xl flex gap-x-1 items-center rounded-2xl text-white transition-all hover:bg-[#2f3d2b] cursor-pointer ${
        active ? "bg-[#2f3d2b]" : ""
      }`}
    >
      {imgpath && (
        <img
          src={`/images/${imgpath}`}
          className="md:h-[55px] md:w-[55px] h-10 w-10"
        />
      )}
      <div>{value}</div>
    </div>
  );
};

export default Box;
