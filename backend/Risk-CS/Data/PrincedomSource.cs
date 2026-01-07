using Risk_CS.Models;
using System.Text.Json;

namespace Risk_CS.Data
{
    public class PrincedomBlueprint
    {
        public int? Id { get; set; }
        public string? Name { get; set; }
        public List<int> Frontiers { get; set; } = [];
    }

    public class PrincedomSource
    {
        public static List<PrincedomBlueprint> Blueprints { get; private set; } = [];
        
        static PrincedomSource()
        {
            try
            {
                string path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "Blueprints.json");
                string jsonString = File.ReadAllText(path);
                JsonSerializerOptions options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                Blueprints = JsonSerializer.Deserialize<List<PrincedomBlueprint>>(jsonString, options) ?? new List<PrincedomBlueprint>();
            }
            catch (Exception e)
            {
                Console.WriteLine($"ERROR CARGANDO EL MAPA: {e.Message}");  
                Blueprints = new List<PrincedomBlueprint>();
            }
        }
    }
}
