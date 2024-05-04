async function search() {
    var keyword = document.getElementById('keyword').value.toLowerCase();
    var resultsDiv = document.getElementById('results');
    var progressBar = document.getElementById('progress-bar');
    var files = ["synyx_.gov.br.txt"];
    var results = [];
    var totalFiles = files.length;
    var filesProcessed = 0;
    var maxConcurrency = 30; 
    progressBar.style.width = '4%';
    progressBar.style.backgroundColor = '#fff';

    async function readFile(file) {
        try {
            const response = await fetch('logs/' + file);
            return await response.text();
        } catch (error) {
            console.error("erro no " + file + ": " + error.message);
            return '';
        }
    }

    async function processFiles(files) {
        for (let file of files) {
            try {
                const content = await readFile(file);
                const lines = content.split('\n');
                const foundLines = lines.filter(line => line.toLowerCase().includes(keyword));

                if (foundLines.length > 0) {
                    results.push(...foundLines);
                }

                filesProcessed++;
                progressBar.style.width = (filesProcessed / totalFiles) * 100 + '%';
                if (filesProcessed === totalFiles) {
                    showDownloadButton();
                }
            } catch (error) {
                console.error("erro no processamento do arquivo " + file + ": " + error.message);
            }
        }
    }

    for (let i = 0; i < files.length; i += maxConcurrency) {
        const filesBatch = files.slice(i, i + maxConcurrency);
        await processFiles(filesBatch);
    }

    progressBar.style.width = '100%';
    resultsDiv.innerHTML = results.length > 0 ? results.map(line => '<p>' + line + '</p>').join('<hr>') : "Sem resultados.";
}

function showDownloadButton() {
    var downloadButton = document.getElementById('download-btn');
    downloadButton.style.display = 'block';
}

function downloadResults() {
    var keyword = document.getElementById('keyword').value.toLowerCase();
    var resultsText = document.getElementById('results').innerText;
    var filename = 'synyx_' + keyword + '.txt';

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(resultsText));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}