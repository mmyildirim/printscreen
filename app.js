const axios = require("axios");
const fs = require("fs");

let requestCount = 0;
let idCounter = 1; // ID sayacı

async function fetchLightshotAPI() {
  const url = "https://lightshotlows.vercel.app/_api/lightshot";

  try {
    const response = await axios.get(url);

    if (response.data && response.data.url) {
      console.log(`Image found! URL: ${response.data.url}`);
      saveToJson(response.data.url, response.data.link); // URL ve link ile kaydet
    } else {
      console.log("No valid image URL found.");
    }
  } catch (error) {
    console.error(`Error fetching ${url}: ${error.message}`);
  } finally {
    requestCount++;
    console.log(`Total requests made: ${requestCount}`);
  }
}

function saveToJson(imageUrl, link) {
  const outputFile = "results.json";

  if (!fs.existsSync(outputFile)) {
    fs.writeFileSync(outputFile, JSON.stringify([]));
  }

  const data = JSON.parse(fs.readFileSync(outputFile, "utf8"));

  // ID ve link ile birlikte kaydet
  data.push({
    id: idCounter++,
    imageUrl,
    link,
    timestamp: new Date().toISOString(),
  });

  fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
}

setInterval(fetchLightshotAPI, 1);
// const { chromium } = require("playwright");
// const fs = require("fs");
// const path = require("path");

// async function downloadScreenshotImages() {
//   const proxy = "socks5://127.0.0.1:9050"; // Tor Proxy
//   const browser = await chromium.launch({
//     headless: true,
//     args: [`--proxy-server=${proxy}`],
//   });

//   const context = await browser.newContext();
//   const page = await context.newPage();

//   const resultsFile = "results.json";
//   const outputDir = "images";

//   // Eğer results.json dosyası yoksa hata ver
//   if (!fs.existsSync(resultsFile)) {
//     console.error("results.json dosyası bulunamadı!");
//     return;
//   }

//   // Eğer images klasörü yoksa oluştur
//   if (!fs.existsSync(outputDir)) {
//     fs.mkdirSync(outputDir);
//   }

//   // JSON dosyasını oku
//   const data = JSON.parse(fs.readFileSync(resultsFile, "utf8"));

//   for (const { imageUrl } of data) {
//     const id = imageUrl.split("https://prnt.sc/")[1];
//     try {
//       console.log(`Visiting: ${imageUrl}`);
//       await page.goto(imageUrl, {
//         waitUntil: "domcontentloaded",
//         timeout: 60000,
//       });

//       // screenshot-image sınıfına sahip <img> öğesinin src'sini al
//       const imgSrc = await page.$eval(".screenshot-image", (img) => img.src);

//       if (imgSrc && imgSrc.endsWith(".png")) {
//         console.log(`Downloading image: ${imgSrc}`);

//         // Görseli indir ve dosyaya kaydet
//         const imageResponse = await page.goto(imgSrc);
//         const imageBuffer = await imageResponse.body();
//         const fileName = path.join(outputDir, `${id}.png`);
//         fs.writeFileSync(fileName, imageBuffer);

//         console.log(`Image saved as: ${fileName}`);
//       } else {
//         console.log(`No valid PNG image found for ID: ${id}`);
//       }
//     } catch (error) {
//       console.error(`Error processing ${imageUrl}: ${error.message}`);
//     }
//   }

//   await browser.close();
// }

// downloadScreenshotImages();
// const fs = require("fs");

// // JSON dosyasını oku
// const jsonFile = "results.json";
// const data = JSON.parse(fs.readFileSync(jsonFile, "utf8"));

// // timestamp alanlarını sil
// const cleanedData = data.map((item) => ({
//   imageUrl: item.imageUrl,
// }));

// // Yeni JSON'u kaydet
// fs.writeFileSync(jsonFile, JSON.stringify(cleanedData, null, 2));

// console.log("Timestamps temizlendi");
