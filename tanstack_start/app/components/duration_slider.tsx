import * as Slider from "@radix-ui/react-slider";

type Props = {
  value: number;
  onChange: (value: number) => void;
};

export function DurationSlider(props: Props) {
  const min = 60;
  return (
    <Slider.Root
      className="relative flex items-center select-none touch-none w-full h-5"
      defaultValue={[60]}
      value={[props.value]}
      max={720}
      step={30}
      onValueChange={(v) => {
        if (v[0] < min) {
          return;
        }
        props.onChange(v[0]);
      }}
    >
      <Slider.Track className="bg-gray-300 relative grow rounded-full h-[3px]">
        <Slider.Range className="absolute bg-gray-400 rounded-full h-full" />
      </Slider.Track>
      <Slider.Thumb
        className="block w-5 h-5 bg-white shadow-[0_2px_10px] shadow-gray-400 rounded-[10px] hover:bg-violet-100 focus:outline-none focus:shadow-[0_0_0_5px] focus:shadow-gray-300"
        aria-label="Volume"
      />
    </Slider.Root>
  );
}
