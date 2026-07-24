import { upload } from '@vercel/blob/client';

async function test() {
  try {
    const file = new File(["test"], "Jolagreen23 on TikTok.jpeg", { type: "image/jpeg" });
    
    console.log("Uploading...");
    const result = await upload("Jolagreen23 on TikTok.jpeg", file, {
      access: 'public',
      handleUploadUrl: 'https://www.knitta-corner.shop/api/upload',
      addRandomSuffix: true,
    });
    console.log("Success:", result);
  } catch (error) {
    console.error("Failed:", error.message);
  }
}

test();
