using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Meikan.Data.Migrations
{
    /// <inheritdoc />
    public partial class CartsV1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Carts",
                schema: "Meikan",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    DateCreated = table.Column<DateOnly>(type: "date", nullable: false),
                    TotalPrice = table.Column<decimal>(type: "numeric", nullable: false),
                    UserId1 = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Carts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Carts_Users_UserId1",
                        column: x => x.UserId1,
                        principalSchema: "Meikan",
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "CartProducts",
                schema: "Meikan",
                columns: table => new
                {
                    CartId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProductId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CartProducts", x => new { x.CartId, x.ProductId });
                    table.ForeignKey(
                        name: "FK_CartProducts_Carts_CartId",
                        column: x => x.CartId,
                        principalSchema: "Meikan",
                        principalTable: "Carts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CartProducts_Products_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "Meikan",
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CartProducts_ProductId",
                schema: "Meikan",
                table: "CartProducts",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Carts_UserId1",
                schema: "Meikan",
                table: "Carts",
                column: "UserId1");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CartProducts",
                schema: "Meikan");

            migrationBuilder.DropTable(
                name: "Carts",
                schema: "Meikan");
        }
    }
}
