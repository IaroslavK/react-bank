import "./index.css";
import Header from "../../component/Header";
import { Link } from "react-router-dom";
import Sad from "../../images/sad.png";

const ErrorPage: React.FC = () => {
  return (
    <div className="error-page">
      <Header title="Error page" />

      <h1 className="error-type">404</h1>
      <p className="error-description">Page not found</p>
      <Link className="error-link" to="/">
        Go back
      </Link>
      <img className="error-img" src={Sad} alt="find" />
    </div>
  );
};

export default ErrorPage;
