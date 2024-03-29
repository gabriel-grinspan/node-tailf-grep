const fs = require('fs');

const getFileContent = filepath => {
	return fs.readFileSync(filepath).toString();
};

const sleep = ms => {
	return new Promise(resolve => setTimeout(resolve, ms));
};

const strContains = (str, keywords) => {
	return keywords.some(keyword => str.includes(keyword));
};

const tailF_grep = async (filepath, keywords = [], excludeKeywords = [], callback) => {
	try {
		let fileContent = getFileContent(filepath);
		let charsToTrim = fileContent.length;
		
		const watcher = fs.watch(filepath, async () => {
			try {
				if (fileContent.length > 0) {
					charsToTrim = fileContent.length;
				}
				fileContent = getFileContent(filepath);

				let errorContent = '';
				if (fileContent.length === charsToTrim) {
					// console.log('No new content');
				} else if (fileContent.length > 0 && fileContent.length < charsToTrim) {
					console.log('File truncated');
					charsToTrim = fileContent.length;
					errorContent = fileContent.split('\n').slice(-4).join('\n');
				} else {
					errorContent = fileContent.slice(charsToTrim);
				}

				if (errorContent.length > 0 && (keywords.length === 0 || strContains(errorContent, keywords))
					&& (excludeKeywords.length === 0 || !strContains(errorContent, excludeKeywords))) {
					callback(errorContent);
				}
			} catch (error) {
				watcher.close();
				await sleep(500);
				return await tailF_grep(filepath, keywords, callback);
			}
		});
	} catch (error) {
		await sleep(500);
		return await tailF_grep(filepath, keywords, callback);
	}
};

function Tail(filepath, keywords = [], excludeKeywords = [], callback) {
	this.tail = tailF_grep(filepath, keywords, excludeKeywords, callback);
}

module.exports = Tail;
