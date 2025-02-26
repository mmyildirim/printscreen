const fs = require("fs");
const jsonData = fs.readFileSync("results.json", "utf8");

const htmlTemplate = `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <title>Image Viewer</title>
    <style>
        .container { max-width: 800px; margin: 0 auto; text-align: center; }
        .image-container { margin: 20px 0; }
        img { max-width: 100%; height: auto; }
        .controls { margin: 20px 0; }
        button { padding: 10px 20px; margin: 0 10px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="container">
        <div class="image-container">
            <img id="currentImage" src="" alt="Image">
        </div>
        <div class="controls">
            <button id="prevBtn">Önceki</button>
            <button id="viewBtn">Görüntüle</button>
            <button id="nextBtn">Sonraki</button>
        </div>
        <div>
            <span>ID: </span>
            <span id="currentId">0</span>
            <span> / </span>
            <span id="totalIds">${JSON.parse(jsonData).length}</span>
        </div>
    </div>
    <script>
        const imageData = ${jsonData};
        let currentIndex = 0;

        function updateImage() {
            const currentItem = imageData[currentIndex];
            if (currentItem && currentItem.link) {
                document.getElementById('currentImage').src = currentItem.link;
                document.getElementById('currentId').textContent = currentItem.id;
                localStorage.setItem('lastImageId', currentItem.id);
            }
        }

        function openNextBatch() {
            const batchSize = 1;
            const startIndex = currentIndex;
            const endIndex = Math.min(startIndex + batchSize, imageData.length);

            // Her linki sırayla aç
            for(let i = startIndex; i < endIndex; i++) {
                const item = imageData[i];
                if(item && item.link) {
                    setTimeout(() => {
                        window.open(item.link, '_blank');
                    }, (i - startIndex) * 5); // Her link için 5ms gecikme
                }
            }

            // Son indexi güncelle
            currentIndex = endIndex;
            updateImage();
        }

        const lastId = localStorage.getItem('lastImageId');
        if (lastId) {
            currentIndex = imageData.findIndex(item => item.id === parseInt(lastId));
            if (currentIndex === -1) currentIndex = 0;
        }
        
        updateImage();

        document.getElementById('prevBtn').addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateImage();
            }
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            openNextBatch();
        });

        document.getElementById('viewBtn').addEventListener('click', () => {
            const currentItem = imageData[currentIndex];
            if (currentItem && currentItem.link) {
                window.open(currentItem.link, '_blank');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') document.getElementById('prevBtn').click();
            if (e.key === 'ArrowRight') document.getElementById('nextBtn').click();
        });
    </script>
</body>
</html>
`;

fs.writeFileSync("viewer.html", htmlTemplate);
console.log("viewer.html oluşturuldu!");
