using Risk_CS.Models;

namespace Risk_CS.Services
{
    public class GameService
    {
        public Game CreateGame(PlayerDTO creatorDTO)
        {
            Player creator = new Player(creatorDTO.Name, creatorDTO.Color);
            Game newGame = new Game(creator);
            return newGame;
        }
    }
}
