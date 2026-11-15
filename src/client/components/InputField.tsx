export type InputFieldProps = {
  value: string;
  label?: string;
  width?: string;
  onChange: (newValue: string) => void;
  type?: "text" | "number";
  min?: number;
  max?: number;
};

export function InputField(props: InputFieldProps) {
  return (
    <div>
      {props.label && <label>{props.label}</label>}
      <br />
      <input
        type={props.type ?? "text"}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        style={{ width: props.width }}
        min={props.min}
        max={props.max}
      />
    </div>
  );
}
