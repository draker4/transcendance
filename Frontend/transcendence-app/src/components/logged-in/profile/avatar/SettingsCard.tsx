import styles from "@/styles/profile/AvatarCard.module.css"

import { CirclePicker, Color, ColorChangeHandler, ColorResult } from 'react-color'

import { ToggleButton, ToggleButtonGroup } from "@mui/material"

import LaptopIcon from "@mui/icons-material/Laptop"




type Props = {
	previewChangeColor: ColorChangeHandler,
}



export default function SettingsCard({previewChangeColor}: Props) {


  return (
	  <div className={styles.settingsCard}>
	<ToggleButtonGroup
  color="primary"
//   value={alignment}
  exclusive
//   onChange={handleChange}
  aria-label="Platform"
>
  <ToggleButton value="laptop"><LaptopIcon></LaptopIcon></ToggleButton>
  <ToggleButton value="laptop"><LaptopIcon></LaptopIcon></ToggleButton>
</ToggleButtonGroup>
       <CirclePicker onChange={previewChangeColor}
		/>
    </div>
  )
}