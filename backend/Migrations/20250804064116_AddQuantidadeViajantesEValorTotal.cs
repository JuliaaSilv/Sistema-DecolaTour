using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace agencia.Migrations
{
    /// <inheritdoc />
    public partial class AddQuantidadeViajantesEValorTotal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TB_DOCUMENTOS_TB_USUARIOS_USUARIO_ID1",
                table: "TB_DOCUMENTOS");

            migrationBuilder.DropForeignKey(
                name: "FK_TB_PAGAMENTOS_TB_RESERVAS_ID_RESERVA1",
                table: "TB_PAGAMENTOS");

            migrationBuilder.DropForeignKey(
                name: "FK_TB_RESERVAS_TB_PACOTES_PACOTE_ID1",
                table: "TB_RESERVAS");

            migrationBuilder.DropForeignKey(
                name: "FK_TB_VIAGANTES_TB_RESERVAS_ID_RESERVA1",
                table: "TB_VIAGANTES");

            migrationBuilder.DropIndex(
                name: "IX_TB_VIAGANTES_ID_RESERVA1",
                table: "TB_VIAGANTES");

            migrationBuilder.DropIndex(
                name: "IX_TB_RESERVAS_PACOTE_ID1",
                table: "TB_RESERVAS");

            migrationBuilder.DropIndex(
                name: "IX_TB_PAGAMENTOS_ID_RESERVA1",
                table: "TB_PAGAMENTOS");

            migrationBuilder.DropIndex(
                name: "IX_TB_DOCUMENTOS_USUARIO_ID1",
                table: "TB_DOCUMENTOS");

            migrationBuilder.DropColumn(
                name: "ID_RESERVA1",
                table: "TB_VIAGANTES");

            migrationBuilder.DropColumn(
                name: "PACOTE_ID1",
                table: "TB_RESERVAS");

            migrationBuilder.DropColumn(
                name: "ID_RESERVA1",
                table: "TB_PAGAMENTOS");

            migrationBuilder.DropColumn(
                name: "USUARIO_ID1",
                table: "TB_DOCUMENTOS");

            // Verificar se a coluna ORIGEM existe antes de renomear
            migrationBuilder.Sql(@"
                IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'TB_PACOTES' AND COLUMN_NAME = 'ORIGEM')
                BEGIN
                    EXEC sp_rename 'TB_PACOTES.ORIGEM', 'CATEGORIAS', 'COLUMN'
                END
            ");

            migrationBuilder.AddColumn<int>(
                name: "HistoricoPacoteId",
                table: "VideosPacote",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "QUANTIDADE_VIAJANTES",
                table: "TB_RESERVAS",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "VALOR_TOTAL",
                table: "TB_RESERVAS",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ATUALIZADO_EM",
                table: "TB_PACOTES",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ATUALIZADO_POR",
                table: "TB_PACOTES",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CRIADO_EM",
                table: "TB_PACOTES",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CRIADO_POR",
                table: "TB_PACOTES",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ESTRELAS",
                table: "TB_PACOTES",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "VERSÃO",
                table: "TB_PACOTES",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "HistoricoPacoteId",
                table: "ImagensPacote",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "PacotesHistorico",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PacoteId = table.Column<int>(type: "int", nullable: false),
                    TITULO = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DESCRICAO = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DESTINO = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ESTRELAS = table.Column<int>(type: "int", nullable: false),
                    DURACAO = table.Column<int>(type: "int", nullable: false),
                    DATA_DISPONIVEL = table.Column<DateTime>(type: "datetime2", nullable: false),
                    VALOR_TOTAL = table.Column<float>(type: "real", nullable: false),
                    QUANTIDADE_MAXIMA = table.Column<int>(type: "int", nullable: false),
                    CRIADO_POR = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CRIADO_EM = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ATUALIZADO_POR = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ATUALIZADO_EM = table.Column<DateTime>(type: "datetime2", nullable: true),
                    VERSÃO = table.Column<int>(type: "int", nullable: false),
                    CATEGORIAS = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PacotesHistorico", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_VideosPacote_HistoricoPacoteId",
                table: "VideosPacote",
                column: "HistoricoPacoteId");

            migrationBuilder.CreateIndex(
                name: "IX_TB_VIAGANTES_ID_RESERVA",
                table: "TB_VIAGANTES",
                column: "ID_RESERVA");

            migrationBuilder.CreateIndex(
                name: "IX_TB_RESERVAS_PACOTE_ID",
                table: "TB_RESERVAS",
                column: "PACOTE_ID");

            migrationBuilder.CreateIndex(
                name: "IX_TB_PAGAMENTOS_ID_RESERVA",
                table: "TB_PAGAMENTOS",
                column: "ID_RESERVA");

            migrationBuilder.CreateIndex(
                name: "IX_TB_DOCUMENTOS_USUARIO_ID",
                table: "TB_DOCUMENTOS",
                column: "USUARIO_ID");

            migrationBuilder.CreateIndex(
                name: "IX_ImagensPacote_HistoricoPacoteId",
                table: "ImagensPacote",
                column: "HistoricoPacoteId");

            migrationBuilder.AddForeignKey(
                name: "FK_ImagensPacote_PacotesHistorico_HistoricoPacoteId",
                table: "ImagensPacote",
                column: "HistoricoPacoteId",
                principalTable: "PacotesHistorico",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TB_DOCUMENTOS_TB_USUARIOS_USUARIO_ID",
                table: "TB_DOCUMENTOS",
                column: "USUARIO_ID",
                principalTable: "TB_USUARIOS",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TB_PAGAMENTOS_TB_RESERVAS_ID_RESERVA",
                table: "TB_PAGAMENTOS",
                column: "ID_RESERVA",
                principalTable: "TB_RESERVAS",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TB_RESERVAS_TB_PACOTES_PACOTE_ID",
                table: "TB_RESERVAS",
                column: "PACOTE_ID",
                principalTable: "TB_PACOTES",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TB_VIAGANTES_TB_RESERVAS_ID_RESERVA",
                table: "TB_VIAGANTES",
                column: "ID_RESERVA",
                principalTable: "TB_RESERVAS",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_VideosPacote_PacotesHistorico_HistoricoPacoteId",
                table: "VideosPacote",
                column: "HistoricoPacoteId",
                principalTable: "PacotesHistorico",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ImagensPacote_PacotesHistorico_HistoricoPacoteId",
                table: "ImagensPacote");

            migrationBuilder.DropForeignKey(
                name: "FK_TB_DOCUMENTOS_TB_USUARIOS_USUARIO_ID",
                table: "TB_DOCUMENTOS");

            migrationBuilder.DropForeignKey(
                name: "FK_TB_PAGAMENTOS_TB_RESERVAS_ID_RESERVA",
                table: "TB_PAGAMENTOS");

            migrationBuilder.DropForeignKey(
                name: "FK_TB_RESERVAS_TB_PACOTES_PACOTE_ID",
                table: "TB_RESERVAS");

            migrationBuilder.DropForeignKey(
                name: "FK_TB_VIAGANTES_TB_RESERVAS_ID_RESERVA",
                table: "TB_VIAGANTES");

            migrationBuilder.DropForeignKey(
                name: "FK_VideosPacote_PacotesHistorico_HistoricoPacoteId",
                table: "VideosPacote");

            migrationBuilder.DropTable(
                name: "PacotesHistorico");

            migrationBuilder.DropIndex(
                name: "IX_VideosPacote_HistoricoPacoteId",
                table: "VideosPacote");

            migrationBuilder.DropIndex(
                name: "IX_TB_VIAGANTES_ID_RESERVA",
                table: "TB_VIAGANTES");

            migrationBuilder.DropIndex(
                name: "IX_TB_RESERVAS_PACOTE_ID",
                table: "TB_RESERVAS");

            migrationBuilder.DropIndex(
                name: "IX_TB_PAGAMENTOS_ID_RESERVA",
                table: "TB_PAGAMENTOS");

            migrationBuilder.DropIndex(
                name: "IX_TB_DOCUMENTOS_USUARIO_ID",
                table: "TB_DOCUMENTOS");

            migrationBuilder.DropIndex(
                name: "IX_ImagensPacote_HistoricoPacoteId",
                table: "ImagensPacote");

            migrationBuilder.DropColumn(
                name: "HistoricoPacoteId",
                table: "VideosPacote");

            migrationBuilder.DropColumn(
                name: "QUANTIDADE_VIAJANTES",
                table: "TB_RESERVAS");

            migrationBuilder.DropColumn(
                name: "VALOR_TOTAL",
                table: "TB_RESERVAS");

            migrationBuilder.DropColumn(
                name: "ATUALIZADO_EM",
                table: "TB_PACOTES");

            migrationBuilder.DropColumn(
                name: "ATUALIZADO_POR",
                table: "TB_PACOTES");

            migrationBuilder.DropColumn(
                name: "CRIADO_EM",
                table: "TB_PACOTES");

            migrationBuilder.DropColumn(
                name: "CRIADO_POR",
                table: "TB_PACOTES");

            migrationBuilder.DropColumn(
                name: "ESTRELAS",
                table: "TB_PACOTES");

            migrationBuilder.DropColumn(
                name: "VERSÃO",
                table: "TB_PACOTES");

            migrationBuilder.DropColumn(
                name: "HistoricoPacoteId",
                table: "ImagensPacote");

            // Verificar se a coluna CATEGORIAS existe antes de renomear de volta
            migrationBuilder.Sql(@"
                IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'TB_PACOTES' AND COLUMN_NAME = 'CATEGORIAS')
                BEGIN
                    EXEC sp_rename 'TB_PACOTES.CATEGORIAS', 'ORIGEM', 'COLUMN'
                END
            ");

            migrationBuilder.AddColumn<int>(
                name: "ID_RESERVA1",
                table: "TB_VIAGANTES",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PACOTE_ID1",
                table: "TB_RESERVAS",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ID_RESERVA1",
                table: "TB_PAGAMENTOS",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "USUARIO_ID1",
                table: "TB_DOCUMENTOS",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_TB_VIAGANTES_ID_RESERVA1",
                table: "TB_VIAGANTES",
                column: "ID_RESERVA1");

            migrationBuilder.CreateIndex(
                name: "IX_TB_RESERVAS_PACOTE_ID1",
                table: "TB_RESERVAS",
                column: "PACOTE_ID1");

            migrationBuilder.CreateIndex(
                name: "IX_TB_PAGAMENTOS_ID_RESERVA1",
                table: "TB_PAGAMENTOS",
                column: "ID_RESERVA1");

            migrationBuilder.CreateIndex(
                name: "IX_TB_DOCUMENTOS_USUARIO_ID1",
                table: "TB_DOCUMENTOS",
                column: "USUARIO_ID1");

            migrationBuilder.AddForeignKey(
                name: "FK_TB_DOCUMENTOS_TB_USUARIOS_USUARIO_ID1",
                table: "TB_DOCUMENTOS",
                column: "USUARIO_ID1",
                principalTable: "TB_USUARIOS",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TB_PAGAMENTOS_TB_RESERVAS_ID_RESERVA1",
                table: "TB_PAGAMENTOS",
                column: "ID_RESERVA1",
                principalTable: "TB_RESERVAS",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TB_RESERVAS_TB_PACOTES_PACOTE_ID1",
                table: "TB_RESERVAS",
                column: "PACOTE_ID1",
                principalTable: "TB_PACOTES",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TB_VIAGANTES_TB_RESERVAS_ID_RESERVA1",
                table: "TB_VIAGANTES",
                column: "ID_RESERVA1",
                principalTable: "TB_RESERVAS",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
