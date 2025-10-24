import { useEffect, useState } from "react";

interface Produto {
  id: number;
  nome: string;
  preco: number;
}

function ListarProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("ListarProdutos mounted");
    fetchProdutos();
  }, []);

  async function fetchProdutos() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5011/api/produto/listar');
      console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProdutos(data);
      console.table(data);
    } catch (error) {
      console.error("Error fetching produtos:", error);
      setError("Erro ao carregar produtos. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }

  // Skeleton loader component
  const ProductSkeleton = () => (
    <div className="bg-card border border-border p-6 rounded-lg">
      <div className="flex justify-between items-center">
        <div className="h-6 bg-muted animate-pulse rounded w-3/4"></div>
        <div className="h-6 bg-muted animate-pulse rounded w-1/4"></div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header da Página */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Produtos
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Confira nossa seleção de produtos disponíveis
          </p>
          <div className="h-px w-24 mx-auto bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
        </div>

        {/* Estados de Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Estado de Error */}
        {error && !loading && (
          <div className="bg-destructive/10 border border-destructive text-destructive p-6 rounded-lg text-center">
            <p className="text-lg font-semibold">{error}</p>
            <button 
              onClick={fetchProdutos}
              className="mt-4 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && produtos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              Nenhum produto encontrado
            </p>
          </div>
        )}

        {/* Lista de Produtos */}
        {!loading && !error && produtos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtos.map((produto) => (
              <div
                key={produto.id}
                className="group bg-card border border-border p-6 rounded-lg transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 relative overflow-hidden"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                    {produto.nome}
                  </h3>
                  <span className="text-2xl font-bold text-primary">
                    R$ {produto.preco.toFixed(2)}
                  </span>
                </div>
                
                {/* Gradiente animado na borda inferior */}
                <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary to-primary/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            ))}
          </div>
        )}
      </div>
  );
}

export default ListarProdutos;
