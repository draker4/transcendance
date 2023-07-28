import stylesInfoCard from "@/styles/profile/InfoCard.module.css";
import TfaComponent from "./TfaComponent";

export default function SectionCustom({ profile }: {
	profile: Profile
}) {
	return (
		<div>
		<p className={stylesInfoCard.tinyTitle}>Account Settings</p>
		
		<p>Change login</p>
		<p>Change password</p>

		<TfaComponent profile={profile}/>

		</div>
	)
}
