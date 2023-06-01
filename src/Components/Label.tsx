interface Props {
  children?: string;
}

const Label = ({ children }: Props) => {
  return <label>{children}</label>;
};
export default Label;
