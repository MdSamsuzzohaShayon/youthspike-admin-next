import Head from "next/head";
import { useContext } from "react";
import { UserContext } from "@/config/auth";
import Layout from "@/components/layout";

export default function Home() {
  const user: any = useContext(UserContext);
  return <Layout></Layout>;
}
