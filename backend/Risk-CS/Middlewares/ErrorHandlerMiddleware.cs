namespace Risk_CS.Middlewares
{
    public class ErrorHandlerMiddleware
    {
        private readonly RequestDelegate _next;

        public ErrorHandlerMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception error)
            {
                var response = context.Response;
                response.ContentType = "application/json";

                response.StatusCode = 400;

                var result = System.Text.Json.JsonSerializer.Serialize(new { message = error.Message });
                await response.WriteAsync(result);
            }
        }
    }
}
