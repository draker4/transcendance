import Head from "next/head";
import TestComp from "@/components/TestComp";

export default function Register() {
    return (
        <>
      <Head>
        <title>Transcendence</title>
        <meta
          name="description"
          content="Transcendence is a multiplayer game where you can play with your friends and chat with them."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <main>
            <TestComp />
        </main>
        </>
    );
}