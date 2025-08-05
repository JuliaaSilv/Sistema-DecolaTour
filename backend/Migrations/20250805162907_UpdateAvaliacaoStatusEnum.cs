using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace agencia.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAvaliacaoStatusEnum : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TB_AVALIACOES_TB_RESERVAS_ID_RESERVA1",
                table: "TB_AVALIACOES");

            migrationBuilder.DropIndex(
                name: "IX_TB_AVALIACOES_ID_RESERVA1",
                table: "TB_AVALIACOES");

            migrationBuilder.RenameColumn(
                name: "ID_RESERVA1",
                table: "TB_AVALIACOES",
                newName: "STATUS");

            migrationBuilder.AddColumn<DateTime>(
                name: "DATA_VIAGEM",
                table: "TB_RESERVAS",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "TB_CARTOES",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    USUARIO_ID = table.Column<int>(type: "int", nullable: false),
                    NOME_TITULAR = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NUMERO_CARTAO = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VALIDADE = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CVV = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TIPO_CARTAO = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    APELIDO = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ATIVO = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TB_CARTOES", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TB_CARTOES_TB_USUARIOS_USUARIO_ID",
                        column: x => x.USUARIO_ID,
                        principalTable: "TB_USUARIOS",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TB_ENDERECOS",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    USUARIO_ID = table.Column<int>(type: "int", nullable: false),
                    CEP = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LOGRADOURO = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NUMERO = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    COMPLEMENTO = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BAIRRO = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CIDADE = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ESTADO = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PAIS = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    APELIDO = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ATIVO = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TB_ENDERECOS", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TB_ENDERECOS_TB_USUARIOS_USUARIO_ID",
                        column: x => x.USUARIO_ID,
                        principalTable: "TB_USUARIOS",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TB_AVALIACOES_ID_RESERVA",
                table: "TB_AVALIACOES",
                column: "ID_RESERVA");

            migrationBuilder.CreateIndex(
                name: "IX_TB_CARTOES_USUARIO_ID",
                table: "TB_CARTOES",
                column: "USUARIO_ID");

            migrationBuilder.CreateIndex(
                name: "IX_TB_ENDERECOS_USUARIO_ID",
                table: "TB_ENDERECOS",
                column: "USUARIO_ID");

            migrationBuilder.AddForeignKey(
                name: "FK_TB_AVALIACOES_TB_RESERVAS_ID_RESERVA",
                table: "TB_AVALIACOES",
                column: "ID_RESERVA",
                principalTable: "TB_RESERVAS",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TB_AVALIACOES_TB_RESERVAS_ID_RESERVA",
                table: "TB_AVALIACOES");

            migrationBuilder.DropTable(
                name: "TB_CARTOES");

            migrationBuilder.DropTable(
                name: "TB_ENDERECOS");

            migrationBuilder.DropIndex(
                name: "IX_TB_AVALIACOES_ID_RESERVA",
                table: "TB_AVALIACOES");

            migrationBuilder.DropColumn(
                name: "DATA_VIAGEM",
                table: "TB_RESERVAS");

            migrationBuilder.RenameColumn(
                name: "STATUS",
                table: "TB_AVALIACOES",
                newName: "ID_RESERVA1");

            migrationBuilder.CreateIndex(
                name: "IX_TB_AVALIACOES_ID_RESERVA1",
                table: "TB_AVALIACOES",
                column: "ID_RESERVA1");

            migrationBuilder.AddForeignKey(
                name: "FK_TB_AVALIACOES_TB_RESERVAS_ID_RESERVA1",
                table: "TB_AVALIACOES",
                column: "ID_RESERVA1",
                principalTable: "TB_RESERVAS",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
