const fs = require('fs');

async function verify() {
  const envContent = fs.readFileSync('C:/All/Me/2027/work/Shopify/tomato-raccoon/.env.local', 'utf-8');
  const match = envContent.match(/PRINTIFY_API_TOKEN=(.*)/);
  const token = match ? match[1].trim() : null;

  console.log('Testing Printify API with Token (length: ' + (token ? token.length : 0) + ')...');

  try {
    const res = await fetch('https://api.printify.com/v1/shops.json', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('API_FAILED:', res.status, err);
      return;
    }

    const shops = await res.json();
    console.log('API_SUCCESS! Your connected shops:', JSON.stringify(shops, null, 2));

    if (shops.length > 0) {
      const shopId = shops[0].id;
      console.log('Primary Shop ID:', shopId, 'Title:', shops[0].title);
      
      const prodRes = await fetch(`https://api.printify.com/v1/shops/${shopId}/products.json`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        console.log('Total products in Printify shop:', prodData.total);
        console.log('Products List:', JSON.stringify(prodData.data.map(p => ({ id: p.id, title: p.title })), null, 2));
      }
    }
  } catch (e) {
    console.error('ERROR:', e.message);
  }
}

verify();
