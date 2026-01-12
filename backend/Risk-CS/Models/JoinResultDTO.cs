namespace Risk_CS.Models
{
    public class JoinResultDTO(Game game, Player player)
    {
        public Game Game { get; set; } = game;
        public Player Player { get; set; } = player;
    }
}
