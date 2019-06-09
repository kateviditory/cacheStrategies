// заполнение таблиц начальными данными, считанными из json-файла
function fillTables(){
	for (let i = 0; i < searchArr.length; i++) {
		processor.tBodies[0].innerHTML += `<tr><td>${searchArr[i]}</td><td>${randomInteger(0,15)}</td></tr>`;
	}

	for (let i = 0; i < p; i++) {
		t1.tBodies[0].innerHTML += `<tr><td>string ${cashArr[i]}0</td><td>${randomInteger(0,1)}</td></tr>`;
		t2.tBodies[0].innerHTML += `<tr><td>string ${cashArr[i+8]}0</td><td>${randomInteger(0,1)}</td></tr>`;
		b1.tBodies[0].innerHTML += `<tr><td>string ${shadowArr[i]}0</td><td></td></tr>`;
		b2.tBodies[0].innerHTML += `<tr><td>string ${shadowArr[i+8]}0</td><td></td></tr>`;
	}

	for (let i = 0; i < c; i++) {
		tags.tBodies[0].innerHTML += `<tr><td>${cashArr[i]}</td><td>${i}</td></tr>`
		cache.tBodies[0].innerHTML += `<tr><td>${i}</td><td>${randomInteger(0,1)}</td><td>${randomInteger(0,1)}</td><td>string ${cashArr[i]}0</td></tr>`
	}
}


function replace(){
	let found = 0;
	let deletedPage;
	while(!found){
		if(t1.tBodies[0].rows.length >= Math.max(1, p)){
			if(t1.tBodies[0].rows[0].cells[1].innerHTML == 0){
				found = 1;
				// Demote the head page in T1 and make it the MRU page in B1"
				deletedPage = t1.tBodies[0].firstChild.cells[0].innerHTML;
				let environment = b1.tBodies[0];
				let lastPlace = t1.tBodies[0].rows[0];
				let newPlace = b1.tBodies[0].firstChild;
				environment.insertBefore(lastPlace, newPlace);
			}
			else {
				// Set the page reference bit of head page in T1 to 0, and make it the tail page in T2"
				t1.tBodies[0].rows[0].cells[1].innerHTML = 0;
				t2.tBodies[0].appendChild(t1.tBodies[0].rows[0]);
				t1.tBodies[0].removeChild(t1.tBodies[0].firstChild);
			}
		}
		else {
			if(t2.tBodies[0].rows[0].cells[1].innerHTML == 0) {
				found = 1;
				deletedPage = t2.tBodies[0].firstChild.cells[0].innerHTML;
				// Demote the head page in T2 and make it the MRU page in B2.
				let environment = b2.tBodies[0];
				let lastPlace = t2.tBodies[0].rows[0];
				let newPlace = b2.tBodies[0].firstChild;
				environment.insertBefore(lastPlace, newPlace);
			}
			else {
				// Set the page reference bit of head page in T2 to 0, and make it the tail page in T2.
				t2.tBodies[0].rows[0].cells[1].innerHTML = 0;
				t2.tBodies[0].appendChild(t2.tBodies[0].rows[0]);
				t2.tBodies[0].removeChild(t2.tBodies[0].firstChild);
			}
		}
	}
	return deletedPage;
}

let searchT1, searchT2, searchB1, searchB2;
function searchStr(str){
	let color = "red";
	saveTablesState();
	let result;

	searchT1 = searchInList(str,t1);
	searchT2 = searchInList(str,t2);
	searchB1 = searchInList(str,b1);
	searchB2 = searchInList(str,b2);

	if(searchT1.length || searchT2.length){ // cache hit
		//Set the page reference bit for x to one.
		if (searchT1.length) {
			searchT1[0].tBodies[0].rows[searchT1[1]].cells[1].innerHTML = 1;
		}
		if (searchT2.length) {
			searchT2[0].tBodies[0].rows[searchT2[1]].cells[1].innerHTML = 1;
		}
		colorCacheHit("green", str);
	}
	else { 
		//cache miss
		if(t1.tBodies[0].rows.length + t2.tBodies[0].rows.length === c){ 
			// cache full, replace a page from cache
			result = replace(); 
			// cache directory replacement
			if((!searchB1.length && !searchB2.length) && (t1.tBodies[0].rows.length + b1.tBodies[0].rows.length == c)){
				// Discard the LRU page in B1
				b1.tBodies[0].removeChild(b1.tBodies[0].lastChild.cells[0]);
			}
			else if((t1.tBodies[0].rows.length + t2.tBodies[0].rows.length + b1.tBodies[0].rows.length + b2.tBodies[0].rows.length == 2*c) && (!searchB1.length && !searchB2.length)){
				// Discard the LRU page in B2
				b2.tBodies[0].removeChild(b2.tBodies[0].lastChild); ////////
			}
		}
		if(!searchB1.length && !searchB2.length){ // cache directory miss
			// Insert x at the tail of T1. Set the page reference bit of x to 0.
			let tr = t1.tBodies[0].rows[0].cloneNode(true);
			tr.innerHTML = `<td>${str}</td><td>0</td>`;
			t1.tBodies[0].appendChild(tr);
		}
		else if (searchB1.length) {
			// Adapt: Increase the target size for the list T1 as: p = min {p + max{1, |B2|/|B1|}, c}
			p = Math.min(p + Math.max(1, b2.tBodies[0].rows.length/b1.tBodies[0].rows.length), c);
			// Move x at the tail of T2. Set the page reference bit of x to 0
			let tr = t1.tBodies[0].rows[0].cloneNode(true);
			tr.innerHTML = `<td>${str}</td><td>0</td>`;
			t2.tBodies[0].appendChild(tr);
			colorCacheHit("yellow", str);
		}
		//cache directory hit
		else { // x must be in B2
			// Adapt: Decrease the target size for the list T1 as: p = max {p − max{1, |B1|/|B2|}, 0}
			p = Math.max(p - Math.max(1, b1.tBodies[0].rows.length/b2.tBodies[0].rows.length), 0);
			// Move x at the tail of T2. Set the page reference bit of x to 0
			let tr = t1.tBodies[0].rows[0].cloneNode(true);
			tr.innerHTML = `<td>${str}</td><td>0</td>`;
			t2.tBodies[0].appendChild(tr);
			colorCacheHit("yellow", str);
		}
	}
	return result;
}
