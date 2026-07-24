const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  let totalSaved = 0;
  for (const p of products) {
    let modified = false;
    let images = [];
    try {
      images = Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images) : []);
    } catch(e) {
      images = [];
    }

    let newImages = [];
    for (const img of images) {
      if (img.length > 500000) { // If image string is > 500KB
        console.log(`Found huge image on product ${p.name}, size: ${Math.round(img.length / 1024)}KB. Removing it.`);
        modified = true;
        totalSaved += img.length;
        // fallback image
        newImages.push("https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80");
      } else {
        newImages.push(img);
      }
    }

    if (modified) {
      await prisma.product.update({
        where: { id: p.id },
        data: { images: newImages }
      });
      console.log(`Updated product ${p.name}`);
    }
  }
  console.log(`Done. Cleaned up ${Math.round(totalSaved / 1024 / 1024)}MB of data.`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
