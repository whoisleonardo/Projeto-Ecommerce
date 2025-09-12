namespace API.Middleware;

public class HttpCatMiddleware
{
    private readonly RequestDelegate _next;

    public HttpCatMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var originalBody = context.Response.Body;
        using var memoryStream = new MemoryStream();
        context.Response.Body = memoryStream;

        await _next(context);

        if (context.Response.StatusCode >= 400)
        {
            var acceptHeader = context.Request.Headers.Accept.ToString();
            var isHtmlRequest = string.IsNullOrEmpty(acceptHeader) || 
                               acceptHeader.Contains("text/html") || 
                               acceptHeader.Contains("*/*");
            
            if (isHtmlRequest)
            {
                context.Response.Body = originalBody;
                await HandleErrorResponse(context);
                return;
            }
        }

        context.Response.Body = originalBody;
        memoryStream.Seek(0, SeekOrigin.Begin);
        await memoryStream.CopyToAsync(originalBody);
    }

    private async Task HandleErrorResponse(HttpContext context)
    {
        var statusCode = context.Response.StatusCode;
        var httpCatUrl = $"https://http.cat/{statusCode}";
        
        context.Response.Clear();
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "text/html; charset=utf-8";
        
        var htmlContent = $@"
<!DOCTYPE html>
<html>
<head>
    <title>Erro {statusCode}</title>
    <meta charset=""utf-8"">
    <style>
        body {{
            font-family: Arial, sans-serif;
            text-align: center;
            background-color: #f0f0f0;
            margin: 0;
            padding: 20px;
        }}
        .error-container {{
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}
        img {{
            max-width: 100%;
            height: auto;
            border-radius: 10px;
            margin: 20px 0;
        }}
        h1 {{
            color: #e74c3c;
            margin-bottom: 10px;
        }}
        p {{
            color: #666;
            font-size: 16px;
        }}
        .back-link {{
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #3498db;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }}
        .back-link:hover {{
            background-color: #2980b9;
        }}
        .cat-container {{
            margin: 20px 0;
        }}
    </style>
</head>
<body>
    <div class='error-container'>
        <h1>Erro {statusCode}</h1>
        <p>{GetStatusCodeMessage(statusCode)}</p>
        <div class='cat-container'>
            <img src='{httpCatUrl}' alt='HTTP Cat {statusCode}' onerror=""this.alt='Imagem do gato não disponível'"" />
        </div>
        <p><strong>HTTP Cat Status:</strong> {statusCode}</p>
        <a href='/' class='back-link'>🏠 Voltar ao Início</a>
        <a href='/api/produto/listar' class='back-link'>📋 Ver Produtos</a>
    </div>
</body>
</html>";

        await context.Response.WriteAsync(htmlContent);
    }

    private string GetStatusCodeMessage(int statusCode)
    {
        return statusCode switch
        {
            400 => "Requisição inválida",
            401 => "Não autorizado",
            403 => "Acesso negado",
            404 => "Página não encontrada",
            405 => "Método não permitido",
            408 => "Tempo limite da requisição",
            409 => "Conflito",
            410 => "Recurso não está mais disponível",
            418 => "Eu sou um bule de chá",
            422 => "Entidade não processável",
            429 => "Muitas requisições",
            500 => "Erro interno do servidor",
            501 => "Não implementado",
            502 => "Gateway inválido",
            503 => "Serviço indisponível",
            504 => "Timeout do gateway",
            _ => $"Erro HTTP {statusCode}"
        };
    }
}
