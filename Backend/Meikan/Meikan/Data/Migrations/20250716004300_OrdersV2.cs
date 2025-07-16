using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Meikan.Data.Migrations
{
    /// <inheritdoc />
    public partial class OrdersV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Users_UserId1",
                schema: "Meikan",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_UserId1",
                schema: "Meikan",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "UserId1",
                schema: "Meikan",
                table: "Orders");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                schema: "Meikan",
                table: "Orders",
                type: "text",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Users_UserId",
                schema: "Meikan",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_UserId",
                schema: "Meikan",
                table: "Orders");

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                schema: "Meikan",
                table: "Orders",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "UserId1",
                schema: "Meikan",
                table: "Orders",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Orders_UserId1",
                schema: "Meikan",
                table: "Orders",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Users_UserId1",
                schema: "Meikan",
                table: "Orders",
                column: "UserId1",
                principalSchema: "Meikan",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
