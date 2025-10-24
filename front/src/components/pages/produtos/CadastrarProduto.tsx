import { useState } from "react";

interface ProdutoForm {
  nome: string;
  preco: number;
  quantidade: number;
}

function CadastrarProduto() {
  const [produto, setProduto] = useState<ProdutoForm>({
    nome: "",
    preco: 0,
    quantidade: 0
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações do frontend
    if (!produto.nome.trim()) {
      setError("Nome é obrigatório");
      return;
    }
    
    if (produto.preco <= 0) {
      setError("Preço deve ser maior que zero");
      return;
    }
    
    if (produto.quantidade < 0) {
      setError("Quantidade não pode ser negativa");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('http://localhost:5011/api/produto/cadastrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(produto)
      });

      if (response.status === 409) {
        setError("Produto já cadastrado");
        return;
      }

      if (response.status === 400) {
        const errorText = await response.text();
        setError(errorText);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const produtoCriado = await response.json();
      setSuccess(`Produto "${produtoCriado.nome}" cadastrado com sucesso!`);
      
      // Limpar formulário
      setProduto({
        nome: "",
        preco: 0,
        quantidade: 0
      });

    } catch (error) {
      console.error("Error creating produto:", error);
      setError("Erro ao cadastrar produto. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProdutoForm, value: string | number) => {
    setProduto(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar mensagens ao editar
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header da Página */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Cadastrar Produto
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Adicione um novo produto ao catálogo
          </p>
          <div className="h-px w-24 mx-auto bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
        </div>

        {/* Formulário */}
        <div className="bg-card border border-border p-8 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Campo Nome */}
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-foreground mb-2">
                Nome do Produto *
              </label>
              <input
                type="text"
                id="nome"
                value={produto.nome}
                onChange={(e) => handleInputChange("nome", e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder-muted-foreground transition-colors"
                placeholder="Digite o nome do produto"
                disabled={loading}
              />
            </div>

            {/* Campo Preço */}
            <div>
              <label htmlFor="preco" className="block text-sm font-medium text-foreground mb-2">
                Preço *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-muted-foreground">R$</span>
                <input
                  type="number"
                  id="preco"
                  step="0.01"
                  min="0.01"
                  value={produto.preco || ""}
                  onChange={(e) => handleInputChange("preco", parseFloat(e.target.value) || 0)}
                  className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder-muted-foreground transition-colors"
                  placeholder="0,00"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Campo Quantidade */}
            <div>
              <label htmlFor="quantidade" className="block text-sm font-medium text-foreground mb-2">
                Quantidade
              </label>
              <input
                type="number"
                id="quantidade"
                min="0"
                value={produto.quantidade || ""}
                onChange={(e) => handleInputChange("quantidade", parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder-muted-foreground transition-colors"
                placeholder="0"
                disabled={loading}
              />
            </div>

            {/* Mensagens de Error */}
            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg">
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* Mensagens de Sucesso */}
            {success && (
              <div className="bg-green-500/10 border border-green-500 text-green-500 p-4 rounded-lg">
                <p className="font-medium">{success}</p>
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary text-primary-foreground py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Cadastrando..." : "Cadastrar Produto"}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setProduto({ nome: "", preco: 0, quantidade: 0 });
                  setError(null);
                  setSuccess(null);
                }}
                disabled={loading}
                className="px-6 py-3 border border-border text-foreground rounded-lg font-semibold hover:bg-muted focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Limpar
              </button>
            </div>
          </form>
        </div>

        {/* Informações */}
        <div className="mt-8 text-center text-muted-foreground">
          <p className="text-sm">
            * Campos obrigatórios
          </p>
        </div>
      </div>
  );
}

export default CadastrarProduto;
