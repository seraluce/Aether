import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

// 构建项目
console.log('开始构建...');
execSync('npm run build', { stdio: 'inherit' });

// 读取并修改 wrangler.json
const wranglerPath = 'dist/server/wrangler.json';
console.log('修复 wrangler.json 配置...');

const config = JSON.parse(readFileSync(wranglerPath, 'utf-8'));

// 删除 assets 配置（Pages 会自动提供 ASSETS binding）
delete config.assets;

// 写回文件
writeFileSync(wranglerPath, JSON.stringify(config, null, 2));

console.log('配置已修复，开始部署...');

// 执行部署
execSync('wrangler pages deploy dist', { stdio: 'inherit' });
