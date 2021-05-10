let img = new Image();
img.src = "/sprites/select.png";
img.onload = function () {
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");

  canvas.width = this.width;
  canvas.height = this.height;

  ctx.drawImage(img, 0, 0);
  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < imgData.data.length; i += 4) {
    // GREEN
    //imgData.data[i + 0] = imgData.data[i + 0] / 1 * 0.2156863;
    //imgData.data[i + 1] = imgData.data[i + 1] / 1 * 0.8509804;
    //imgData.data[i + 2] = imgData.data[i + 2] / 1 * 0.5490196;
    //imgData.data[i + 3] = imgData.data[i + 3] / 1 * 1;
    // PURPLE
    //imgData.data[i + 0] = imgData.data[i + 0] / 1 * 0.5686275;
    //imgData.data[i + 1] = imgData.data[i + 1] / 1 * 0.4745098;
    //imgData.data[i + 2] = imgData.data[i + 2] / 1 * 1;
    //imgData.data[i + 3] = imgData.data[i + 3] / 1 * 1;
    // RED
    //imgData.data[i + 0] = imgData.data[i + 0] / 1 * 0.9882353;
    //imgData.data[i + 1] = imgData.data[i + 1] / 1 * 0.3607843;
    //imgData.data[i + 2] = imgData.data[i + 2] / 1 * 0.3960784;
    //imgData.data[i + 3] = imgData.data[i + 3] / 1 * 1;
    // YELLOW
    //imgData.data[i + 0] = imgData.data[i + 0] / 1 * 1;
    //imgData.data[i + 1] = imgData.data[i + 1] / 1 * 0.7137255;
    //imgData.data[i + 2] = imgData.data[i + 2] / 1 * 0;
    //imgData.data[i + 3] = imgData.data[i + 3] / 1 * 1;
    // GRAY
    //imgData.data[i + 0] = imgData.data[i + 0] / 1 * 0.3113208;
    //imgData.data[i + 1] = imgData.data[i + 1] / 1 * 0.3113208;
    //imgData.data[i + 2] = imgData.data[i + 2] / 1 * 0.3113208;
    //imgData.data[i + 3] = imgData.data[i + 3] / 1 * 1;
  }

  ctx.putImageData(imgData, 0, 0);

  document.write('<img src="' + canvas.toDataURL("image/png") + '"/>');
}