// Quick script to clear seeded data so the server can re-seed with English data
require('dotenv').config();
const mysql = require('mysql2/promise');

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'campus_recruitment',
  });

  console.log('Connected to database');

  // Disable FK checks
  await conn.execute('SET FOREIGN_KEY_CHECKS = 0');

  // Clear seed data tables
  const tables = [
    'question_bank',
    'question_category',
    'interview_question',
    'interview',
    'post',
    'comment',
    'category',
    'dict_item',
    'dict_type',
    'resume_template',
  ];

  for (const table of tables) {
    try {
      const [rows] = await conn.execute(`SELECT COUNT(*) as cnt FROM \`${table}\``);
      console.log(`  ${table}: ${rows[0].cnt} rows -> TRUNCATING`);
      await conn.execute(`TRUNCATE TABLE \`${table}\``);
    } catch (e) {
      console.log(`  ${table}: skipped (${e.message})`);
    }
  }

  await conn.execute('SET FOREIGN_KEY_CHECKS = 1');
  console.log('Done! All seed data cleared. Start the server to re-seed with English data.');
  await conn.end();
}

main().catch(e => { console.error(e); process.exit(1); });
