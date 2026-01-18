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

        [HttpGet("getWaiting")]
        public async Task<ActionResult<List<Game>>> GetGame()
        {
            List<Game> games = await _gameService.GetWaitingGames();
            if (games == null)
            {
                return BadRequest("Could not recieve game.");
            }

            return Ok(games);
        }

        [HttpGet("get/{gameID}")]
        public async Task<ActionResult<Game>> GetGame(Guid gameID)
        {
            Game newGame = await _gameService.GetGame(gameID);
            if (newGame == null)
            {
                return BadRequest("Could not recieve game.");
            }

            return Ok(newGame);
        }

        [HttpPost("create")]
        public async Task<ActionResult<Game>> CreateGame(PlayerDTO playerDTO)
        {
            Game newGame = await _gameService.CreateGame(playerDTO);
            if (newGame == null)
            {
                return BadRequest("Could not create game.");
            }

            return Ok(new
            {
                gameId = newGame.Id,
                myPlayerId = newGame.Players[0].Id,
                newGame
            });
        }

        [HttpDelete("delete/{gameID}")]
        public async Task<ActionResult<String>> DeleteGame(Guid gameID)
        {
            _gameService.DeleteGame(gameID);
            return Ok("Game deleted");
        }

        [HttpPost("join/{gameID}")]
        public async Task<ActionResult<JoinResultDTO>> JoinGame(PlayerDTO playerDTO, Guid gameID)
        {
            JoinResultDTO result = await _gameService.JoinGame(playerDTO, gameID);
            if (result == null)
            {
                return BadRequest("Could not join game.");
            }
            return Ok(new
            {
                gameId = result.Game.Id,
                myPlayerId = result.Player.Id,
                result
            });
        }


        [HttpPost("leave/{playerID}")]
        public async Task<ActionResult<Game>> LeaveGame(Guid playerID)
        {
            Game result = await _gameService.LeaveGame(playerID);
            if (result == null)
            {
                return BadRequest("Could not leave the game.");
            }
            return Ok(result);
        }

        [HttpPost("leaveLobby/{playerID}")]
        public async Task<ActionResult<Game>> LeaveLobby(Guid playerID)
        {
            Game result = await _gameService.LeaveLobby(playerID);
            if (result == null)
            {
                return BadRequest("Could not leave the lobby.");
            }
            return Ok(result);
        }

        [HttpPost("start/{gameID}")]
        public async Task<ActionResult<Game>> StartGame(Guid gameID)
        {
            Game game = await _gameService.StartGame(gameID);
            if (game == null)
            {
                return BadRequest("Could not begin the game");
            }

            return Ok(game);
        }


        [HttpPost("placeTroops/{ownerGuid}")]
        public async Task<ActionResult<Game>> PlaceTroops(List<PlacementDTO> placementList, Guid ownerGuid)
        {
            Game game = await _gameService.PlaceTroops(ownerGuid, placementList);
            if (game == null)
            {
                return BadRequest("Could not make the placement");
            }

            return Ok(game);
        }
        

        [HttpPost("moveTroops/{ownerGuid}")]
        public async Task<ActionResult<Game>> MoveTroops(MovementDTO movement, Guid ownerGuid)
        {
            Game game = await _gameService.MoveTroops(ownerGuid, movement);
            if (game == null)
            {
                return BadRequest("Could not make the movement");
            }

            return Ok(game);
        }


        [HttpPost("finishMove/{ownerGuid}")]
        public async Task<ActionResult<Game>> FinishMoving(Guid ownerGuid)
        {
            Game game = await _gameService.FinishMoving(ownerGuid);
            if (game == null)
            {
                return BadRequest("Could not finish the movement");
            }

            return Ok(game);
        }

        [HttpPost("attack/{ownerGuid}")]
        public async Task<ActionResult<AttackResultDTO>> AttackPrincedom(Guid ownerGuid, AttackDTO attack)
        {
            AttackResultDTO result = await _gameService.AttackPrincedom(ownerGuid, attack);
            if (result == null) return BadRequest("There was an error with your attack");
            return Ok(result);
        }


        [HttpPost("attack/finish/{playerID}")]
        public async Task<ActionResult<Game>> FinishAttacking(Guid playerID)
        {
            Game game = await _gameService.FinishAttacking(playerID);
            if (game == null)
            {
                return BadRequest("Could not finish attacking");
            }
            return Ok(game);
        }
    }
}
