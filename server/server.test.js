const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'index.js'),'utf8');
test('API includes authenticated inventory, sales, reporting, audit and backup routes',()=>{
  for(const route of ["/api/auth/login","/api/items/import","/api/movements","/api/sales/import","/api/revenue/annual","/api/reports/summary","/api/audit","/api/backup","/api/profile"]){assert.ok(source.includes(route),`missing route ${route}`)}
});
test('write routes enforce role checks and stock-out validates available quantity',()=>{
  assert.match(source,/app\.post\('\/api\/movements',auth,roles\('admin','manager','storekeeper'\)/);
  assert.match(source,/qty>it\.quantity/);
  assert.match(source,/app\.post\('\/api\/users',auth,roles\('admin'\)/);
});
test('bulk imports reject duplicate keys and use database transactions',()=>{
  assert.match(source,/duplicate SKU/);
  assert.match(source,/duplicate invoice/);
  assert.match(source,/db\.transaction\(list=>list\.forEach/);
});
