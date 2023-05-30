interface Props {
  children: string;
  color?: string;
  onClick: () => void;
}

const Button = ({ children, onClick, color = "success" }: Props) => {
  return (
    <button onClick={onClick} className={"btn btn-primary btn-" + color}>
      {children}
    </button>
  );
};
export default Button;
