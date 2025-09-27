const { sequelize } = require('./config/database');

async function createPasswordResetTokensTable() {
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        token VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL,
        expires_at DATETIME NOT NULL,
        used BOOLEAN NOT NULL DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_token (token),
        INDEX idx_email (email),
        INDEX idx_expires_at (expires_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    
    console.log('✅ Password reset tokens table created successfully');
  } catch (error) {
    console.error('❌ Error creating password reset tokens table:', error);
    throw error;
  }
}

async function migrate() {
  try {
    await createPasswordResetTokensTable();
    console.log('🎉 Password reset tokens migration completed successfully');
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  migrate();
}

module.exports = { createPasswordResetTokensTable };