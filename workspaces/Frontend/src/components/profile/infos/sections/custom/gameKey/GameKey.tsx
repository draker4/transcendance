import React, { useState } from "react";
import Profile_Service from "@/services/Profile.service";
import { Profile } from "@/types"; // Import your Profile type

import stylesInfo from "@/styles/profile/InfoCard.module.css";
import styles from "@/styles/profile/GameKey.module.css";

type Props = {
  profile: Profile;
};

export default function GameKey({ profile }: Props) {
  const profileService = new Profile_Service();
  const [gameKey, setGameKey] = useState<"Arrow" | "ZQSD">(profile.gameKey);

  // Step 4: Handle database update when the dropdown value changes
  const handleDropdownChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;

    // Update the local state
    setSelectedOption(selectedValue);

    // Update the database
    try {
      const updatedProfile = await profileService.updateProfile({
        ...profile,
        gameKey: selectedValue,
      });

      // Optionally, you can update the profile data in your component's state if needed.
      // For example, if you have a parent component managing the profile state.
      // profileUpdatedCallback(updatedProfile);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className={styles.gameKey}>
      <p className={stylesInfo.tinyTitle}>Crunchy story</p>
      {/* Step 3: Render the dropdown menu */}
      <select
        value={selectedOption || ""}
        onChange={handleDropdownChange}
        className={styles.dropdown}
      >
        <option value="qwerty">QWERTY</option>
        <option value="azerty">AZERTY</option>
        {/* Add more options as needed */}
      </select>
    </div>
  );
}
