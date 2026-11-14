export type InputFieldProps = {
  value: string;
  label?: string;
  onChange: (newValue: string) => void;
};

export function InputField(props: InputFieldProps) {
  return (
    <div>
      {props.label && <label>{props.label}</label>}
      <input
        type="text"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
}
