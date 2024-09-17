interface Props {
  children: string;
  color?: string;
  onClick?: () => void;
  visible?: boolean;
}

export default function Button({ children, onClick, color = "success", visible = true }: Props) {
  return (
    <button onClick={onClick} className={"btn btn-primary btn-" + color} style={{opacity: visible ? 100 : 0}}>
      {children}
    </button>
  );
};
