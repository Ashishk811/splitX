import { Spinner } from "react-bootstrap";

export default function Loader() {
  return (
    <div className="text-center my-5">
      <Spinner animation="border" variant="success" />
    </div>
  );
}
