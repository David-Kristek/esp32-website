import type { NextPage } from "next";
import AuthContainer, {
  Input,
  SubmitButton,
} from "../components/AuthContainer";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import ReactLoading from "react-loading";

const Login: NextPage = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const onSubmitHandler = async (event: any) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    if (!event.target.username.value || !event.target.password.value) {
      setLoading(false);
      return;
    }
    const { username, password } = event.target;
    try {
      const resp = await axios.post("/api/auth", {
        username: username.value,
        password: password.value,
      });
      console.log(resp.data);
      // if(resp.data.key)  we are logged hurray
    } catch (err: any) {
      console.error(err.response.data.msg);
      setError(err.response.data.msg ?? "Oops něco se pokazilo");
    }
    setLoading(false);
  };

  return (
    <AuthContainer>
      <h1 className="text-lightgreen font-bold pb-5 text-3xl">Přihlašte se</h1>
      {error && <p className="text-red-500 py-2 font-bold">{error}!</p>}
      <p className="text-darkgreen pb-2">Uživatlské jméno</p>
      <form onSubmit={onSubmitHandler}>
        <Input
          type="text"
          name="username"
          placeholder="Vaše uživatelské jméno"
          required
        />
        <p className="text-darkgreen pb-2">Heslo</p>
        <Input
          type="password"
          name="password"
          placeholder="Vaše heslo "
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
      <div className="w-full h-[1px] bg-darkgreen mb-10" />
      <div className="text-darkgreen">
        Jste tu poprvé?{" "}
        <Link href="/register">
          <a className="text-lightgreen cursor-pointer">Zaregistrujte se</a>
        </Link>
      </div>
    </AuthContainer>
  );
};

export default Login;

// alert s chybami a registrace
