using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace agencia.Migrations
{
    /// <inheritdoc />
    public partial class AtualizacaoSistemaLimpo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "VERSÃO",
                table: "TB_PACOTES",
                newName: "VERSAO");

            migrationBuilder.AlterColumn<decimal>(
                name: "VALOR_UNITARIO",
                table: "TB_RESERVAS",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(float),
                oldType: "real");

            migrationBuilder.AlterColumn<int>(
                name: "STATUS",
                table: "TB_AVALIACOES",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "VERSAO",
                table: "TB_PACOTES",
                newName: "VERSÃO");

            migrationBuilder.AlterColumn<float>(
                name: "VALOR_UNITARIO",
                table: "TB_RESERVAS",
                type: "real",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<string>(
                name: "STATUS",
                table: "TB_AVALIACOES",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }
    }
}
