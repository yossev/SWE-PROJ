'use client';

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/utils/axiosInstance";
import axios from "axios";
import login from "./login.server";
import { log } from "console";

const backend_url = "http://localhost:3001";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [state, formAction] = useActionState(login, { message: "" });
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Entered function");
      const response = await axios.post(`${backend_url}/auth/login`, {
        email,
        password
      });
      console.log("Finished fetch data");
      console.log(response);
      const { status, data } = response;

      if (status === 201) {
        localStorage.setItem("userId", data.user.userid);
        localStorage.setItem("role", data.user.role);

        setTimeout(() => {
          router.push("/welcome");
        }, 1000);
      } else {
        console.log("Unexpected response:", response);
      }
    } catch (err: any) {
      console.error("Login error:", err.response?.data?.message || err.message);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h1>Login</h1>
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      {state?.message && <p>{state.message}</p>}
    </form>
  );
}
