using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Risk_CS.Migrations
{
    /// <inheritdoc />
    public partial class Initialization : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Games",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GameState = table.Column<int>(type: "int", nullable: false),
                    CurrentPlayerID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CurrentRound = table.Column<int>(type: "int", nullable: false),
                    NextHighstorm = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Games", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Player",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Color = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AvailableTroops = table.Column<int>(type: "int", nullable: false),
                    IsAlive = table.Column<bool>(type: "bit", nullable: false),
                    GameId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Player", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Player_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Princedoms",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BlueprintID = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Troops = table.Column<int>(type: "int", nullable: false),
                    PlayerID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    GameID = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Princedoms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Princedoms_Games_GameID",
                        column: x => x.GameID,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Princedoms_Player_PlayerID",
                        column: x => x.PlayerID,
                        principalTable: "Player",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Player_GameId",
                table: "Player",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_Princedoms_GameID",
                table: "Princedoms",
                column: "GameID");

            migrationBuilder.CreateIndex(
                name: "IX_Princedoms_PlayerID",
                table: "Princedoms",
                column: "PlayerID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Princedoms");

            migrationBuilder.DropTable(
                name: "Player");

            migrationBuilder.DropTable(
                name: "Games");
        }
    }
}
