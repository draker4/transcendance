"use client";

import styles from "@/styles/profile/AvatarCard.module.css";
import AvatarUser from "../../avatarUser/AvatarUser";
import { Badge, CircularProgress } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import Avatar from "@mui/material/Avatar";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import fetchClientSide from "@/lib/fetch/fetchClientSide";
import { CryptoService } from "@/services/Crypto.service";
import disconnect from "@/lib/disconnect/disconnect";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type Props = {
  avatar: Avatar;
  isOwner: boolean;
  onClick: () => void;
  previewBorder: string;
  previewBackground: string;
  displaySettings: boolean;
  uploadButton: boolean;
  setuploadButton?: Dispatch<SetStateAction<boolean>>;
};

const badgeStylePhoto = {
	"& .MuiBadge-badge": {
	  color: 'var(--tertiary1)',
	  backgroundColor: 'var(--primary1)',
	  border: "2px solid var(--accent1)",
    width: "20%",
    height: "20%",
	},
	"& .MuiBadge-badge:hover": {
    width: "23%",
    height: "23%",
    border: "2px solid var(--accent3)",
	},
}

const badgeStyleRight = {
	"& .MuiBadge-badge": {
	  color: 'var(--tertiary1)',
	  backgroundColor: 'var(--primary1)',
	  border: "2px solid var(--accent1)",
	  cursor: "pointer",
    width: "20%",
    height: "20%",
	},
	"& .MuiBadge-badge:hover": {
    width: "23%",
    height: "23%",
    border: "2px solid var(--accent3)",
	},
}

const badgeStyleLeft = {
	"& .MuiBadge-badge": {
		color: 'var(--tertiary1)',
		backgroundColor: 'var(--primary1)',
		border: "2px solid var(--accent1)",
		cursor: "pointer",
    width: "20%",
    height: "20%",
	},
	"& .MuiBadge-badge:hover": {
    width: "23%",
    height: "23%",
    border: "2px solid var(--accent3)",
	},
}

type FormInputs = {
	[key: string]: File | null;
};

const Crypto = new CryptoService();

