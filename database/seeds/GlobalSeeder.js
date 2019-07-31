'use strict'

const Factory = use('Factory')
const Database = use('Database')
const Hash = use('Hash')

class GlobalSeeder {
  async run () {
    // Center
    await Database.table('centers').insert({
      name: 'Centro de Tecnologia',
      initials: 'CT',
      address: 'Ac. Público, 710 - Pici, Fortaleza - CE, 60020-181',
      campus: 'PICI',
      city: 'Fortaleza',
      website: 'ct.ufc.br',
    });

    // Root user
    await Database.table('users').insert({
      username: 'root',
      email: 'admin@admin.com',
      password: await Hash.make('123456'),
      name: 'Root',
      address: 'address de teste, 123',
      website: 'websiteteste.com',
      type: 'Gerente',
      phone: '(85) 9 9999-9999',
      id_center: 1,
    });
    
    // Categories
    await Database.table('categories').insert([
      { name: 'Eletrônicos' },
      { name: 'Móveis' },
      { name: 'Outros' },
    ]);

    // Subcategories
    await Database.table('subcategories').insert([
      { name: 'Notebooks', category_id:  1},
      { name: 'Computadores', category_id: 1 },
      { name: 'Mesas', category_id: 2 },
      { name: 'Cadeiras', category_id: 2 },
      { name: 'Outros', category_id: 3 }
    ]);

  }
}

module.exports = GlobalSeeder