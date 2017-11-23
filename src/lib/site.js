/**
 * spec
 * 1. init
 * 	pull repo
 * 	create asset map
 * 		keys: file name
 * 		values: read file function
 * 	start 24 hour dev updater
 * 	
 * 2. force update
 * 	forcefully updates website from the github repo of the true website
 * 
 * 3. updatePage
 * 	takes in the html of an admin panel page
 * 	parse to ignore the data-admin-only attributes
 * 	write to file
 * 	commit changes
 * 
 * 4. publish
 * 	pushes current changes to github
 * 
 * 5. revert
 * 	can revert back to a given commit id
 *  reverts back a commit if no commit id given
 * 	can revert back to previous
 * 
 * 6. createTimer
 * 	pulls repo every 24 hours checking for dev changes by a web team
 * 
 */

const daytime = 1000 * 60 * 60 * 24; //miliseconds in 1 day

async function init() {
	await pullRepo();
	initTimer();
}

function pullRepo() {

}

function updateFile() {

}

function initTimer() {
	setTimeout(function createTimmer() {

	}, daytime);
}