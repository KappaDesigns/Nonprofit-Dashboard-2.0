import { setTimeout } from "timers";

//spec
// 1. init
// 2. 

const daytime = 1000 * 60 * 60 * 24;

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