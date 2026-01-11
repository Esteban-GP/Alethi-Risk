namespace Risk_CS.Models
{
    public class AttackDTO(Guid attackingPrincedomId, Guid defendingPrincedomId)
    {
        public Guid AttackingPrincedomId { get; set; } = attackingPrincedomId;
        public Guid DefendingPrincedomId { get; set; } = defendingPrincedomId;
    }
}
