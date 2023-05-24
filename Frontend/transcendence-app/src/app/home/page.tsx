"use client"

import Client from '@/services/Client.service';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const	client = new Client();

export default async function HomePage() {

	const	code: string | null = useSearchParams().get('code');
	const	[profile, setProfile] = useState(null);
	
	useEffect(() => {
		client.initialize(setProfile);

		const fetchData = async () => {
			if (code && !client.isLogged) {
				await client.logIn42(code);
			}
		};

		fetchData();
	  }, []
	);

	return (
		<main>
			<div>Main</div>
			{!client.isLogged && <div>salut not log</div>}
			{client.isLogged && <div>oui log</div>}
		</main>
	);
}
