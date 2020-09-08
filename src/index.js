import * as Papa from "papaparse";
import "isomorphic-fetch";

// add the urls of the chat room to here !
// https://docs.google.com/spreadsheets/d/173OIZL1s1u0iD0m3swshseFh-z9tWDx9lPJHWVsROTQ/edit#gid=0

var SHEET_ID = "173OIZL1s1u0iD0m3swshseFh-z9tWDx9lPJHWVsROTQ";
var API_KEY = "AIzaSyADT3iqNAWUl75iqvwuT1yKVN7dlew2EvI";

function fetchSheet({ spreadsheetId, apiKey, complete }) {
    let url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/roomKey/?key=${apiKey}`;
    return fetch(url).then(response => {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }

        response.json().then(result => {
            let data = Papa.parse(Papa.unparse(result.values), {
                header: true
            });
            complete(data);
        });
    });
}

function notIE() {
    var ua = window.navigator.userAgent;
    if (
        ua.indexOf("Edge/") > 0 ||
        ua.indexOf("Trident/") > 0 ||
        ua.indexOf("MSIE ") > 0
    ) {
        return false;
    } else {
        return true;
    }
}

function init() {
    if (!notIE()) {
        console.log("I am ie user");

        let tutorial_section = document.getElementById("tutorial");
        var roomLitutorial_section_child = "";

        roomLitutorial_section_child +=
            '<a class="pulse waves-effect waves-light btn-large tutorial-button" href="https://discussionchat.github.io/#1">튜토리얼 보기</a>';
        roomLitutorial_section_child +=
            '			<a class="grey waves-effect waves-light btn-large discussion-button" href="#anchor">토론방 바로가기</a>';

        tutorial_section.innerHTML(roomLitutorial_section_child);
    }

    fetchSheet({
        spreadsheetId: SHEET_ID,
        apiKey: API_KEY,
        complete: dataArray
    });
}

function dataArray(result) {
    var data = result.data;

    var roomList = document.getElementById("roomList");
    var roomList_child = "";

    for (let i = 0; i < data.length; i++) {
        var a = data[i]["roomURL"];
        var newAdress = a.concat(`&roomName=팀1-${i + 1}`);

        // console.log(newAdress);
        roomList_child += `
		<div class="col s3 ">
					<div class="card card-style">
						<div class="card-content">
							<span class="center card-title">${i + 1}번 방</span>
							<div class="card-action enter-button">
								<a class="btn center white-text "href="${newAdress}">입장하기</a>
							</div>
						</div>
					</div>
				</div>
		`;
    }

    roomList.innerHTML = roomList_child;
}

window.addEventListener("DOMContentLoaded", init);
