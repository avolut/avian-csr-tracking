/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useComponent } from "web.utils/component";
import { TextField } from "@fluentui/react";

interface IProps {
  value: string;
  onChange: (e) => void;
  type?: string;
  multiline?: Boolean;
  defaultValue?: string;
  styles?: Object;
  label?: string;
  isRequired?: Boolean;
  className?: string;
  style?: string;
  errors?: any[];
  rows?: number;
}

export default (props: IProps) => {
  // errors={props.errors}
  const _component = useComponent("inp-text","/app/web/src/components/inp-text",{ TextField, props });
  return eval(_component.render)
}