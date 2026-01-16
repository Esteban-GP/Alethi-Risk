using Microsoft.AspNetCore.SignalR;
using Risk_CS.Models;
using Risk_CS.Services;

namespace Risk_CS.Hubs
{
    public class RiskHub : Hub
    {
        private readonly GameService _gameService;

        public RiskHub(GameService gameService)
        {
            _gameService = gameService;
        }

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

        public async Task RequestGame(Guid gameId)
        {
            try
            {
                Game game = await _gameService.GetGame(gameId);
                if (game == null)
                {
                    await Clients.Caller.SendAsync("Error", "Could not receive game.");
                    return;
                }
                await Clients.Caller.SendAsync("ReceiveGame", game);
            } catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Error", ex.Message);
            }
        }
    }
}
