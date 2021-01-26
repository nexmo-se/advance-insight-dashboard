import { Box } from "@material-ui/core";

interface ITextInput {
  label: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  value: string;
  type?: string;
}

function TextInput({
  label,
  value,
  onChange,
  type = "text"
}: ITextInput) {

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (onChange) onChange(e.target.value);
  }

  return (
    <Box className="Vlt-form__element">
      <label className="Vlt-label">
        {label}
      </label>
      <Box className="Vlt-input">
        <input
          type={type}
          value={value}
          onChange={handleChange}
        />
      </Box>
    </Box>    
  )
}

export default TextInput;
