"use server";
import { cookies } from "next/headers";

export default async function getData() {

    const cookieStore = await cookies();

    return cookieStore;
}