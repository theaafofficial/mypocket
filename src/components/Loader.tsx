import { RotatingSquare } from "react-loader-spinner";

export default function Loader() {
  return (
    <RotatingSquare
      ariaLabel="rotating-square"
      visible={true}
      color="#1f2937"
      strokeWidth="6"
    />
  );
}
