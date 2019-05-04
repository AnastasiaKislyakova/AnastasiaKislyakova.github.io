const quote = "http://api.forismatic.com/api/1.0/";

window.onload = function () {
    let canvas = createCanvas();

    let ctx = canvas.getContext("2d");

    document.body.appendChild(canvas);

    setCrossDomainFilter();

    //callback hell
    loadImages(canvas, ctx, function () {
        loadQuote(function (text) {
            writeText(canvas, ctx, text, 80);
            placeButton(canvas);
        })
    })
};

function createCanvas() {
    let canvas = document.createElement('canvas');
    //canvas.id = "CursorLayer";
    canvas.width = screen.width * 0.8;
    canvas.height = screen.height * 0.8;
    return canvas;
}

function loadImages(canvas, ctx, onAllLoaded) {
    const offsetX = canvas.width / 2;
    const offsetY = canvas.height / 2;
    let i = 0;
    let loaded = 0;
    while (i < 4) {
        let image = new Image();
        image.crossOrigin = "anonymous";
        image.src = "https://source.unsplash.com/random?sig=" + 1 + i;
        const currIdx = i;
        image.onload = function () {
            const x = currIdx % 2 * (canvas.width / 2);
            const y = currIdx > 1 ? (canvas.height / 2) : 0;
            console.log(image.width + " " + image.height);
            ctx.drawImage(image, image.width / 8, image.height / 8, offsetX, offsetY, x, y, offsetX, offsetY);

            loaded++;
            if (loaded === 4) {
                onAllLoaded();
            }
        };
        i++;
    }
}

function setCrossDomainFilter() {
    $.ajaxPrefilter(function (options) {
        if (options.crossDomain && $.support.cors) {
            options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
        }
    });
}

function loadQuote(onSuccess) {
    $.ajax({
        type: 'GET',
        url: quote,
        data: {method: 'getQuote', format: 'json', lang: 'ru'},
        dataType: 'json',
        async: true,
        success: [
            function (response) {
                onSuccess(response.quoteText);
            }
        ]
    })
}

function writeText(canvas, ctx, text, lineHeight) {
    ctx.font = "bold 50pt Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "ivory";
    let words = text.split(" ");
    let countWords = words.length;
    let line = "";
    let lines = [];
    let countLines = 0;
    for (let n = 0; n < countWords; n++) {
        let testLine = line + words[n] + " ";
        let testWidth = ctx.measureText(testLine).width;
        if (testWidth > canvas.width * 0.8) {
            lines[countLines] = line;
            countLines++;
            line = words[n] + " ";
        } else {
            line = testLine;
        }
    }
    lines[countLines] = line;

    let i = ~~(lines.length / 2);
    for (var m = 0; m < lines.length / 2; m++) {
        if (m === i) {
            ctx.fillText(lines[m], canvas.width / 2, canvas.height / 2);
        } else {
            ctx.fillText(lines[m], canvas.width / 2, canvas.height / 2 - (lineHeight / 2) * (lines.length - 1 - m * 2));
            ctx.fillText(lines[lines.length - m - 1], canvas.width / 2, canvas.height / 2 + (lineHeight / 2) * (lines.length - 1 - m * 2));
        }
    }
}

function placeButton(canvas) {
    let btn = document.createElement('button');
    btn.appendChild(document.createTextNode("Save"));
    let link = document.createElement('a');
    btn.appendChild(link);
    document.body.appendChild(btn);
    btn.onclick = function () {
        link.download = 'canvas.png';
        link.href = canvas.toDataURL();
        link.click();
    };
}

