import ReactSlider from "react-slider";
import styles from "@/styles/Lobby/selector/Slider.module.css";

type Props = {
  min: number;
  max: number;
  step: number;
  value: number;
  setValue: Function;
};

export default function Slider({ min, max, step, value, setValue }: Props) {
  const handleChange = (value: number) => {
    setValue(value);
  };

  const renderThumb = (props: any, state: any) => (
    <div {...props} className={styles.sliderThumb} key={1}>
      {state.valueNow}
    </div>
  );

  return (
    <ReactSlider
      className={styles.slider}
      trackClassName={styles.sliderTrack}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={handleChange}
      renderThumb={renderThumb}
    />
  );
}
