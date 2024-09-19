interface Props {
  children: string;
  color?: string;
  onClick?: () => void;
  visible?: boolean;
  disabled?: boolean;
}

export default function Button({ children, onClick, color = "success", visible = true, disabled=false }: Props) {
  return (
    <button onClick={onClick} className={"btn btn-primary btn-" + color} style={{opacity: visible ? 100 : 0}} disabled={disabled}>
      {children}
    </button>
  );
};
