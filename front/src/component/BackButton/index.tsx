import "./index.css";
import Svg from "../../images/back-button.svg";
import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <div className="back-button">
      <img src={Svg} alt="<" onClick={() => navigate(-1)} />
    </div>
  );
}
