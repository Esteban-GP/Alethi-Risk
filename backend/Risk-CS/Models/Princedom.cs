using System.Text.Json.Serialization;

namespace Risk_CS.Models
{
    public class Princedom
    {
        protected Princedom() { }

        public Princedom(int blueprintID, string name, Guid gameID) {
            BlueprintID = blueprintID;
            Name = name;
            GameID = gameID;
        }

        public Guid Id { get; set; } = Guid.NewGuid();
        public int BlueprintID { get; set; }
        public string? Name { get; set; }
        public int Troops { get; set; } = 0;

        public Guid? PlayerID { get; set; } = null;

        [JsonIgnore]
        public Player? Player { get; set; } = null;

        public Guid GameID { get; set; }
    }
}
