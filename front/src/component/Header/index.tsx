import "./index.css";
import SettingsSvg from "../../images/settings.svg";
import BellSvg from "../../images/bell.svg";
import { useNavigate } from "react-router-dom";
import BackButton from "../BackButton";

interface HeaderProps {
  title: string;
  balancePage?: boolean;
}

export default function Header({ title, balancePage }: HeaderProps) {
  const navigate = useNavigate();
  return (
    <>
      {balancePage ? (
        <div className="header">
          <div className="header__button">
            <img
              src={SettingsSvg}
              alt="settings"
              onClick={() => navigate("/settings")}
            />
          </div>
          <p className="header__text">{title}</p>
          <div className="header__button">
            <img
              src={BellSvg}
              alt="notifications"
              onClick={() => navigate("/notifications")}
            />
          </div>
        </div>
      ) : (
        <div className="header">
          <BackButton />
          <h1 className="header__title">{title}</h1>
          <div className="no-button"></div>
        </div>
      )}
    </>
  );
}
