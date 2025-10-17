using API.Models;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;

Console.Clear();
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDataContext>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

//app.UseHttpCat();

// Configure CORS before defining routes
app.UseCors("AllowAll");

List<Produto> produtos = new List<Produto>
{
    new Produto { Nome = "The Legend of Zelda: Breath of the Wild", Preco = 299.90, Quantidade = 8 },
    new Produto { Nome = "God of War Ragnarok", Preco = 349.90, Quantidade = 6 },
    new Produto { Nome = "Elden Ring", Preco = 279.90, Quantidade = 5 },
    new Produto { Nome = "Minecraft", Preco = 99.90, Quantidade = 15 },
    new Produto { Nome = "Red Dead Redemption 2", Preco = 199.90, Quantidade = 4 }

};

app.MapGet("/", () => "API de Produtos");

app.MapGet("/api/produto/listar", () =>
{
    if (produtos.Any())
    {
        return Results.Ok(produtos.ToList());
    }
    return Results.NotFound("Nenhum produto encontrado");
});

app.MapPost("/api/produto/cadastrar", ([FromBody] Produto produto) =>
{
    // Validate input
    if (produto == null || string.IsNullOrWhiteSpace(produto.Nome))
    {
        return Results.BadRequest("Dados do produto inválidos. Nome é obrigatório.");
    }
    
    if (produto.Preco <= 0)
    {
        return Results.BadRequest("Preço deve ser maior que zero.");
    }
    
    if (produto.Quantidade < 0)
    {
        return Results.BadRequest("Quantidade não pode ser negativa.");
    }

    foreach (var produtoCadastrado in produtos)
    {
        if (produtoCadastrado.Nome.Equals(produto.Nome, StringComparison.OrdinalIgnoreCase))
        {
            return Results.Conflict("Produto já cadastrado");
        }
    }
    produtos.Add(produto);
    return Results.Created("", produto);
});

app.MapGet("/api/produto/buscar/{nome}", (string nome) =>
{
    if (string.IsNullOrWhiteSpace(nome))
    {
        return Results.BadRequest("Nome do produto é obrigatório");
    }
    
    var produto = produtos.FirstOrDefault(x => x.Nome.Equals(nome, StringComparison.OrdinalIgnoreCase));
    if (produto == null)
    {
        return Results.NotFound("Produto não encontrado");
    }
    return Results.Ok(produto);
});

app.MapPost("/api/produto/remover", ([FromBody] Produto produto) =>
{
    var produtoParaRemover = produtos.FirstOrDefault(x => x.Nome == produto.Nome);
    if (produtoParaRemover == null)
    {
        return Results.NotFound("Produto não encontrado");
    }
    produtos.Remove(produtoParaRemover);
    return Results.Ok(produtoParaRemover);
});

app.MapPost("/api/produto/alterar/{nome}", (string nome, [FromBody] Produto produto) =>
{
    var produtoParaAlterar = produtos.FirstOrDefault(x => x.Nome == nome);
    if (produtoParaAlterar == null)
    {
        return Results.NotFound("Produto não encontrado");
    }

    produtoParaAlterar.Nome = produto.Nome;
    produtoParaAlterar.Preco = produto.Preco;
    produtoParaAlterar.Quantidade = produto.Quantidade;

    return Results.Ok(produtoParaAlterar);
});

app.Run();