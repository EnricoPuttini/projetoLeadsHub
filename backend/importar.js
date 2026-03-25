require('dotenv').config();
const fs = require('fs');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function importar() {
  const leads = [];
  let linhaExemplo = null;

  console.log("--- Iniciando Leitura do CSV ---");

  // AJUSTE AQUI: coloque o nome exato do seu arquivo
  fs.createReadStream('../db/Lista_2026324235648704.csv')
    .pipe(csv({ separator: ';' })) 
    .on('data', (row) => {
      // Salva a primeira linha para a gente ver se os nomes batem
      if (!linhaExemplo) linhaExemplo = row;

      leads.push({
        cnpj: row.cnpj,
        razaosocial: row.razaoSocial, 
        nomefantasia: row.nomeFantasia,
        dataabertura: row.dataAbertura,
        situacaocadastral: row.situacaoCadastral,
        municipio: row.municipio,
        uf: row.uf,
        telefone_1: row.telefone_1,
        email: row.email,
        opcaomei: row.opcaoMei === 'Sim' ? 'MEI' : 'Outros',
        socios: row.socios,
        cnaeprincipal: row.cnaePrincipal
      });
    })
    .on('end', async () => {
      console.log("Exemplo de dados lidos (Chaves do CSV):", Object.keys(linhaExemplo));
      console.log(`Total de leads preparados: ${leads.length}`);

      if (leads.length === 0) {
        console.error("❌ ERRO: Nenhum dado foi lido. Verifique o separador ';' ou o nome do arquivo.");
        return;
      }

      const { data, error } = await supabase.from('leads').insert(leads);

      if (error) {
        console.error('❌ ERRO NO SUPABASE:', error.message);
        console.error('Detalhes:', error.details);
      } else {
        console.log('✅ SUCESSO! Os 100 leads estão no banco de dados.');
      }
    });
}

importar();