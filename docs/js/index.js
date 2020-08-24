var pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/pdfjs/build/pdf.worker.js';

function getPageText(pageNum, pdf) {
    return new Promise(function (resolve, reject) {
        pdf.getPage(pageNum).then(function (pdfPage) {
            pdfPage.getTextContent().then(function (textContent) {
                var textItems = textContent.items;
                var finalString = "";
                for (var i=0; i<textItems.length; i++){
                    var item = textItems[i];
                    finalString += item.str + " ";
                }
                resolve(finalString);
            });
        });
    });
}

function scanPDF(file) {
    var fileReader = new FileReader();
    fileReader.onload = function() {
        var typedarray = new Uint8Array(this.result);
        var loadingTask = pdfjsLib.getDocument(typedarray);
        loadingTask.promise.then(pdf => {
            console.log('PDF loaded');
            for (var pageNumber=1;pageNumber <= pdf.numPages; pageNumber++){
                pdf.getPage(pageNumber).then(function(page) {
                    getPageText(pageNumber, pdf).then(function (textPage) {
                        console.log(textPage);
                    });
                });
            }
        });
        fileReader.readAsArrayBuffer(file);
    };
};

let dropZone = document.getElementById('dropzone');
dropZone.addEventListener('dragover', function(event){
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
});

dropZone.addEventListener('drop', function(){
    event.preventDefault();
    var files = event.dataTransfer.files;
    if(files.length > 1) return alert('複数のファイルが選択されています．');
    scanPDF(files);
});

/*
var loadingTask = pdfjsLib.getDocument(url);
loadingTask.promise.then(function(pdf) {
  console.log('PDF loaded');
  
  // Fetch the first page
  var pageNumber = 1;
  pdf.getPage(pageNumber).then(function(page) {
    console.log('Page loaded');
    
    var scale = 1.5;
    var viewport = page.getViewport({scale: scale});

    // Prepare canvas using PDF page dimensions
    var canvas = document.getElementById('the-canvas');
    var context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render PDF page into canvas context
    var renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    var renderTask = page.render(renderContext);
    renderTask.promise.then(function () {
      console.log('Page rendered');
    });

    getPageText(pageNumber, pdf).then(function (textPage) {
        console.log(textPage);
    });
  });
}, function (reason) {
  // PDF loading error
  console.error(reason);
});
*/

