using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace agencia.Migrations
{
    /// <inheritdoc />
    public partial class AddPacoteComMultiplosArquivos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TB_PROMOCOES",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NOME = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DESCRICAO = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DESCONTO_PERCENTUAL = table.Column<float>(type: "real", nullable: false),
                    DATA_INICIO = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DATA_FIM = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TB_PROMOCOES", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TB_TIPO_USUARIO",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NOME = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TB_TIPO_USUARIO", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TB_PACOTES",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TITULO = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DESCRICAO = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DESTINO = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DURACAO = table.Column<int>(type: "int", nullable: false),
                    DATA_DISPONIVEL = table.Column<DateTime>(type: "datetime2", nullable: false),
                    VALOR_TOTAL = table.Column<float>(type: "real", nullable: false),
                    PromocaoId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TB_PACOTES", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TB_PACOTES_TB_PROMOCOES_PromocaoId",
                        column: x => x.PromocaoId,
                        principalTable: "TB_PROMOCOES",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "TB_USUARIOS",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NOME = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CPF = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TELEFONE = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DATA_NASCIMENTO = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EMAIL = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SENHA = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TIPO_USUARIO_ID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TB_USUARIOS", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TB_USUARIOS_TB_TIPO_USUARIO_TIPO_USUARIO_ID",
                        column: x => x.TIPO_USUARIO_ID,
                        principalTable: "TB_TIPO_USUARIO",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ImagensPacote",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PacoteId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImagensPacote", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ImagensPacote_TB_PACOTES_PacoteId",
                        column: x => x.PacoteId,
                        principalTable: "TB_PACOTES",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TB_MIDIAS",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TIPO = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    URL = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PACOTE_ID = table.Column<int>(type: "int", nullable: false),
                    PACOTE_ID1 = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TB_MIDIAS", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TB_MIDIAS_TB_PACOTES_PACOTE_ID1",
                        column: x => x.PACOTE_ID1,
                        principalTable: "TB_PACOTES",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VideosPacote",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PacoteId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VideosPacote", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VideosPacote_TB_PACOTES_PacoteId",
                        column: x => x.PacoteId,
                        principalTable: "TB_PACOTES",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TB_DOCUMENTOS",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TIPO_DOCUMENTO = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NUMERO_DOCUMENTO = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    USUARIO_ID = table.Column<int>(type: "int", nullable: false),
                    USUARIO_ID1 = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TB_DOCUMENTOS", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TB_DOCUMENTOS_TB_USUARIOS_USUARIO_ID1",
                        column: x => x.USUARIO_ID1,
                        principalTable: "TB_USUARIOS",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TB_RESERVAS",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NUMERO_RESERVA = table.Column<int>(type: "int", nullable: false),
                    DATA_RESERVA = table.Column<DateTime>(type: "datetime2", nullable: false),
                    STATUS = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VALOR_UNITARIO = table.Column<float>(type: "real", nullable: false),
                    USUARIO_ID = table.Column<int>(type: "int", nullable: false),
                    PACOTE_ID = table.Column<int>(type: "int", nullable: false),
                    PACOTE_ID1 = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TB_RESERVAS", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TB_RESERVAS_TB_PACOTES_PACOTE_ID1",
                        column: x => x.PACOTE_ID1,
                        principalTable: "TB_PACOTES",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TB_RESERVAS_TB_USUARIOS_USUARIO_ID",
                        column: x => x.USUARIO_ID,
                        principalTable: "TB_USUARIOS",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TB_AVALIACOES",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NOTA = table.Column<int>(type: "int", nullable: false),
                    COMENTARIO = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DATA_AVALIACAO = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ID_RESERVA = table.Column<int>(type: "int", nullable: false),
                    ID_RESERVA1 = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TB_AVALIACOES", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TB_AVALIACOES_TB_RESERVAS_ID_RESERVA1",
                        column: x => x.ID_RESERVA1,
                        principalTable: "TB_RESERVAS",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TB_PAGAMENTOS",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VALOR = table.Column<float>(type: "real", nullable: false),
                    FORMA_DE_PAGAMENTO = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DATA_PAGAMENTO = table.Column<DateTime>(type: "datetime2", nullable: false),
                    STATUS_PAGAMENTO = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ID_RESERVA = table.Column<int>(type: "int", nullable: false),
                    ID_RESERVA1 = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TB_PAGAMENTOS", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TB_PAGAMENTOS_TB_RESERVAS_ID_RESERVA1",
                        column: x => x.ID_RESERVA1,
                        principalTable: "TB_RESERVAS",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TB_VIAGANTES",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NOME = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DOCUMENTO = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PASSAPORTE = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ID_RESERVA = table.Column<int>(type: "int", nullable: false),
                    ID_RESERVA1 = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TB_VIAGANTES", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TB_VIAGANTES_TB_RESERVAS_ID_RESERVA1",
                        column: x => x.ID_RESERVA1,
                        principalTable: "TB_RESERVAS",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ImagensPacote_PacoteId",
                table: "ImagensPacote",
                column: "PacoteId");

            migrationBuilder.CreateIndex(
                name: "IX_TB_AVALIACOES_ID_RESERVA1",
                table: "TB_AVALIACOES",
                column: "ID_RESERVA1");

            migrationBuilder.CreateIndex(
                name: "IX_TB_DOCUMENTOS_USUARIO_ID1",
                table: "TB_DOCUMENTOS",
                column: "USUARIO_ID1");

            migrationBuilder.CreateIndex(
                name: "IX_TB_MIDIAS_PACOTE_ID1",
                table: "TB_MIDIAS",
                column: "PACOTE_ID1");

            migrationBuilder.CreateIndex(
                name: "IX_TB_PACOTES_PromocaoId",
                table: "TB_PACOTES",
                column: "PromocaoId");

            migrationBuilder.CreateIndex(
                name: "IX_TB_PAGAMENTOS_ID_RESERVA1",
                table: "TB_PAGAMENTOS",
                column: "ID_RESERVA1");

            migrationBuilder.CreateIndex(
                name: "IX_TB_RESERVAS_PACOTE_ID1",
                table: "TB_RESERVAS",
                column: "PACOTE_ID1");

            migrationBuilder.CreateIndex(
                name: "IX_TB_RESERVAS_USUARIO_ID",
                table: "TB_RESERVAS",
                column: "USUARIO_ID");

            migrationBuilder.CreateIndex(
                name: "IX_TB_USUARIOS_TIPO_USUARIO_ID",
                table: "TB_USUARIOS",
                column: "TIPO_USUARIO_ID");

            migrationBuilder.CreateIndex(
                name: "IX_TB_VIAGANTES_ID_RESERVA1",
                table: "TB_VIAGANTES",
                column: "ID_RESERVA1");

            migrationBuilder.CreateIndex(
                name: "IX_VideosPacote_PacoteId",
                table: "VideosPacote",
                column: "PacoteId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ImagensPacote");

            migrationBuilder.DropTable(
                name: "TB_AVALIACOES");

            migrationBuilder.DropTable(
                name: "TB_DOCUMENTOS");

            migrationBuilder.DropTable(
                name: "TB_MIDIAS");

            migrationBuilder.DropTable(
                name: "TB_PAGAMENTOS");

            migrationBuilder.DropTable(
                name: "TB_VIAGANTES");

            migrationBuilder.DropTable(
                name: "VideosPacote");

            migrationBuilder.DropTable(
                name: "TB_RESERVAS");

            migrationBuilder.DropTable(
                name: "TB_PACOTES");

            migrationBuilder.DropTable(
                name: "TB_USUARIOS");

            migrationBuilder.DropTable(
                name: "TB_PROMOCOES");

            migrationBuilder.DropTable(
                name: "TB_TIPO_USUARIO");
        }
    }
}
