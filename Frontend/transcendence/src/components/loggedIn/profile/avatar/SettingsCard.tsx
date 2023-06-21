import styles from "@/styles/loggedIn/profile/AvatarCard.module.css";
import { CirclePicker, ColorChangeHandler } from "react-color";
import { Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { styled } from "@mui/material/styles";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CircleIcon from "@mui/icons-material/Circle";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const ToggleButtonS = styled(ToggleButton)({
  "&.Mui-selected, &.Mui-selected:hover": {
    color: "#22d3ee",
    backgroundColor: "#64748b",
  },
});

type Props = {
  previewChangeTopColor: ColorChangeHandler;
  previewChangeBotColor: ColorChangeHandler;
  handleArea: (
    event: React.MouseEvent<HTMLElement>,
    newArea: "border" | "background" | null
  ) => void;
  selectedArea: "border" | "background";
  toogleDisplaySettings: () => void;
  saveColorChanges: () => void;
};

export default function SettingsCard({
  previewChangeTopColor,
  previewChangeBotColor,
  handleArea,
  selectedArea,
  toogleDisplaySettings,
  saveColorChanges,
}: Props) {
  return (
    <div className={styles.settingsCard}>
      <Stack direction="row" spacing="3rem">
        <ToggleButtonGroup
          color="primary"
          value={selectedArea}
          exclusive
          onChange={handleArea}
          aria-label="Platform"
        >
          <ToggleButtonS value="border" aria-label="border-selected">
            <RadioButtonUncheckedIcon fontSize="small" />
          </ToggleButtonS>
          <ToggleButtonS value="background" aria-label="background-selected">
            <CircleIcon fontSize="small" />
          </ToggleButtonS>
        </ToggleButtonGroup>

        <Stack direction="row" spacing="0.5rem">
          <ToggleButtonS
            value="cancel"
            aria-label="cancel-change-color"
            onClick={toogleDisplaySettings}
          >
            <CancelIcon fontSize="small" sx={{ color: "#ff5555" }} />
          </ToggleButtonS>

          <ToggleButtonS
            value="valid"
            aria-label="valid-change-color"
            onClick={saveColorChanges}
          >
            <CheckCircleIcon fontSize="small" sx={{ color: "#22d3ee" }} />
          </ToggleButtonS>
        </Stack>
      </Stack>

      <CirclePicker
        onChange={
          selectedArea === "border"
            ? previewChangeTopColor
            : previewChangeBotColor
        }
      />
    </div>
  );
}