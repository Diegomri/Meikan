using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Meikan.Data.Migrations
{
    /// <inheritdoc />
    public partial class OrdersV1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Orders",
                schema: "Meikan",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    CartId = table.Column<Guid>(type: "uuid", nullable: false),
                    DateOrdered = table.Column<DateOnly>(type: "date", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    TotalPrice = table.Column<decimal>(type: "numeric", nullable: false),
                    UserId1 = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Orders_Users_UserId1",
                        column: x => x.UserId1,
                        principalSchema: "Meikan",
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Orders_UserId1",
                schema: "Meikan",
                table: "Orders",
                column: "UserId1");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Orders",
                schema: "Meikan");
        }
    }
}
