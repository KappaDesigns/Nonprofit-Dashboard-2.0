const Crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const algo = 'aes192';
const filePath = path.resolve(__dirname, '../config.json');

(async function main() {
	const config = await readConfig();
	const cipher = Crypto.createCipher(algo, config.secret);
	let encrypted = '';

	cipher.on('readable', function handleRead() {
		const data = cipher.read();
		if (data) {
			encrypted += data.toString('hex');
		}
	});

	cipher.on('end', function complete() {
		console.log(encrypted);
	});

	cipher.write(process.argv[2]);
	cipher.end();
})();

async function readConfig() {
	return new Promise(function handlePromise(resolve) {
		fs.readFile(filePath, 'utf-8', function handleRead(err, data) {
			if (err) {
				throw err;
			}
			return resolve(JSON.parse(data));
		});
	});
}