interface Props {
  children: string;
  color?: string;
  onClick?: () => void;
}

export default function Button({ children, onClick, color = "success" }: Props) {
  return (
    <button onClick={onClick} className={"btn btn-primary btn-" + color}>
      {children}
    </button>
  );
};
