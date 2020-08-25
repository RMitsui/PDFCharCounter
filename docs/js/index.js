var pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/pdfjs/build/pdf.worker.js';

var pdftext = document.getElementById("pdftext");
var charcount = document.getElementById("charcount");
var wordcount = document.getElementById("wordcount");
var text = "";

async function showPDFDData() {
    charcount.innerText = "文字数： " + pdftext.value.length;
    wordcount.innerText = "単語数： " + pdftext.value.split(" ").length;
}

function getPageText(pageNum, pdf) {
    return new Promise(function (resolve, reject) {
        pdf.getPage(pageNum).then(function (pdfPage) {
            pdfPage.getTextContent().then(function (textContent) {
                var textItems = textContent.items;
                var finalString = "";
                for (var i=0; i<textItems.length; i++){
                    var item = textItems[i];
                    if(item.str[item.str.length-1] != "-"){
                        finalString += item.str + " ";
                    }else{
                        finalString += item.str.slice(0,-1);
                    }
                    
                }
                resolve(finalString);
            });
        });
    });
}

async function scanPDF(file) {
    pdftext.value = "";
    var fileReader = new FileReader();
    fileReader.onload = async function() {
        var typedarray = new Uint8Array(this.result);
        //console.log('scanPDF()');
        var pdf = await pdfjsLib.getDocument(typedarray).promise;
        //console.log('PDF loaded');
        for (var pageNumber=1;pageNumber <= pdf.numPages; pageNumber++){
                var textPage = await getPageText(pageNumber, pdf);
                pdftext.value += "\n\n==========Page" + pageNumber + "==========\n";
                pdftext.value += textPage;
        }
        text = pdftext.value;
        await showPDFDData();
    }
    fileReader.readAsArrayBuffer(file);
    
}

let dropZone = document.getElementById('dropzone');
dropZone.addEventListener('dragover', function(event){
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
});

dropZone.addEventListener('drop', function(){
    event.preventDefault();
    var files = event.dataTransfer.files;
    if(files.length > 1) return alert('複数のファイルが選択されています．');
    scanPDF(files[0]);
});

let fileInput = document.getElementById('file');
fileInput.onchange = function(event) {
    var file = event.target.files[0];
    scanPDF(file);
}

let deleteSpace = document.getElementById('deletespace');
deleteSpace.onchange = function(event) {
    if(deleteSpace.checked){
        text = pdftext.value;
        pdftext.value = text.replace(/\s/g,"");
        
    }else{
        pdftext.value = text;
    }
    showPDFDData();

}

