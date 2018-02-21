const path = require('path');
const fs = require('fs');

const submit = document.getElementById('submit');
const error = document.getElementById('error');
const atlas = document.getElementById('atlas');
const texture = document.getElementById('texture');
const out = document.getElementById('out');

const process = (atlasPath, texturePath, outDir) => {
  const atlas = JSON.parse(fs.readFileSync(atlasPath, 'utf8'));
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const image = new Image();

  image.onload = () => {
    Object.keys(atlas.frames).forEach(key => {
      const frame = atlas.frames[key];
      const name = frame.filename || key;

      canvas.width = frame.sourceSize.w;
      canvas.height = frame.sourceSize.h;

      ctx.drawImage(image, frame.frame.x, frame.frame.y, frame.frame.w, frame.frame.h,
        frame.spriteSourceSize.x, frame.spriteSourceSize.y, frame.frame.w, frame.frame.h);

      const img = canvas.toDataURL();
      const data = img.replace(/^data:image\/\w+;base64,/, "");
      const buf = new Buffer(data, 'base64');
      fs.writeFile(path.resolve(outDir, name), buf, err => err && console.error(err));
    });
  };

  image.src = texturePath;
};

submit.onclick = () => {
  const atlasPath = atlas.files[0] && atlas.files[0].path;
  const texturePath = texture.files[0] && texture.files[0].path;
  const outDir = out.files[0] && out.files[0].path;

  if (!atlasPath || !texturePath || !outDir) {
    error.innerText = 'Fill all fields';
    return;
  }

  process(atlasPath, texturePath, outDir);
};
