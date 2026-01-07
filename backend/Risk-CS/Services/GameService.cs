using Microsoft.EntityFrameworkCore;
using Risk.Data;
using Risk_CS.Models;
using System;

namespace Risk_CS.Services
{
    public class GameService
    {
        private readonly AppDbContext _context;
        private readonly PlayerService _playerService;
        private readonly PrincedomService _princedomService;

        public GameService(AppDbContext context, PlayerService playerService, PrincedomService princedomService)
        {
            _context = context;
            _playerService = playerService;
            _princedomService = princedomService;
        }

        public async Task<Game> GetGame(Guid GameID)
        {
            Game game = await _context.Games
                                .Include(game => game.Players)
                                .Include(game => game.Princedoms)
                                .FirstOrDefaultAsync(game => game.Id == GameID);
            if (game == null) throw new Exception("Game not found");

            return game;
        }


        public async Task<Game> CreateGame(PlayerDTO creatorDTO)
        {
            Game game = new Game();

            // Add the game creator as a player from the DTO
            Player creator = _playerService.AddPlayer(creatorDTO, game.Id);
            game.Players.Add(creator);
            game.CurrentPlayerID = creator.Id;


            // Creating princedoms from the tamplates data
            List<Princedom> princedoms = _princedomService.GeneratePrincedoms(game.Id);
            game.Princedoms.AddRange(princedoms);

            _context.Games.Add(game);
            await _context.SaveChangesAsync();
            return game;
        }

        public async Task<Game> JoinGame(PlayerDTO playerDTO, Guid GameID)
        {
            Game game = await _context.Games
                                .Include(game => game.Players)
                                .FirstOrDefaultAsync(game => game.Id == GameID);

            if (game == null) throw new Exception("Game not found");

            if (game.GameState != State.WAITING) throw new Exception("Cannot join a game that has already started");
            if (game.Players.Count >= 4) throw new Exception("Game is full");

            // Create a player with the DTO and adding it to the game list
            Player newPlayer = _playerService.AddPlayer(playerDTO, GameID);
            _context.Player.Add(newPlayer);


            await _context.SaveChangesAsync();
            return game;

        }

        public async Task<Game> StartGame(Guid GameID)
        {
            Game game = await _context.Games
                                .Include(game => game.Players)
                                .Include(game => game.Princedoms)
                                .FirstOrDefaultAsync(game => game.Id == GameID);

            if (game == null) throw new Exception("Game not found");
            if (game.Players.Count <= 1) throw new Exception("There are not enough players in the game");
            if (game.GameState != State.WAITING) throw new Exception("There are not enough players in the game");



            Random random = new Random();

            // Setting the first Highstorm
            game.NextHighstorm = random.Next(1, 3);


            // Assigning princedoms to players randomly
            var randomPrincedoms = game.Princedoms.OrderBy(x => random.Next()).ToList();

            for (int i = 0; i < randomPrincedoms.Count; i++)
            {
                Princedom princedom = game.Princedoms[i];
                Player player = game.Players[i % game.Players.Count];
                princedom.PlayerID = player.Id;
                princedom.Player = player;
                princedom.Troops = 3;
            }
        
            // Assigning available troops for each player
            foreach(Player p in game.Players)
        {
                _playerService.AsignTroops(p);
            }

            // Setting the Game State as Placing
            game.GameState = State.PLACING;

            await _context.SaveChangesAsync();
            return game;
        }


        public async Task<bool> CheckFrontiers(Guid p1_id, Guid p2_id)
        {
            Princedom p1 = await _context.Princedoms.FirstOrDefaultAsync(princedom => princedom.Id == p1_id);
            Princedom p2 = await _context.Princedoms.FirstOrDefaultAsync(princedom => princedom.Id == p2_id);

            bool result = _princedomService.CheckFrontier(p1, p2);
            return result;
        }

        
        public async Task<Game> PlaceTroops(Guid ownerGuid, List<PlacementDTO> placementList)
            {
            // Getting the game by the playerID given
            Game game = await _context.Games
                            .Include(g => g.Players)
                            .Include(g => g.Princedoms)
                            .FirstOrDefaultAsync(g => g.Players.Any(p => p.Id == ownerGuid));

            if (game == null) throw new Exception("Game not found");
            if (game.CurrentPlayerID != ownerGuid) throw new Exception("Its not your turn to play");
            if (game.GameState != State.PLACING) throw new Exception("You cannot place troops right now");

            
            Player player = game.Players.First(p => p.Id == ownerGuid);

            // Getting the summ of all the troops placed
            int totalTroopsPlaced = placementList.Sum(p => p.Troops);

            if (placementList.Any(p => p.Troops <= 0)) throw new Exception("Cant place 0 or negative troops");
            if (totalTroopsPlaced > player.AvailableTroops) throw new Exception("You cant place more troops than available");

            // Making sure you own every Princedom
            foreach (PlacementDTO placement in placementList)
                {
                Princedom princedom = game.Princedoms.FirstOrDefault(p => p.Id == placement.PrincedomID);

                if (princedom == null) throw new Exception("Princedom not found");
                if (princedom.PlayerID != ownerGuid) throw new Exception("You cant place troops on this princedom");
                }

            // Updating every princedom with the new troops added
            foreach (PlacementDTO placement in placementList)
            {
                Princedom princedom = game.Princedoms.FirstOrDefault(p => p.Id == placement.PrincedomID);

                princedom.Troops += placement.Troops;
            }

            // Updating the available troops left for the player
            player.AvailableTroops -= totalTroopsPlaced;

            // Setting the Game State as Attacking
            game.GameState = State.ATTACKING;

            await _context.SaveChangesAsync();
            return game;
        }
        }
    }
}
