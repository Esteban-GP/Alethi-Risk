namespace Risk_CS.Models
{
    public class AttackResultDTO
    {
        public Game UpdatedGame { get; set; }

        public List<int> AttackerDice { get; set; }
        public List<int> DefenderDice { get; set; }

        public int AttackerLost { get; set; }
        public int DefenderLost { get; set; }

        public Guid AttackingPrincedomId { get; set; }
        public Guid DefendingPrincedomId { get; set; }

        public bool Conquered { get; set; }
    }
}
