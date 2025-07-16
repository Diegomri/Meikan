using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Meikan.Data.Migrations
{
    /// <inheritdoc />
    public partial class CartsV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Carts_Users_UserId1",
                schema: "Meikan",
                table: "Carts");

            migrationBuilder.DropIndex(
                name: "IX_Carts_UserId1",
                schema: "Meikan",
                table: "Carts");

            migrationBuilder.DropColumn(
                name: "UserId1",
                schema: "Meikan",
                table: "Carts");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                schema: "Meikan",
                table: "Carts",
                type: "text",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.CreateIndex(
                name: "IX_Carts_UserId",
                schema: "Meikan",
                table: "Carts",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Carts_Users_UserId",
                schema: "Meikan",
                table: "Carts",
                column: "UserId",
                principalSchema: "Meikan",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Carts_Users_UserId",
                schema: "Meikan",
                table: "Carts");

            migrationBuilder.DropIndex(
                name: "IX_Carts_UserId",
                schema: "Meikan",
                table: "Carts");

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                schema: "Meikan",
                table: "Carts",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "UserId1",
                schema: "Meikan",
                table: "Carts",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Carts_UserId1",
                schema: "Meikan",
                table: "Carts",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Carts_Users_UserId1",
                schema: "Meikan",
                table: "Carts",
                column: "UserId1",
                principalSchema: "Meikan",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
