namespace Risk_CS.Models
{
    public class PlacementDTO(Guid princedomID, int troops)
    {
        public Guid PrincedomID { get; set; } = princedomID;
        public int Troops { get; set; } = troops;
    }
}
