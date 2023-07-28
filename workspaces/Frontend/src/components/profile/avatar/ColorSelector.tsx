import { PongColors } from "@/lib/enums/PongColors.enum";
import styles from "@/styles/profile/ColorSelector.module.css";

type Props = {
  handleColorSelection: (color: string) => void;
};

export default function ColorSelector({ handleColorSelection }: Props) {
  // [!] voir comment partager cette donnee pour tous, si necessaire [?]
  const colorLine1: string[] = [
    PongColors.paprika,
    PongColors.fuschia,
    PongColors.mauve,
    PongColors.violet,
    PongColors.navyBlue,
    PongColors.blue,
  ];
  const colorLine2: string[] = [
    PongColors.skyBlue,
    PongColors.turquoise,
    PongColors.emerald,
    PongColors.grassGreen,
    PongColors.appleGreen,
    PongColors.limeGreen,
  ];
  const colorLine3: string[] = [
    PongColors.canaryYellow,
    PongColors.yellow,
    PongColors.mustardYellow,
    PongColors.tangerine,
    PongColors.nightblue,
    PongColors.gray,
  ];

  const renderColorButtons = (colors: string[]) => {
    return colors.map((color) => (
      <button
        key={color}
        value={color}
        onClick={() => handleColorSelection(color)}
        className={styles.button}
        style={{
          backgroundColor: color,
        }}
      />
    ));
  };

  return (
    <div className={styles.selector}>
      <div className={styles.row}>{renderColorButtons(colorLine1)}</div>
      <div className={styles.row}>{renderColorButtons(colorLine2)}</div>
      <div className={styles.row}>{renderColorButtons(colorLine3)}</div>
    </div>
  );
}

// checking
// [?] [!] save mon propre type / classe ColorResult
/*

class ColorResult {
  constructor(public red: number, public green: number, public blue: number) {}
}

function createColorFromHex(hexValue: string): ColorResult | null {
  const hexRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
  const result = hexRegex.exec(hexValue);

  if (result) {
    const red = parseInt(result[1], 16);
    const green = parseInt(result[2], 16);
    const blue = parseInt(result[3], 16);
    return new ColorResult(red, green, blue);
  }

  return null; // Retourner null si la chaîne hexadécimale n'est pas valide
}

// Exemple d'utilisation
const hexValue = "#f44336";
const color = createColorFromHex(hexValue);

if (color) {
  console.log(color.red, color.green, color.blue);
} else {
  console.log("La valeur hexadécimale est invalide.");
}


*/
