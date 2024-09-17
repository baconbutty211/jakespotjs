interface Props {
  children: string;
}

const Title = (props: Props) => {
  return <h1>{props.children}</h1>;
};
export default Title;
