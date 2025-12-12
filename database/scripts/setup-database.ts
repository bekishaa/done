#!/usr/bin/env tsx

import { execSync } from 'child_process';
import { existsSync, writeFileSync } from 'fs';
import path from 'path';

console.log('🚀 Setting up database for Receipt Rocket...\n');

const schemaPath = path.join('database', 'schema.prisma');
const envPath = path.join(process.cwd(), '.env');
const envLocalPath = path.join(process.cwd(), '.env.local');

if (!existsSync(envPath) && !existsSync(envLocalPath)) {
  console.log('📝 Creating environment file...');
  const envContent = `# Database
#DATABASE_URL="mysql://username:password@localhost:3306/receiptrocket"
DATABASE_URL="mysql://appsgiho_go_user:Gihon_60908@localhost/appsgiho_go?socketPath=/var/lib/mysql/mysql.sock"
# Next.js
NEXTAUTH_SECRET="your-secret-key-here-$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"

# SMS Service (Optional - for production)
SMS_API_KEY="your-sms-api-key"
SMS_BASE_URL="https://api.sms-provider.com"

# Google AI (for ticket generation)
GOOGLE_AI_API_KEY="your-google-ai-api-key"
`;

  try {
    writeFileSync(envLocalPath, envContent);
    console.log('✅ Environment file created at .env.local');
  } catch (error) {
    console.log('⚠️  Please create .env.local manually with the following content:');
    console.log(envContent);
  }
} else {
  console.log('✅ Environment file already exists');
}

const schemaArg = `--schema "${schemaPath.replace(/\\/g, '/')}"`;

const run = (label: string, command: string) => {
  console.log(label);
  execSync(command, { stdio: 'inherit' });
};

try {
  run('\n🔧 Generating Prisma client...', `npx prisma generate ${schemaArg}`);
  console.log('✅ Prisma client generated');
} catch (error) {
  console.error('❌ Failed to generate Prisma client:', error);
  process.exit(1);
}

try {
  run('\n📊 Creating database...', `npx prisma db push ${schemaArg}`);
  console.log('✅ Database schema created');
} catch (error) {
  console.error('❌ Failed to create database:', error);
  process.exit(1);
}

try {
  run('\n🌱 Seeding database...', 'npm run db:seed');
  console.log('✅ Database seeded with initial data');
} catch (error) {
  console.error('❌ Failed to seed database:', error);
  process.exit(1);
}

console.log('\n🎉 Database setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Update your .env.local file with your actual API keys');
console.log('2. Run "npm run dev" to start the development server');
console.log('3. Run "npm run db:studio" to open Prisma Studio');
console.log('\n🔑 Default login credentials:');
console.log('Super Admin: superadmin@test.com / password123');
console.log('Admin: admin@test.com / password123');
console.log('Sales: sales@test.com / password123');
console.log('Auditor: auditor@test.com / password123');
console.log('Operation: operation@test.com / password123');

