using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Risk.Data;
using Risk_CS.Hubs;
using Risk_CS.Models;
using System;
using System.Numerics;

namespace Risk_CS.Services
{
    public class GameService
    {
        private readonly AppDbContext _context;
        private readonly PlayerService _playerService;
        private readonly PrincedomService _princedomService;
        private readonly IHubContext<RiskHub> _hubContext;

        public GameService(AppDbContext context, PlayerService playerService, PrincedomService princedomService, IHubContext<RiskHub> hubContext)
        {
            _context = context;
            _playerService = playerService;
            _princedomService = princedomService;
            _hubContext = hubContext;
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

        public async Task<List<Game>> GetWaitingGames()
        {
            List<Game> games = await _context.Games
                                .Include(game => game.Players)
                                .Where(game => game.GameState == State.WAITING )
                                .ToListAsync();
            if (games == null) throw new Exception("Game not found");

            return games;
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

            await _hubContext.Clients.Group(game.Id.ToString())
                .SendAsync("ReceiveGame", game);

            return game;
        }

        public async void DeleteGame(Guid gameId)
        {
            var game = _context.Games
                .Include(g => g.Players)
                .Include(g => g.Princedoms)
                .First(g => g.Id == gameId);

            _context.Player.RemoveRange(game.Players);
            _context.Princedoms.RemoveRange(game.Princedoms);
            _context.Games.Remove(game);

            _context.SaveChanges();
        }

        public async Task<JoinResultDTO> JoinGame(PlayerDTO playerDTO, Guid GameID)
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
            await _hubContext.Clients.Group(game.Id.ToString())
                .SendAsync("ReceiveGame", game);

            JoinResultDTO resultDTO = new JoinResultDTO(game, newPlayer)
            {
                Game = game,
                Player = newPlayer
            };
            return resultDTO;

        }

        public async Task<Game> LeaveLobby(Guid playerID)
        {
            // Getting the game by the playerID given
            Game game = await _context.Games
                            .Include(g => g.Players)
                            .Include(g => g.Princedoms)
                            .FirstOrDefaultAsync(g => g.Players.Any(p => p.Id == playerID));

            if (game == null) throw new Exception($"Game not found");
            if (game.GameState != State.WAITING) throw new Exception("Cannot leave a game that has already started");

            if (game.CurrentPlayerID == playerID)
            {
                int currentIndex = game.Players.FindIndex(p => p.Id == playerID);
                int nextIndex = (currentIndex + 1) % game.Players.Count;

                game.CurrentPlayerID = game.Players[nextIndex].Id;
            }

            if(game.Players.Count == 1)
            {
                DeleteGame(game.Id);
            } else
            {
                game.Players.RemoveAll(p => p.Id == playerID);
                await _hubContext.Clients.Group(game.Id.ToString())
                .SendAsync("ReceiveGame", game);
            }

                
            await _context.SaveChangesAsync();
            return game;
        }

        public async Task<Game> LeaveGame(Guid playerID)
        {
            // Getting the game by the playerID given
            Game game = await _context.Games
                            .Include(g => g.Players)
                            .Include(g => g.Princedoms)
                            .FirstOrDefaultAsync(g => g.Players.Any(p => p.Id == playerID));

            if (game == null) throw new Exception($"Game not found");

            int aliveCount = game.Players.Count(p => p.IsAlive);
            if (aliveCount < 2)
            {
                game.GameState = State.FINISHED;
            }
            else
            {
                if (game.CurrentPlayerID == playerID)
                {
                    int currentIndex = game.Players.FindIndex(p => p.Id == playerID);


                    for (int i = 1; i < game.Players.Count; i++)
                    {
                        int nextIndex = (currentIndex + i) % game.Players.Count;
                        var candidate = game.Players[nextIndex];

                        if (candidate.IsAlive)
                        {
                            game.CurrentPlayerID = candidate.Id;

                            game.GameState = State.PLACING;
                            break;
                        }
                    }
                }

                await _context.SaveChangesAsync();
                await _hubContext.Clients.Group(game.Id.ToString())
                    .SendAsync("ReceiveGame", game);
            }

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
            game.NextHighstorm = random.Next(4, 6);


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
            int troops = game.Players.Count switch
            {
                2 or 3 => 2,
                4 => 1,
                _ => 0
            };

            foreach (Player p in game.Players)
            {
                p.AvailableTroops = troops;
            }


            // Setting the Game State as Placing
            game.GameState = State.PLACING;

            await _context.SaveChangesAsync();
            await _hubContext.Clients.Group(game.Id.ToString())
                .SendAsync("ReceiveGame", game);

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

            await _hubContext.Clients.Group(game.Id.ToString())
                .SendAsync("ReceiveGame", game);

            return game;
        }

