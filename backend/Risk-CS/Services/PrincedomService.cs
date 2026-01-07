using Risk.Data;
using Risk_CS.Data;
using Risk_CS.Models;

namespace Risk_CS.Services
{
    public class PrincedomService
    {
        private readonly AppDbContext _context;

        public PrincedomService(AppDbContext context)
        {
            _context = context;
        }

        public List<Princedom> GeneratePrincedoms(Guid GameId)
        {
            List<Princedom> princedoms = [];
            foreach (PrincedomBlueprint blueprint in PrincedomSource.Blueprints)
            {
                if (blueprint.Id == null) continue;

                princedoms.Add(new Princedom(blueprint.Id.Value, blueprint.Name, GameId));
            }

            return princedoms;
        }

        public bool CheckFrontier(Princedom p1, Princedom p2)
        {
            PrincedomBlueprint pb1 = PrincedomSource.Blueprints.FirstOrDefault(pb => pb.Id == p1.BlueprintID)!;

            if (pb1 == null) return false;
            if (pb1.Frontiers.Contains(p2.BlueprintID)) return true;
            return false;
        }
    }
}
