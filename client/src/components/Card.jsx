import React from "react";
import { useCard } from "../contexts/CardContext.jsx";

function Card(props) {
  const cardContext = useCard();

  function classes() {
    const txt = props.txtcolor ? " text-" + props.txtcolor : " text-white";
    return "card mx-auto my-5" + txt;
  }
  const cardStyle = {
    backgroundColor: props.bgcolor || "#ffffff", // Use a cor fornecida ou branco como padrão
    color: props.txtcolor || "#000000", // Use a cor de texto fornecida ou preto como padrão
    maxWidth: "600px",
  };

  return (
    <div className={classes()} style={cardStyle}>
      <div
        className="card-header "
        style={{ borderBottom: "0.1px solid white" }}
      >
        {props.header}
      </div>
      <div className="card-body">
        {props.title && <h5 className="card-title">{props.title}</h5>}{" "}
        {props.text && <p className="card-text">{props.text}</p>} {props.body}
        {props.status && <div id="createStatus">{props.status}</div>}
      </div>
    </div>
  );
}

export default Card;
