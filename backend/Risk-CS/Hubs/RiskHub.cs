using Microsoft.AspNetCore.SignalR;
using Risk_CS.Models;
using Risk_CS.Services;

namespace Risk_CS.Hubs
{
    public class RiskHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var gameId = httpContext.Request.Query["gameId"];

            if (!string.IsNullOrEmpty(gameId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, gameId);
            }

            await base.OnConnectedAsync();
        }

    }
}
