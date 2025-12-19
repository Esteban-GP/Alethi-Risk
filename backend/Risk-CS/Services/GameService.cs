using Risk_CS.Models;

namespace Risk_CS.Services
{
    public class GameService
    {

        List<Game> Games { get; set; } = new List<Game>();
        
        public Game CreateGame(PlayerDTO creatorDTO)
        {
            Player creator = new Player(creatorDTO.Name, creatorDTO.Color);
            Game newGame = new Game(creator);
            Games.Add(newGame);
            return newGame;
        }

        public Game JoinGame(PlayerDTO playerDTO, Guid GameID)
        {
            Game actualGame = null;
            Player player = new Player(playerDTO.Name, playerDTO.Color);
            foreach (Game game in Games)
            {
                if (game.Id.Equals(GameID))
                {
                    actualGame = game;
                }
            }
            actualGame.Players.Add(player);
            return actualGame;
        }
    }
}
