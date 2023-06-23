import styles from "@/styles/loggedIn/profile/ColorSelector.module.css";

type Props = {
  handleColorSelection: (color: string) => void;
};

export default function ColorSelector({ handleColorSelection }: Props) {
  // [!] voir comment partager cette donnee pour tous, si necessaire [?]
  const colorLine1: string[] = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
  ];
  const colorLine2: string[] = [
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
  ];
  const colorLine3: string[] = [
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
    "#795548",
    "#607d8b",
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