export default function AvatarProfile({
  avatar,
  isOwner,
  onClick,
  previewBorder,
  previewBackground,
  displaySettings,
  uploadButton,
  setuploadButton,
}: Props) {

  const	avatarRef = useRef<HTMLDivElement | null>(null);
	const	fileInputRef = useRef<HTMLInputElement>(null);
	const	[imageSrc, setImageSrc] = useState<string>(avatar.image);
	const	[loading, setLoading] = useState<boolean>(false);
	const { handleSubmit, setValue } = useForm<FormInputs>();
  const router = useRouter();

  const	handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
		const	reader = new FileReader();

		reader.onload = (onLoadEvent) => {
			if (onLoadEvent.target?.result) {
				setImageSrc(onLoadEvent.target.result as string);
        if (setuploadButton)
          setuploadButton(true);
      }
		}

		if (e.target.files) {
			reader.readAsDataURL(e.target.files[0]);
			setValue("file", e.target.files[0]);
		}
	}

  const	deleteImage = (event: React.MouseEvent<HTMLSpanElement>) => {
		if (avatarRef.current && avatarRef.current.contains(event.target as Node)) {
			return ;
		}
		setValue('file', null);
		setImageSrc(avatar.image);
    if (setuploadButton)
      setuploadButton(false);
	}

  const	handleOnSubmit = async (data: FormInputs) => {

		if (!data.file)
			return ;
		
		setLoading(true);
		setValue('file', null);
		setImageSrc(avatar.image);
    if (setuploadButton)
      setuploadButton(false);

		try {
			if (!process.env.CLOUD_API_KEY || !process.env.CLOUD_SECRET || !process.env.CLOUD_FOLDER || !process.env.CLOUD_NAME)
				throw new Error('env var missing');
	
			const	getSignature = await fetchClientSide(`http://${process.env.HOST_IP}:3000/api/cloud`, {
				method: 'POST',
			});

			if (!getSignature.ok)
				throw new Error('no signature');
			
			const	{timestamp, signature} = await getSignature.json();

			if (!timestamp || !signature)
				throw new Error('no signature');

			const	formData = new FormData();
			formData.set('file', data.file);
			formData.append("api_key", process.env.CLOUD_API_KEY as string);
			formData.append("timestamp", timestamp.toString());
			formData.append('signature', signature);
			formData.append("eager", "c_pad,h_300,w_400|c_crop,h_200,w_260");
			formData.append("folder", process.env.CLOUD_FOLDER as string);

			const	res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/image/upload`, {
				method: "POST",
				body: formData,
			});

			if (!res.ok)
				throw new Error('fetch failed');
			
			const resJson = await res.json();

			const	urlCrypted = await Crypto.encrypt(resJson.secure_url);
			const	publicIdCrypted = await Crypto.encrypt(resJson.public_id);
			const	saveImage = await fetchClientSide(`http://${process.env.HOST_IP}:4000/api/users/addImage`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					imageUrl: urlCrypted,
					public_id: publicIdCrypted,
				}),
			})

			if (!saveImage.ok)
				throw new Error('save image failed');

			const	imageSaved: ImageType = await saveImage.json();
			imageSaved.imageUrl = resJson.secure_url;
			imageSaved.publicId = resJson.public_id;
					
			// setAvatar(prev => [...prev, imageSaved]);
			setLoading(false);

		}
		catch (error: any) {
			console.log(error.message);
			if (error.message === "disconnect") {
				await disconnect();
				router.refresh();
				return ;
			}
			toast.error("Oops, something went wrong, please try again!");
			setLoading(false);
		}
	}

  if (loading)
    return ( 
      <div className={styles.avatar}>
        <div
          className={`${styles[avatar.variant]} 
          ${styles.disabled}`}
          style={{
            backgroundColor: previewBorder,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <CircularProgress />
        </div>
      </div>
  );

  // normal, no change of settings
  if (!displaySettings)
    return (
      <div className={styles.avatar}>
        <div
          className={`${styles[avatar.variant]} 
          ${!isOwner || uploadButton ? styles.disabled : ""}`}
          onClick={onClick}
          style={{ backgroundColor: previewBorder }}
        >
            <AvatarUser
              avatar={avatar}
              borderSize="6px"
              backgroundColor={previewBackground}
              borderColor={previewBorder}
              fontSize="3rem"
            />
        </div>
      </div>
    );

  // changing settings for user or channel avatar
  else
  return (
    <div className={styles.avatar}>
      <div
        className={`${styles[avatar.variant]} 
        ${!isOwner || uploadButton ? styles.disabled : ""}`}
        style={{ backgroundColor: previewBorder }}
      >

        {/* user avatar settings, no cloud call */}
        {
          !uploadButton && avatar.variant === "circular" &&
            <Badge badgeContent={
              <FontAwesomeIcon
                icon={faImage}
                className={styles.iconPhoto}
              />} sx={badgeStylePhoto}
              overlap="circular"
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              className={styles.avatarUser}
              onClick={(event) => {
                if (avatarRef.current && avatarRef.current.contains(event.target as Node)) {
                  return ;
                }
                if (fileInputRef.current)
			            fileInputRef.current.click();
              }}
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
              <div
                ref={avatarRef}
                onClick={onClick}
                className={styles.avatarUser}
              >
                <AvatarUser
                  avatar={avatar}
                  borderSize="6px"
                  backgroundColor={previewBackground}
                  borderColor={previewBorder}
                  fontSize="3rem"
                />
              </div>
            </Badge>
        }

        {/* channel avatar */}
        {
          avatar.variant === "rounded" &&
          <AvatarUser
            avatar={avatar}
            borderSize="6px"
            backgroundColor={previewBackground}
            borderColor={previewBorder}
            fontSize="3rem"
          />
        }

        {/* user avatar, cloud called */}
        {
          uploadButton &&
          <Badge badgeContent={
            <FontAwesomeIcon
              icon={faCheck}
            />} sx={badgeStyleRight}
            overlap="circular"
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            onClick={(event) => {
              if (avatarRef.current && avatarRef.current.contains(event.target as Node)) {
                return ;
              }
              handleSubmit(handleOnSubmit)();
            }}
            className={styles.avatarUser}
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
              className={styles.avatarUser}
              onClick={deleteImage}
            >
            <div
              ref={avatarRef}
              onClick={onClick}
              className={styles.avatarUser}
            >
              <Avatar
                src={imageSrc}
                variant="circular"
                sizes="cover"
                sx={{
                  width: "100%",
                  height: "100%",
                  borderWidth: "6px",
                  borderStyle: "solid",
                  borderColor: previewBorder,
                  backgroundColor: previewBackground,
                  borderRadius: `${avatar.variant === "rounded" ? "15%" : "50%"}`,
                  fontSize: "3rem",
                }}
              >
                {avatar.text}
              </Avatar>
            </div>
          </Badge>
        </Badge>
        }
      </div>
    </div>
  );
}
