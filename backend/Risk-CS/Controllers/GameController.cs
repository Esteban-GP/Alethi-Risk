using Microsoft.AspNetCore.Mvc;
using Risk_CS.Models;
using Risk_CS.Services;

namespace Risk_CS.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GameController : ControllerBase
    {
        private readonly GameService _gameService;

        public GameController(GameService gameService)
        {
            _gameService = gameService;
        }

        [HttpPost("create")]
        public Game CreateGame(PlayerDTO playerDTO)
        {
            Game newGame = _gameService.CreateGame(playerDTO);
            return newGame;
        }

        [HttpPost("join/{gameID}")]
        public Game joinGame(PlayerDTO playerDTO, Guid gameID)
        {
            Game game = _gameService.JoinGame(playerDTO, gameID);
            return game;
        }


    }
}
