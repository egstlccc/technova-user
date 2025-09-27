#!/usr/bin/env node

const { sequelize } = require('./config/database');
const migrateDisputeTables = require('./migrate_dispute_tables');

async function runMigration() {
  try {
    console.log('🚀 Starting database migration...');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // Run dispute tables migration
    await migrateDisputeTables();
    
    console.log('🎉 Migration completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration();