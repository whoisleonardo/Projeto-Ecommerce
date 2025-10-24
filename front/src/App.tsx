import React, { useState } from 'react';
import ListarProdutos from './components/pages/produtos/ListarProdutos';
import CadastrarProduto from './components/pages/produtos/CadastrarProduto';

type Page = 'listar' | 'cadastrar';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('listar');

  return (
    <div className="bg-background min-h-screen">
      {/* Navegação */}
      <nav className="bg-card border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">E-commerce</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentPage('listar')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 'listar'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                Listar Produtos
              </button>
              <button
                onClick={() => setCurrentPage('cadastrar')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 'cadastrar'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                Cadastrar Produto
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Conteúdo da Página */}
      {currentPage === 'listar' && <ListarProdutos />}
      {currentPage === 'cadastrar' && <CadastrarProduto />}
    </div>
  );
}

export default App;
