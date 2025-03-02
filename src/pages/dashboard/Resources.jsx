import { useEffect, useState } from "react";
import TopNavbar from "../../components/TopNavbar.jsx";

export const Resources = () => {
  let [resources, setResources] = useState([]);

  useEffect(() => {
    fetch("")
      .then((response) => {
        return response.json();
      })
      .then((responseConverted) => {
        console.log(responseConverted);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <TopNavbar/>
      <h1>Página de Recursos</h1>
    </div>
  );
};
