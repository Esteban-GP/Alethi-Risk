namespace Risk_CS.Models
{
    public class MovementDTO(Guid pr1ID, Guid pr2ID, int troops)
    {
        public Guid OriginPrincedomID { get; set; } = pr1ID;
        public Guid DestPrincedomID { get; set; } = pr2ID;
        public int Troops { get; set; } = troops;
    }
}
