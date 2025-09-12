using API.Models;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;

Console.Clear();
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Adiciona o middleware do HTTP Cat
app.UseHttpCat();

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
    if (produtos.Count > 0)
    {
        return Results.Ok(produtos);
    }
    return Results.BadRequest();
});

app.MapPost("/api/produto/cadastrar", ([FromBody] Produto produto) =>
{
    foreach (var produtoCadastrado in produtos)
    {
        if (produtoCadastrado.Nome == produto.Nome)
        {
            return Results.Conflict("Produto já cadastrado");
        }
    }
    produtos.Add(produto);
    return Results.Created("", produto);
});

app.MapGet("/api/produto/buscar/{nome}", (string nome) =>
{
    // string nome = "Minecraft";
    var produto = produtos.FirstOrDefault(x => x.Nome == nome);
    if (produto == null)
    {
        return Results.NotFound("Produto não encontrado");
    }
    return Results.Ok(produto);
});

app.Run();

