import type { NextPage } from "next";
import Head from "next/head";
import tw from "tailwind-styled-components";
const AuthContainer: NextPage = ({ children }) => {
  return (
    <div className="xl:flex h-full bg-verydarkgreen">
      <img
        src="/images/board.jpg"
        className="w-0 xl:w-3/5 xl:h-[100vh] object-cover"
        alt="board"
      />
      <section className="m-auto w-4/5 xl:w-1/3 pb-40">
        <div className="text-darkgreen text-lg sm:text-2xl pt-10 xl:pt-0 mb-[20%] md:pt-0">
          Centrum Vaší chytré domácnosti
        </div>
        {children}
      </section>
    </div>
  );
};
export const Input = tw.input`
    w-full
    px-4
    py-3
    mb-4
    rounded-lg
    border-2
  border-lightgreen
  focus:border-green-800
  bg-verylightgreen
  focus:bg-white
    focus:outline-none
    transition-all
`;
export const SubmitButton = tw.button`
    w-full
    px-2
    py-3
    mb-10
    flex
    justify-center
  bg-lightgreen
  hover:bg-green-800
  text-white
    text-base
    focus:border
    transition-all
    rounded-lg 
    cursor-pointer
    hover:scale-[1.02]
    active:scale-[0.97]
`;

export default AuthContainer;
