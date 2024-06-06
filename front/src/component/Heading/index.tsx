import "./index.css";

export default function Heading({ title, text, wellcomePage }: any) {
  return (
    <div className={`${wellcomePage ? "heading--welcomePage" : "heading"}`}>
      <h1 className={`${wellcomePage ? "title--welcomePage" : "title"}`}>
        {title}
      </h1>
      <p className={`${wellcomePage ? "text--welcomePage" : "text"}`}>{text}</p>
    </div>
  );
}
