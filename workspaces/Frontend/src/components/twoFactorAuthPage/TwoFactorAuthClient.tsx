"use client"

import styles from "@/styles/welcome/auth/Confirm.module.css";
import { useRouter } from "next/navigation";
import React from "react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

type FormInputs = {
	[key: string]: string;
};

export default function TwoFactorAuthClient() {
	
	const	router = useRouter();
	const	[msg, setMsg] = useState("");
	const	{ handleSubmit, setValue } = useForm<FormInputs>();
	const	inputRefs = useRef<HTMLInputElement[]>([]);
	const	[buttonText, setButtonText] = useState<string>("Verify");
  
	const indexes: number[] = [0, 1, 2, 3, 4, 5];
	const inputs = indexes.map((index) => {
	  let mid = false;
	  if (index === 3) mid = true;
	  return (
		<React.Fragment key={index}>
		  {mid && <div>-</div>}
		  <input
			defaultValue=""
			ref={(ref) => (ref ? (inputRefs.current[index] = ref) : null)}
			type="text"
			maxLength={1}
			onFocus={(event) => handleFocus(event)}
			onInput={(event) =>
			  moveToNextInput(index, (event.target as HTMLInputElement).value)
			}
			onKeyDown={(event) => handleKeyDown(index, event)}
			onClick={(event) => selectCharacter(event)}
			required
		  />
		</React.Fragment>
	  );
	});
  
	const moveToNextInput = (i: number, value: string) => {
	  setValue(i.toString(), value);
	  if (value && i < inputs.length) inputRefs.current[i + 1]?.focus();
	};
  
	const handleKeyDown = (
	  i: number,
	  event: React.KeyboardEvent<HTMLInputElement>
	) => {
	  const value = event.currentTarget.value;
  
	  if (!value && event.key == "Backspace" && i > 0)
		inputRefs.current[i - 1]?.focus();
	};
  
	const selectCharacter = (event: React.MouseEvent<HTMLInputElement>) => {
	  event?.currentTarget.select();
	};
  
	const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
	  if (event?.currentTarget.value) event?.currentTarget.select();
	};
  
	const onSubmit = async (data: FormInputs) => {
	  	setMsg("");
		setButtonText("Loading...");

	  	const code = Object.values(data).join("").toUpperCase();

		try {
			const response = await fetch(
				`http://${process.env.HOST_IP}:3000/api/auth/2fa`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					code: code,
				}),
				credentials: 'include',
			});

			if (!response.ok)
				throw new Error("fetch error");

			const data = await response.json();

			if (!data.success) {
				if (data.error === "no token")
					throw new Error('disconnect');
				if (data.error === 'wrong code') {
					setMsg('Wrong Authentification Code');
					setButtonText("Verify");
					return ;
				}
				throw new Error(data.error);
			}

			if (data.success) {
				setButtonText("Loading...");
				router.push("/home");
				return ;
			}

			throw new Error("no succes in data");
		} catch (err: any) {
			setButtonText("Verify");
			if (err.message === 'disconnect') {
				await fetch(
					`http://${process.env.HOST_IP}:3000/api/signoff`
				);
				router.push("/welcome/notif");
			}
			setMsg('Oops... Something went wrong! Please try again!')
		}
	};
  
	return (
	  <div className={styles.confirmEmail}>

		<h1 className={styles.title}>Double Authentification</h1>
		<p className={styles.description}>
			Please enter the code generate on your authentification application!
		</p>

		<form onSubmit={handleSubmit(onSubmit)} className={styles.code}>
			<div className={styles.inputCode}>{inputs}</div>
			<p className={styles.msg}>{msg}</p>
			<button
				type="submit"
				className={styles.submitBtn}
				disabled={buttonText !== "Verify"}
			>
				{buttonText}
		  	</button>
		</form>

	  </div>
	);
}
