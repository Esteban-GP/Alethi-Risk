namespace Risk_CS.Models
{
    public class Game
    {
        public Guid Id { get; set; } = Guid.NewGuid(); // Identificador unico de la partida
        public State GameState { get; set; } = State.WAITING; // Enumerador del estado actual  (WAITING, PLACING, ATTACKING, MOVING, FINISHED)

        public List<Player> Players { get; set; } = new List<Player>(); // Lista de jugadores de la partida
        public List<Princedom> Princedoms { get; set; } = new List<Princedom>(); // Lista de los principados de la partida

        public Guid? CurrentPlayerID { get; set; } = null; // Numero de a que jugador le toca
        public int CurrentRound { get; set; } = 0; // Numero de rondas que ha habido
        public int NextHighstorm { get; set; } = 0;// Rondas restantes para la proxima alta tormenta (Random 1 y 3)

    }
}
