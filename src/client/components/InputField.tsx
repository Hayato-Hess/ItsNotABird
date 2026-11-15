export type InputFieldProps = {
  value: string;
  label?: string;
  width?: string;
  onChange: (newValue: string) => void;
  type?: "text" | "number";
  min?: number;
  max?: number;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
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
        onKeyDown={props.onKeyDown}
        autoFocus={props.autoFocus}
      />
    </div>
  );
}
