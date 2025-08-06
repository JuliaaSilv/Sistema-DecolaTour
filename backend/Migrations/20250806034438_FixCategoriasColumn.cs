using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace agencia.Migrations
{
    /// <inheritdoc />
    public partial class FixCategoriasColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Verificar se a coluna CATEGORIAS existe, se não existir, criar ela
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'TB_PACOTES' AND COLUMN_NAME = 'CATEGORIAS')
                BEGIN
                    ALTER TABLE TB_PACOTES ADD CATEGORIAS nvarchar(max) NOT NULL DEFAULT ''
                END
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Remover a coluna CATEGORIAS se ela existir
            migrationBuilder.Sql(@"
                IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'TB_PACOTES' AND COLUMN_NAME = 'CATEGORIAS')
                BEGIN
                    ALTER TABLE TB_PACOTES DROP COLUMN CATEGORIAS
                END
            ");
        }
    }
}
