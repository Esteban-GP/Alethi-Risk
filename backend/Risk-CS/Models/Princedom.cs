namespace Risk_CS.Models
{
    public class Princedom
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string History { get; set; }
        public int Troops { get; set; }

        [System.ComponentModel.DataAnnotations.Schema.NotMapped]
        public List<int> Frontiers { get; set; }


        public Guid PlayerID { get; set; }
        public Player Player { get; set; }

        public Guid GameID { get; set; }
        public Game Game { get; set; }

        
    }
}
