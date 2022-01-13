import fs from 'fs';
import sharp from 'sharp';

function readFiles(dirname, onError) {
  fs.readdir(dirname, function (err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function (filename) {
      if (fs.lstatSync(`${dirname}/${filename}`).isDirectory()) {
        readFiles(`${dirname}/${filename}`, () => {});
        return;
      }
      if (
        fs.lstatSync(`${dirname}/${filename}`).isFile() &&
        !filename.includes('.DS_Store')
      ) {
        (async () => {
          console.log('compressing : ', `${dirname}/${filename}`);
          await sharp(`${dirname}/${filename}`)
            .toFormat('jpeg', { mozjpeg: true })
            .toFile(`${dirname}/optimized_${filename}`);
        })();
      }
    });
  });
}

const DIRECTORY = 'INSERT DIRECTORY HERE';
readFiles(DIRECTORY, (e) => {
  console.log(e);
});
