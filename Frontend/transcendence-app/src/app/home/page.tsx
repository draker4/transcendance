"use client"

import Client from '@/services/Client.service';
import { useSearchParams } from 'next/navigation';

const	client = new Client();

export default async function Home() {

	client.isLogged = false;

	const	code: string | null = useSearchParams().get('code');

	if (code && !client.isLogged) {
		const	res = await client.logIn42(code);
	}

	return (
		<main>
			<div>{`You're logged in and you're code is ${code}`}</div>
		</main>
	);
}
