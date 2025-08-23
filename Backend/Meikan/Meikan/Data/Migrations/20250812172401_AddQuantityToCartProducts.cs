using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Meikan.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddQuantityToCartProducts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Users_UserId",
                schema: "Meikan",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_UserId",
                schema: "Meikan",
                table: "Orders");

            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                schema: "Meikan",
                table: "CartProducts",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                schema: "Meikan",
                table: "CartProducts",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Id",
                schema: "Meikan",
                table: "CartProducts");

            migrationBuilder.DropColumn(
                name: "Quantity",
                schema: "Meikan",
                table: "CartProducts");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_UserId",
                schema: "Meikan",
                table: "Orders",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Users_UserId",
                schema: "Meikan",
                table: "Orders",
                column: "UserId",
                principalSchema: "Meikan",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
