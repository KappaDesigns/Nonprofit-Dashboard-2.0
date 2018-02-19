function parseHTML(data) {
	let file = data.fileData;
	file = file.replace(/\n+/g, '');
	file = file.replace(/\t+/g, '');
	let tags = file.split('<');
	for (let i = 0; i < tags.length; i++) {
		let tag = tags[i];
		if (tag.includes('>')) {
			let mergeTags = tag.split('>');
			try {
				tags[i] = createNode(mergeTags[0].trim(), false);
			} catch(e) {
				console.log(0);
				console.error(e);
			}
			if (mergeTags[1].trim() != '') {
				try {
					let textNode = createNode('[TextNode]' + mergeTags[1].trim(), true);
					tags.splice(i + 1, 0, textNode);
					i++;
				} catch(e) {
					console.log(1);
					console.error(e);
				}
			}
		} else {
			try {
				tags[i] = createNode(tag.trim(), false);
			} catch(e) {
				console.log(2);
				console.error(e);
			}
			if (tags[i].length == 0) {
				tags.splice(i, 1);
			}
		}
	}
	console.log(tags);
	// return readHTML(tags);
}

function createNode(element, isText) {
	let isSelfClosing = false;
	let isClosing = false;

	// handle closing
	if (element[0] == '/') {
		isClosing = true;
		element = element.substring(1);
	}

	// handle self closing
	if (element[element.length - 1] == '/') {
		isSelfClosing = true;
		isClosing = true;
		element = element.substring(element.length - 1 , element.length);
	}

	// handle text nodes
	if (element.startsWith('[TextNode]')) {
		element = element.replace('[TextNode]', '');
		return {
			tag: '',
			attributes: [],
			isText: isText,
			isSelfClosing: isSelfClosing,
			isClosing: isClosing,
			text: element,
		};
	}

	// gets element tag
	let tag = '';
	for (let i = 0; i < element.length; i++) {
		if (element[i] != ' ') {
			tag += element[i];
		} else {
			element = element.substring(i);
			break;
		}
	}

	// parse element attributes
	// /[\s="]+/g
	//TODO: find element getting into attribute string bug
	//TODO: implement attribute mapping
	let attributes = element.split(' ');

	return {
		tag: tag,
		attributes: attributes,
		isText: isText,
		isSelfClosing: isSelfClosing,
		isClosing: isClosing,
		text: '',
	};
}

function readHTML(tags) {
	let cursor = 0;
	const EOS = tags.length - 1;
	let root = [];
	while (cursor < EOS) {
		let node = readNode(tags, cursor);
		root.push(node);
	}
	return root;
}

function readChildren(tags, root, cursor) {
	
}

function readNode(tags, cursor) {
	let node = {};
	let start = tags[cursor];

}

module.exports = parseHTML;