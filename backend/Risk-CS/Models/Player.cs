namespace Risk_CS.Models
{
    public class Player
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }
        public int AvailableTroops { get; set; }
        public bool IsAlive { get; set; }

        public Guid GameId { get; set; }
        public Game Game { get; set; }

        public ICollection<Princedom> Princedoms { get; set; }
    }
}
