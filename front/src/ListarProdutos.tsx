import { useEffect } from "react";

function ListarProdutos() {

useEffect(() => {
    console.log("ListarProdutos mounted");
    fetchProdutos();
}, []);

async function fetchProdutos() {
    try {
        const response = await fetch('http://localhost:5011/api/produto/listar');
        console.log(response);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
        const data = await response.json();
        console.table(data);
    } catch (error) {
        console.error("Error fetching produtos:", error);
    }
}

  return (
    <div id="listar-produtos">
      <h1>Lista de Produtos</h1>
    </div>
  );
}

export default ListarProdutos;