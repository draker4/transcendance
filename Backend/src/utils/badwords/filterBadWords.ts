
// | bad-words package | to custom see https://www.npmjs.com/package/bad-words 

export function filterBadWords(text: string):string {
	var Filter = require('bad-words');
	var filter = new Filter();

	// console.log("text = ", text); //checking
	var cleanText = filter.clean(text);
	// console.log("cleanText = ", cleanText); //checking

	return filter.clean(text);
}