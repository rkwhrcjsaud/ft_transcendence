import { Input, FormGroup, InputGroup } from "reactstrap";

type InputFieldsProps = {
    type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';
    placeholder: string;
    name: string;
    value: string;
    changeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
    children?: React.ReactNode;
    minLength?: number;
    pattern?: string;
};

export const InputFields = (props: InputFieldsProps) => {
  return (
    <FormGroup>
        <InputGroup>
            <Input
                className="form-control"
                placeholder={props.placeholder}
                type={props.type ? props.type : (props.name.indexOf("password") !== -1 ? "password" : "text")}
                name={props.name}
                value={props.value}
                required
                autoComplete={props.name.indexOf("password") !== -1 ? "current-password" : "off"}
                onChange={props.changeHandler}
                minLength={props.minLength}
            />
            {props.children ? props.children : <></>}
        </InputGroup>
    </FormGroup>
  );
};

export default InputFields;