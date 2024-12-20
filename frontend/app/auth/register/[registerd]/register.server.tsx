"use server";

import axiosInstance from "@/app/utils/axiosInstance";
import { redirect } from "next/navigation";

let backend_url = "http://localhost:3001";

export default async function register(prevState: any, formData: FormData) {
  try {
    const response = await axiosInstance.post(`${backend_url}/auth/register`, {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
    });

    if (response.status !== 201) {
      console.error("Registration failed:", response.data.message);
      return { message: "Registration failed. Please try again." };
    }

    // Optionally redirect after registration
    redirect("/login"); // Send user to login page after successful registration
  } catch (error: any) {
    console.error("Registration Error:", error.response?.data?.message);
    return { message: error.response?.data?.message || "Unknown error occurred" };
  }
}
