namespace Risk_CS.Models
{
    public class Player
    {
        protected Player() { }
        public Player(string name, string color, Guid GameId)
        {
            Name = name;
            Color = color;
            this.GameId = GameId;
        }
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; }
        public string Color { get; set; }
        public int AvailableTroops { get; set; } = 0;
        public bool IsAlive { get; set; } = true;

        public Guid? GameId { get; set; }

        public ICollection<Princedom> Princedoms { get; set; } = new List<Princedom>();

    }
}
