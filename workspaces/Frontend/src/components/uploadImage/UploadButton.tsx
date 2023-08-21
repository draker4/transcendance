import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import styles from "@/styles/uploadImage/UploadButton.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import stylesAvatar from "@/styles/createLogin/ChooseAvatar.module.css";
import { Avatar, Badge } from "@mui/material";
import { useForm } from "react-hook-form";

const badgeStyleRight = {
	"& .MuiBadge-badge": {
	  color: 'var(--tertiary1)',
	  backgroundColor: 'var(--primary1)',
	  border: "2px solid var(--accent1)",
	  cursor: "pointer",
	  width: "6px",
	}
}

const badgeStyleLeft = {
	"& .MuiBadge-badge": {
		color: 'var(--tertiary1)',
		backgroundColor: 'var(--primary1)',
		border: "2px solid var(--accent1)",
		cursor: "pointer",
		width: "6px",
	}
}

type FormInputs = {
	[key: string]: File | null;
};

export default function UploadButton({
	setAvatar,
	borderColor,
	backgroundColor,
}: {
	setAvatar: Dispatch<SetStateAction<string[]>>;
	borderColor: string;
	backgroundColor: string;
}) {

	const	[colorIcon, setColorIcon] = useState<string>('var(--tertiary1)');
  	const	[isFocused, setIsFocused] = useState<boolean>(false);
	const	[imageSrc, setImageSrc] = useState<string | undefined>(undefined);
	const	fileInputRef = useRef<HTMLInputElement>(null);
	const	formRef = useRef<HTMLDivElement>(null);
	const 	{ handleSubmit, setValue } = useForm<FormInputs>();

	const handleFocusOn = () => {
		setIsFocused(true);
		setColorIcon('var(--accent1)');
	};

	const handleFocusOff = () => {
		setIsFocused(false);
		setColorIcon('var(--teritary1)');
	};

	const handleHover = () => {
		setIsFocused(true);
		setColorIcon('var(--accent1)');
	};

	const handleMouseLeave = () => {
		setIsFocused(false);
		setColorIcon('var(--teritary1)');
	};

	const	chooseImage = () => {
		if (fileInputRef.current)
			fileInputRef.current.click();
	}

	const	handleOnSubmit = async (data: FormInputs) => {

		if (!data.file)
			return ;

		try {
			const	formData = new FormData();
			formData.set('file', data.file);
			formData.append('upload_preset', 'crunchy-uploads');

			const	res = await fetch(`https://api.cloudinary.com/v1_1/dyzodcnzr/image/upload`, {
				method: "POST",
				body: formData,
			});

			if (!res.ok)
				throw new Error('fetch failed');
			
			const resJson = await res.json();
			setAvatar(prev => [...prev, resJson.secure_url]);
		}
		catch (error) {
			console.log(error);
			toast.error("Oops, something went wrong, please try again!");
		}
	}

	const	handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
		const	reader = new FileReader();

		reader.onload = (onLoadEvent) => {
			if (onLoadEvent.target?.result)
				setImageSrc(onLoadEvent.target.result as string);
		}

		if (e.target.files) {
			reader.readAsDataURL(e.target.files[0]);
			setValue("file", e.target.files[0]);
		}
	}

	const	deleteImage = () => {
		setValue('file', null);
		setImageSrc(undefined);
	}

	return (
		<div
			className={styles.form}
			onFocus={handleFocusOn}
			onBlur={handleFocusOff}
			onMouseEnter={handleHover}
			onMouseLeave={handleMouseLeave}
			onClick={chooseImage}
			ref={formRef}
		>
			{
				!imageSrc &&
				<div
					className={styles.upload}
					style={{border: isFocused ? "4px solid var(--accent3)" : "4px solid var(--accent1)"}}
				>
					<input
						type="file"
						name=""
						defaultValue=""
						id="fileImage"
						multiple={false}
						accept=".png, .jpg, .jpeg, .webp"
						hidden
						ref={fileInputRef}
						onChange={handleOnChange}
					/>
					<FontAwesomeIcon
						icon={faPlus}
						color={colorIcon}
					/>
				</div>
			}
			{
				imageSrc &&
				<Badge badgeContent={
					<FontAwesomeIcon
						icon={faCheck}
					/>} sx={badgeStyleRight}
					overlap="circular"
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					onClick={handleSubmit(handleOnSubmit)}
				>
					<Badge badgeContent={
						<FontAwesomeIcon
							icon={faXmark}
						/>} sx={badgeStyleLeft}
						overlap="circular"
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'left',
						}}
						onClick={deleteImage}
					>
					
					<Avatar
						className={stylesAvatar.avatar}
						key="uploadedAvatar"
						srcSet={imageSrc}
						alt="uploadedAvatar"
						variant="circular"
						sizes="cover"
						sx={{
							width: 80,
							height: 80,
							border: `4px solid ${borderColor}`,
							backgroundColor: {backgroundColor},
						}}
					/>
					</Badge>
				</Badge>
			}
		</div>
	);
}
