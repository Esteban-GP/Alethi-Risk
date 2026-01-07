using Risk.Data;
using Risk_CS.Models;

namespace Risk_CS.Services
{
    public class PlayerService
    {
        public Player AddPlayer(PlayerDTO playerDTO, Guid gameId)
        {
            Player player = new(playerDTO.Name, playerDTO.Color, gameId);
            return player;
        }

        public void AsignTroops(Player player)
        {
            // This returns an int even when result is decimal
            player.AvailableTroops = player.Princedoms.Count/2;
        }
    }
}