        public async Task<Game> MoveTroops(Guid ownerGuid, MovementDTO movement)
        {
            // Getting the game by the playerID given
            Game game = await _context.Games
                            .Include(g => g.Players)
                            .Include(g => g.Princedoms)
                            .FirstOrDefaultAsync(g => g.Players.Any(p => p.Id == ownerGuid));

            if (game == null) throw new Exception($"Game not found");
            if (game.CurrentPlayerID != ownerGuid) throw new Exception("Its not your turn to play");
            if (game.GameState != State.MOVING) throw new Exception("You cannot place troops right now");


            // Getting the origin and destination Princedoms
            Princedom originPrincedom = game.Princedoms.FirstOrDefault(p => p.Id == movement.OriginPrincedomID);
            Princedom destinationPrincedom = game.Princedoms.FirstOrDefault(p => p.Id == movement.DestPrincedomID);
            if (originPrincedom == null || destinationPrincedom == null) throw new Exception($"An error ocurred while getting the Princedoms");

            // Checking right amount of troops, ownership of princedoms and them being next to each other
            if (!_princedomService.CheckFrontier(originPrincedom, destinationPrincedom)) throw new Exception("The princedoms are not neighbours");
            if (movement.Troops < 0) throw new Exception("You have to move one or more troops");
            if (movement.Troops > (originPrincedom.Troops - 1)) throw new Exception("You are trying to move more troops than available");
            if (originPrincedom.PlayerID != ownerGuid) throw new Exception("You dont own the princedom of origin");
            if (destinationPrincedom.PlayerID != ownerGuid) throw new Exception("You dont own the princedom of destination");
            

            originPrincedom.Troops -= movement.Troops;
            destinationPrincedom.Troops += movement.Troops;

            await _context.SaveChangesAsync();

            await _hubContext.Clients.Group(game.Id.ToString())
                .SendAsync("ReceiveGame", game);

            return game;
        }

        public async Task<Game> FinishMoving(Guid playerGuid)
        {
            // Getting the game by the playerID given
            Game game = await _context.Games
                            .Include(g => g.Players)
                            .Include(g => g.Princedoms)
                            .FirstOrDefaultAsync(g => g.Players.Any(p => p.Id == playerGuid));

            if (game == null) throw new Exception($"Game not found");
            if (game.CurrentPlayerID != playerGuid) throw new Exception("Its not your turn to play");
            if (game.GameState != State.MOVING) throw new Exception("You cannot place troops right now");

            // Setting the CurrentPlayerID as the next player's ID 
            int currentIndex = game.Players.FindIndex(p => p.Id == playerGuid);
            int nextIndex = (currentIndex + 1) % game.Players.Count;

            game.CurrentPlayerID = game.Players[nextIndex].Id;

            // Skipping eliminated players
            Player nextPlayer = game.Players.First(p => p.Id == game.CurrentPlayerID);
            while (nextPlayer.IsAlive == false)
            {
                nextIndex = (nextIndex + 1) % game.Players.Count;
                game.CurrentPlayerID = game.Players[nextIndex].Id;
                nextPlayer = game.Players.First(p => p.Id == game.CurrentPlayerID);
            }

            // Assigning his troops
            _playerService.AsignTroops(game.Players[nextIndex]);

            bool stormHappened = false;
            // Calculating the next Highstorm
            game.NextHighstorm--;
            if (game.NextHighstorm == 0)
            {
                foreach(Princedom p in game.Princedoms)
                {
                    if (p.Troops > 1)
                    {
                        p.Troops--;
                    }
                }
                stormHappened = true;
            }

            Random random = new Random();
            game.NextHighstorm = random.Next(4, 6);

            // Changing the GameState for the next player
            game.GameState = State.PLACING;

            await _context.SaveChangesAsync();

            await _hubContext.Clients.Group(game.Id.ToString())
                .SendAsync("ReceiveGame", game);

            await _hubContext.Clients.Group(game.Id.ToString())
                .SendAsync("ReceiveHighStorm", game);

            return game;
        }


