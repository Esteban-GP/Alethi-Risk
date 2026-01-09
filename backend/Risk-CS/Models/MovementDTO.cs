namespace Risk_CS.Models
{
    public class MovementDTO(Guid OriginPrincedomID, Guid DestPrincedomID, int troops)
    {
        public Guid OriginPrincedomID { get; set; } = OriginPrincedomID;
        public Guid DestPrincedomID { get; set; } = DestPrincedomID;  
        public int Troops { get; set; } = troops;
    }
}
