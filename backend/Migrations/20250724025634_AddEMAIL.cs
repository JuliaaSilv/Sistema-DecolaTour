using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace agencia.Migrations
{
    /// <inheritdoc />
    public partial class AddEMAIL : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "EMAIL_COMFIRMADO",
                table: "TB_USUARIOS",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "TOKEN_EMAILCONFIRMADO",
                table: "TB_USUARIOS",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "TOKEN_EXPIRACAO_EMAILCONFIRMADO",
                table: "TB_USUARIOS",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "TOKEN_EXPIRACAO_RECUPERACAO_SENHA",
                table: "TB_USUARIOS",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "TOKEN_RECUPERACAO_SENHA",
                table: "TB_USUARIOS",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EMAIL_COMFIRMADO",
                table: "TB_USUARIOS");

            migrationBuilder.DropColumn(
                name: "TOKEN_EMAILCONFIRMADO",
                table: "TB_USUARIOS");

            migrationBuilder.DropColumn(
                name: "TOKEN_EXPIRACAO_EMAILCONFIRMADO",
                table: "TB_USUARIOS");

            migrationBuilder.DropColumn(
                name: "TOKEN_EXPIRACAO_RECUPERACAO_SENHA",
                table: "TB_USUARIOS");

            migrationBuilder.DropColumn(
                name: "TOKEN_RECUPERACAO_SENHA",
                table: "TB_USUARIOS");
        }
    }
}
