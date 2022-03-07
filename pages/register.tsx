import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Board from "../public/board.jpg";
import tw from "tailwind-styled-components";
import AuthContainer, {
  Input,
  SubmitButton,
} from "../components/AuthContainer";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import { noAuthentication } from "../util/tokens";
import Router from "next/router";

const Login: NextPage = () => {
  const [chip, setChip] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const chipSubmit = async (event: any) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    if (!event.target.chip.value) {
      setLoading(false);
      return;
    }
    const { chip } = event.target;
    try {
      const resp = await axios.get(`/api/auth_register?chip=${chip.value}`);
      setChip(resp.data.msg);
    } catch (err: any) {
      console.error(err.response.data.msg);
      setError(err.response.data.msg ?? "Oops něco se pokazilo");
    }
    setLoading(false);
  };
  const registerSubmit = async (event: any) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    if (
      !event.target.username.value ||
      !event.target.password.value ||
      !event.target.email.value
    ) {
      setLoading(false);
      return;
    }
    if (event.target.password.value !== event.target.repeatpassword.value) {
      setError("Hesla se neshodují");
      setLoading(false);
      return;
    }

    const { username, password, email } = event.target;
    try {
      const resp = await axios.post("/api/auth_register", {
        username: username.value,
        password: password.value,
        email: email.value,
      });
      console.log(resp.data);
      if (resp.data.msg.key) Router.push("/");
    } catch (err: any) {
      console.error(err.response.data.msg);
      setError(err.response.data.msg ?? "Oops něco se pokazilo");
    }
    setLoading(false);
  };

  return (
    <AuthContainer>
      <h1 className="text-lightgreen font-bold pb-5 text-3xl">
        Zaregistrujte se
      </h1>
      {error && <p className="text-red-500 py-2 font-bold">{error}!</p>}
      {!chip ? (
        <form onSubmit={chipSubmit}>
          <p className="text-darkgreen pb-2">
            Nejdříve zadejte klíč vašeho Esp32 chipu
          </p>
          <Input
            type="text"
            name="chip"
            placeholder="Klíč vašeho Esp32 chipu"
            required
          />
          <SubmitButton type="submit">
            {loading ? (
              <ReactLoading
                type={"spokes"}
                color={"white"}
                width={24}
                height={24}
              />
            ) : (
              "Příhlásit se"
            )}
          </SubmitButton>
        </form>
      ) : (
        <form onSubmit={registerSubmit}>
          <p className="text-blue-500 py-2 font-bold">
            Nyní se můžete zaregistrovat k chipu '{chip}'
          </p>
          <p className="text-darkgreen pb-2">Uživatlské jméno</p>
          <Input
            type="text"
            name="username"
            placeholder="Vaše uživatelské jméno"
            required
          />
          <p className="text-darkgreen pb-2">Email</p>
          <Input type="text" name="email" placeholder="Váš email" required />
          <p className="text-darkgreen pb-2">Heslo</p>
          <Input
            type="password"
            name="password"
            placeholder="Vaše heslo "
            required
          />
          <p className="text-darkgreen pb-2">Zopakujte vaše heslo</p>
          <Input
            type="password"
            name="repeatpassword"
            placeholder="Vaše heslo"
            required
          />
          <SubmitButton type="submit">
            {loading ? (
              <ReactLoading
                type={"spokes"}
                color={"white"}
                width={24}
                height={24}
              />
            ) : (
              "Příhlásit se"
            )}
          </SubmitButton>
        </form>
      )}
      <div className="w-full h-[1px] bg-darkgreen mb-10" />
      <div className="text-darkgreen">
        Již jste tímto prošli?{" "}
        <Link href="/login">
          <a className="text-lightgreen cursor-pointer">Přihlašte se</a>
        </Link>
      </div>
    </AuthContainer>
  );
};

export default Login;
export const getServerSideProps = noAuthentication(() => {
  return {
    props: {},
  };
});

// dalsi dropdown menu, komunikace a socket io, cypress !!