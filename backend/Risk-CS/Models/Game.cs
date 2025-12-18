namespace Risk_CS.Models
{
    public class Game
    {
        public Guid Id { get; set; }    
        public State GameState { get; set; } // Enumerador del estado actual  (WAITING, PLACING, ATTACKING, MOVING, FINISHED)

        public List<Player> Players { get; set; } = new List<Player>(); // Lista de jugadores de la partida
        public List<Princedom> Princedoms { get; set; } = new List<Princedom>(); // Lista de los principados de la partida

        public Guid CurrentPlayerID { get; set; } // Numero de a que jugador le toca
        public int CurrentRound { get; set; } // Numero de rondas que ha habido
        public int NextHighstorm { get; set; } // Rondas restantes para la proxima alta tormenta (Random 1 y 3)

        public Game(Player creator)
        {
            GameState = State.WAITING;
            Players.Add(creator);
            CurrentPlayerID = creator.Id;
            CurrentRound = 0;
            NextHighstorm = 3;
        }
    }
}
