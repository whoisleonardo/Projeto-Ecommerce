using API.Middleware;

namespace API.Extensions;

public static class HttpCatExtensions
{
    /// <summary>
    /// Adiciona o middleware do HTTP Cat para mostrar imagens divertidas em erros HTTP
    /// </summary>
    public static IApplicationBuilder UseHttpCat(this IApplicationBuilder app)
    {
        return app.UseMiddleware<HttpCatMiddleware>();
    }
}
