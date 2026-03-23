// ============================================================
//  Script: update-db-imagens.js
//  Atualiza o banco de dados com os novos caminhos locais
//  Execute na VPS após o upload das imagens:
//    node /home/user/isf-site/update-db-imagens.js
// ============================================================

process.env.DATABASE_URL = "file:/home/user/isf-site/prisma/dev.db";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const updates = [
  {
    id: 10,
    image: "/SENSOR-BARREIRA-ATIVO-DUPLO-FEIXE-30MTS-PB-30HD-AJUSTE-A-LASER-DETECTOR-IMP-.jpg",
  },
  {
    id: 14,
    image: "/SENSOR-ATIVO-IVA-7100-HEXA.jpg",
  },
  {
    id: 15,
    image: "/Central-de-cerca-eletrica.jpg",
  },
  {
    id: 16,
    image: "/Modulo-de-choque.jpg",
  },
  {
    id: 17,
    image: "/HASTE-INDUSTRIAL-ALUMINIO-25X25-1.00-MT-6-ISOL-\u2013-CONFISEG.jpg",
  },
  {
    id: 18,
    image: "/CABO-DE-ACO-AF-ALMA-DE-FIBRA-GALVANIZADO-1-16-6X7-100MTS-.jpg",
  },
  {
    id: 22,
    image: "/Controle-remoto-XAC-4000-Smart-control.jpg",
  },
];

async function main() {
  console.log("\n=== Atualizando caminhos de imagens no banco ===\n");

  for (const { id, image } of updates) {
    await prisma.product.update({ where: { id }, data: { image } });
    console.log(`  Produto ID ${id}: ${image}`);
  }

  console.log("\nConcluido! Reinicie o servidor para refletir as mudancas.\n");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