        public async Task<AttackResultDTO> AttackPrincedom(Guid attackerGuid, AttackDTO attack)
        {
            // Getting the game by the playerID given
            Game game = await _context.Games
                            .Include(g => g.Players)
                            .Include(g => g.Princedoms)
                            .FirstOrDefaultAsync(g => g.Players.Any(p => p.Id == attackerGuid));

            if (game == null) throw new Exception($"Game not found");
            if (game.CurrentPlayerID != attackerGuid) throw new Exception("Its not your turn to play");
            if (game.GameState != State.ATTACKING) throw new Exception("You cannot place troops right now");


            // Getting the origin and destination Princedoms
            Princedom attacking = game.Princedoms.First(p => p.Id == attack.AttackingPrincedomId);
            Princedom defending = game.Princedoms.First(p => p.Id == attack.DefendingPrincedomId);
            if (attacking == null || defending == null) throw new Exception($"An error ocurred while getting the Princedoms");
            if (attacking.Troops <= 1) throw new Exception("You must have 2 or more troops to attack");
            if (attacking.PlayerID != attackerGuid) throw new Exception("You dont own the princedom of origin");
            if (defending.PlayerID == attackerGuid) throw new Exception("You cant attack your own princedom");

            // Calculate dice quantity based on troop amounts
            int numDiceAtk = Math.Min(3, attacking.Troops - 1);
            int numDiceDef = Math.Min(2, defending.Troops);


            // Creating the dice list for both sides
            List<int> diceAtk = RollDiceList(numDiceAtk);
            List<int> diceDef = RollDiceList(numDiceDef);

            int lossAtk = 0;
            int lossDef = 0;


            // Comparing both lists to determine the amount of troops lost on each side
            int comparaciones = Math.Min(diceAtk.Count, diceDef.Count);
            for (int i = 0; i < comparaciones; i++)
            {
                if (diceAtk[i] > diceDef[i])
                    lossDef++;
                else
                    lossAtk++;
            }

            // Deduct troops lost
            attacking.Troops -= lossAtk;
            defending.Troops -= lossDef;

            bool conquered = false;
            // Set the new owner if the princedom is conquererd
            if (defending.Troops <= 0)
            {
                defending.PlayerID = attackerGuid;
                attacking.Troops -= numDiceAtk;
                defending.Troops = numDiceAtk;
                conquered = true;
            }

            CheckEliminatedPlayers(game);

            // Creating returningDTO with the attack data
            AttackResultDTO resultDTO = new AttackResultDTO
            {
                UpdatedGame = game,
                AttackerDice = diceAtk,
                DefenderDice = diceDef,
                AttackerLost = lossAtk,
                DefenderLost = lossDef,
                AttackingPrincedomId = attack.AttackingPrincedomId,
                DefendingPrincedomId = attack.DefendingPrincedomId,
                Conquered = conquered,

            };

            await _context.SaveChangesAsync();

            await _hubContext.Clients.Group(game.Id.ToString())
                .SendAsync("ReceiveGame", game);

            await _hubContext.Clients.Group(game.Id.ToString())
                .SendAsync("ReceiveAttack", resultDTO);

            return resultDTO;
        }

        // Randomize the amount of dice given and return it ordered from high to low
        private static List<int> RollDiceList(int count)
        {
            Random rng = new Random();
            List<int> dice = new List<int>();
            for (int i = 0; i < count; i++) dice.Add(rng.Next(1, 7));
            return dice.OrderByDescending(d => d).ToList();
        }

        // Method that checks if any of the players is dead
        private void CheckEliminatedPlayers(Game game)
        {
            List<Player> playersToCheck = game.Players.ToList();

            foreach (Player player in playersToCheck)
            {
                bool isAlive = game.Princedoms.Any(p => p.PlayerID == player.Id);

                if (!isAlive)
                {
                    game.Players.Remove(player);
                }
                

                if(game.Players.Count == 0)
                {
                    game.GameState = State.FINISHED;
                }
            }
        }

        public async Task<Game> FinishAttacking(Guid playerID)
        {
            // Getting the game by the playerID given
            Game game = await _context.Games
                            .Include(g => g.Players)
                            .Include(g => g.Princedoms)
                            .FirstOrDefaultAsync(g => g.Players.Any(p => p.Id == playerID));

            if (game == null) throw new Exception($"Game not found");
            if (game.CurrentPlayerID != playerID) throw new Exception("Its not your turn to play");
            if (game.GameState != State.ATTACKING) throw new Exception("You cannot place troops right now");

            game.GameState = State.MOVING;

            await _context.SaveChangesAsync();

            await _hubContext.Clients.Group(game.Id.ToString())
                .SendAsync("ReceiveGame", game);

            return game;
        }
    }
}
