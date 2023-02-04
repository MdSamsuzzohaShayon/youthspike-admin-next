export function TH(props: { children?: JSX.Element | string }) {
  return <th className="text-start p-6 bg-purple-300">{props.children}</th>;
}

export function TD(props: { children?: JSX.Element | string }) {
  return <td className="text-start p-6">{props.children}</td>;
}

export function THR(props: { children?: JSX.Element | string }) {
  return <tr className="w-full bg-purple-200">{props.children}</tr>;
}

export function TDR(props: { children?: JSX.Element | string }) {
  return (
    <tr className="w-full even:bg-purple-100 hover:bg-purple-200">
      {props.children}
    </tr>
  );
}
