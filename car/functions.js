function wait2(ms){
	return new Promise((resolve,reject)=>{
		setTimeout(()=> {
			resolve(ms);
		},ms)
	})
}

// чтение данных из json-файла
// variantNum - номер выбранного варианта
function readTextFile(variantNum)
{
	let fs = require('fs');
	let res = fs.readFileSync('resources/app/car/arcVariants.json', 'utf8');
	res = JSON.parse(res);
	let arr = [res[`cashArr${variantNum}`], res[`shadowArr${variantNum}`], res[`searchArr${variantNum}`]];
	return arr;
}

// генерация случайного числа в диапазоне от 0 до 1
function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}

// удаляем предыдущее окрашивание строк
function removeColoredStrings (){
	[].forEach.call(tags.tBodies[0].rows, (elem) => {
		elem.classList.remove("red","green","yellow","grey");
	});
	[].forEach.call(cache.tBodies[0].rows, (elem) => {
		elem.classList.remove("red","green","yellow","grey");
	});
	[].forEach.call(t1.tBodies[0].rows, (elem) => {
		elem.classList.remove("red","green","yellow","grey");
	});
	[].forEach.call(t2.tBodies[0].rows, (elem) => {
		elem.classList.remove("red","green","yellow","grey");
	});
	[].forEach.call(b1.tBodies[0].rows, (elem) => {
		elem.classList.remove("red","green","yellow","grey");
	});
	[].forEach.call(b2.tBodies[0].rows, (elem) => {
		elem.classList.remove("red","green","yellow","grey");
	});
}

// отработка нажатия кнопки "Вперёд"
function nextBtnOnClick() {
	let str = "string " + processor.tBodies[0].rows[pointer].cells[0].innerHTML + "0";
	if (!searchInList(str,t1).length && !searchInList(str,t2).length && !searchInList(str,b1).length && !searchInList(str,b2).length){
		// кэш-промах
		//убираю предыдущее окрашивание
		[].forEach.call(processor.tBodies[0].rows, (elem)=>{
			elem.classList.remove("red","green","yellow","grey");
		});
		removeColoredStrings();
		processor.tBodies[0].rows[pointer].classList.add("red");
		let deletedStr = searchStr(str);
		t1.innerHTML = previousT1_2;
		t2.innerHTML = previousT2_2;
		b1.innerHTML = previousB1_2;
		b2.innerHTML = previousB2_2;
		if(deletedStr){
			deleteString(deletedStr);
		}
		else {
			nextBtn.disabled = true;
			backBtn.disabled = true;
			addBtn.disabled = false;
		}
		if (processor.tBodies[0].rows[pointer-1] != processor.tBodies[0].lastChild){
			pointer++;
		}
		else if (processor.tBodies[0].rows[pointer-1] === processor.tBodies[0].lastChild){
			nextBtn.disabled = true;
			backBtn.disabled = true;
		}
	}
	else if (!pointer) { // первая поисковая строка (1й запрос процессора)
		processor.tBodies[0].rows[pointer].classList.add("grey");
		searchStr(str);
		pointer++;
	}
	else {
		backBtn.disabled = false;

		//убираю предыдущее окрашивание
		[].forEach.call(processor.tBodies[0].rows, (elem)=>{
			elem.classList.remove("red","green","yellow","grey");
		});
		removeColoredStrings();

		if (processor.tBodies[0].rows[pointer] === processor.tBodies[0].lastChild) { // последняя поисковая строка 
			processor.tBodies[0].rows[pointer].classList.add("grey");
			searchStr(str);
			nextBtn.disabled = true;
			backBtn.disabled = true;
		}
		else {
			processor.tBodies[0].rows[pointer].classList.add("grey");
			res = searchStr(str);
			pointer++;
		}
	}
}

// сохраняем промежуточное состояние таблиц
function saveTablesState() {
	previousT1_2 = previousT1_1;
	previousT2_2 = previousT2_1;
	previousB1_2 = previousB1_1;
	previousB2_2 = previousB2_1;
	previousProcessor_2 = previousProcessor_1;
	previousTags_2 = previousTags_1;
	previousCache_2 = previousCache_1;

	previousT1_1 = t1.innerHTML;
	previousT2_1 = t2.innerHTML;
	previousB1_1 = b1.innerHTML;
	previousB2_1 = b2.innerHTML;
	previousProcessor_1 = processor.innerHTML;
	previousTags_1 = tags.innerHTML;
	previousCache_1 = cache.innerHTML;
}

// ищем строку в таблице (списке)
// data - искомые данные
// list - список, в котором ищем
function searchInList(data,list) {
	let result = [];
	for (let i = 0; i < list.tBodies[0].rows.length; i++) {
		if(data === list.tBodies[0].rows[i].cells[0].innerHTML) {
			result = [list, i, 0, list.tBodies[0].rows[i].cells[0]];
			// 1й аргумент - элемент-таблица
			// 2й аргумент - номер строки
			// 3й аргумент - номер столбца
			// 4й аргумент - элемент-ячейка
		}
	}
	return result;	
}

//обновляем таблицу "Память тегов"
function updateTags() {
	while(tags.tBodies[0].rows.length){
		tags.tBodies[0].deleteRow(0);
	}
	let size = t1.tBodies[0].rows.length + t2.tBodies[0].rows.length;
	for (let i = 0; i < size; i++){
		let row = tags.tBodies[0].insertRow();
		row.insertCell(0);
		row.insertCell(1).innerHTML = i;
	}
	let x = t1.tBodies[0].rows.length;
	for (let i = 0; i < t1.tBodies[0].rows.length; i++) {
		let text = t1.tBodies[0].rows[i].cells[0].innerHTML.substr(7,3);
		tags.tBodies[0].rows[i].cells[0].innerHTML = text;
	}
	for (let i = 0; i < t2.tBodies[0].rows.length; i++){
		let text = t2.tBodies[0].rows[i].cells[0].innerHTML.substr(7,3);
		tags.tBodies[0].rows[x].cells[0].innerHTML = text;
		x++;
	}
};

//обновляем таблицу "Кэш-память"
function updateCache() {
	while(cache.tBodies[0].rows.length){
		cache.tBodies[0].deleteRow(0);
	}
	let size = t1.tBodies[0].rows.length + t2.tBodies[0].rows.length;
	for (let i = 0; i < size; i++){
		let row = cache.tBodies[0].insertRow();
		row.insertCell(0).innerHTML = i;
		row.insertCell(1);
		row.insertCell(2);
		row.insertCell(3);
	}
	let x = t1.tBodies[0].rows.length;
	for (let i = 0; i < t1.tBodies[0].rows.length; i++) {
		let text = t1.tBodies[0].rows[i].cells[0].innerHTML;
		cache.tBodies[0].rows[i].cells[1].innerHTML = randomInteger(0,1);
		cache.tBodies[0].rows[i].cells[2].innerHTML = randomInteger(0,1);
		cache.tBodies[0].rows[i].cells[3].innerHTML = text;
	}
	for (let i = 0; i < t2.tBodies[0].rows.length; i++){
		let text = t2.tBodies[0].rows[i].cells[0].innerHTML;
		cache.tBodies[0].rows[x].cells[1].innerHTML = randomInteger(0,1);
		cache.tBodies[0].rows[x].cells[2].innerHTML = randomInteger(0,1);
		cache.tBodies[0].rows[x].cells[3].innerHTML = text;
		x++;
	}
}

// окрашиваем строки в таблицах при кэш-попадании
// color - цвет, в который окрашиваем
// data - данные, по которым находим строки, требующие окрашивания
function colorCacheHit(color, data) {
	// обновляем таблицы "Память тегов" и "Кэш-память"
	updateTags();
	updateCache();
	//окрашиваем "Память тегов"
	for (let i = 0; i < tags.tBodies[0].rows.length; i++) {
		if (tags.tBodies[0].rows[i].cells[0].innerHTML === data.substr(7,3)){
			if (color !== "red"){
				tags.tBodies[0].rows[i].classList.add(color);
			}
		}
	}
	//окрашиваем "Кэш-память"
	for (let i = 0; i < cache.tBodies[0].rows.length; i++) {
		if (cache.tBodies[0].rows[i].cells[3].innerHTML == data){
			if (color !== "red"){
				cache.tBodies[0].rows[i].classList.add(color);
			}
		}
	}
}

// кэш-промах
function deleteString(str){
	console.log("delete string", str);
	document.getElementById("option1").disabled = false;
    document.getElementById("option2").disabled = false;

	nextBtn.disabled = true;
	backBtn.disabled = true;

	[].forEach.call(t1.tBodies[0].rows, (elem) => {
		if(elem.cells[0].innerHTML == str){
			elem.classList.add("red");
		}
	});

	[].forEach.call(t2.tBodies[0].rows, (elem) => {
		if(elem.cells[0].innerHTML == str){
			elem.classList.add("red");
		}
	});

	[].forEach.call(b1.tBodies[0].rows, (elem) => {
		if(elem.cells[0].innerHTML == str){
			elem.classList.add("red");
		}
	});

	[].forEach.call(b2.tBodies[0].rows, (elem) => {
		if(elem.cells[0].innerHTML == str){
			elem.classList.add("red");
		}
	});

	[].forEach.call(tags.tBodies[0].rows, (elem) => {
		if(elem.cells[0].innerHTML == str.substr(7,3)){
			elem.classList.add("red");
		}
	});

	[].forEach.call(cache.tBodies[0].rows, (elem) => {
		if(elem.cells[3].innerHTML == str){
			elem.classList.add("red");
			valid_dirty = elem.cells[1].innerHTML * elem.cells[2].innerHTML;
			// 1 - с сохранением в ОП
			// 0 - без сохранения в ОП
		}
	});
}

// обработка нажатия кнопки "Назад"
function backBtnOnClick() {
	t1.innerHTML = previousT1_2;
	t2.innerHTML = previousT2_2;
	b1.innerHTML = previousB1_2;
	b2.innerHTML = previousB2_2;
	processor.innerHTML = previousProcessor_2;
	tags.innerHTML = previousTags_2;
	cache.innerHTML = previousCache_2;

	if (processor.tBodies[0].rows[pointer] !== processor.tBodies[0].lastChild) {
		pointer = pointer - 2;
	}
	else {
		pointer--;
	}

	//убираю предыдущее окрашивание
	[].forEach.call(processor.tBodies[0].rows, (elem)=>{
		elem.classList.remove("red","green","yellow","grey");
	});
	nextBtnOnClick();
	backBtn.disabled = true;
}

function addBtnOnClick(){
	let str = "string " + processor.tBodies[0].rows[pointer-1].cells[0].innerHTML + "0";
	searchStr(str);
	updateTags();
	updateCache();
	removeColoredStrings();

	nextBtn.disabled = false;
	backBtn.disabled = false;
	this.disabled = true;
}

// обработка нажатия кнопки "Удалить строку"
function deleteBtnOnClick(){
	let str = "string " + processor.tBodies[0].rows[pointer-1].cells[0].innerHTML + "0";

	// miss(data);
	// cacheMiss();
	searchStr(str);
	updateTags();
	updateCache();
	removeColoredStrings();

	for (let i = 0; i < tags.tBodies[0].rows.length; i++) {
		if (tags.tBodies[0].rows[i].cells[0].innerHTML == str.substr(7,3)){
			tags.tBodies[0].rows[i].classList.add("green");
		}
	}
	for (let i = 0; i < cache.tBodies[0].rows.length; i++) {
		if (cache.tBodies[0].rows[i].cells[3].innerHTML == str){
			cache.tBodies[0].rows[i].classList.add("green");
		}
	}

	nextBtn.disabled = false;
	backBtn.disabled = false;
	this.disabled = true;

    document.getElementById("option1").checked = false;
    document.getElementById("option2").checked = false;

    document.getElementById("option1").disabled = true;
    document.getElementById("option2").disabled = true;
}

// пересортировка L1,L2 при кэш-промахе
function miss(arr){
	let l1Size = t1.tBodies[0].rows.length + b1.tBodies[0].rows.length;
	let l2Size = t2.tBodies[0].rows.length + b2.tBodies[0].rows.length;
	let t1Size = t1.tBodies[0].rows.length;

	if (l1Size === c) {
		if(t1Size < c) {
			b1.tBodies[0].removeChild(b1.tBodies[0].lastChild); 
			replace(arr,p);
		}
		else {
			t1.tBodies[0].removeChild(t1.tBodies[0].lastChild);
		}
	}
	else if ((l1Size < c) && ((l1Size + l2Size) >= c)) {
		if((l1Size + l2Size) === 2*c) {
			b2.tBodies[0].removeChild(b2.tBodies[0].lastChild); 
			replace(arr,p); 
		}
	}
	let tr = document.createElement("tr");
    tr.innerHTML = `<td>${arr}</td>`;
	t1.tBodies[0].prepend(tr);
	return "red";
}

// выбрана опция "с сохранением в ОП"
function option1 (){
	if(valid_dirty == 1) {
		deleteBtn.disabled = false;
	}
}

// выбрана опция "без сохранения в ОП"
function option2 (){
	if(valid_dirty == 0) {
		deleteBtn.disabled = false;
	}
}

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
				comments.innerHTML = comments.innerHTML + "Перемещаем верхнюю строку T1 на MRU позицию в В1.\n\n";
				deletedPage = t1.tBodies[0].firstChild.cells[0].innerHTML;
				let environment = b1.tBodies[0];
				let lastPlace = t1.tBodies[0].rows[0];
				let newPlace = b1.tBodies[0].firstChild;
				environment.insertBefore(lastPlace, newPlace);
			}
			else {
				comments.innerHTML = comments.innerHTML + "Сбрасываем page reference bit верхней строки T1, перемещаем строку в конец T2.\n\n";
				t1.tBodies[0].rows[0].cells[1].innerHTML = 0;
				t2.tBodies[0].appendChild(t1.tBodies[0].rows[0]);
				t1.tBodies[0].removeChild(t1.tBodies[0].firstChild);
			}
		}
		else {
			if(t2.tBodies[0].rows[0].cells[1].innerHTML == 0) {
				found = 1;
				deletedPage = t2.tBodies[0].firstChild.cells[0].innerHTML;
				comments.innerHTML = comments.innerHTML + "Перемещаем верхнюю строку T2 в конец B2.\n\n";
				let environment = b2.tBodies[0];
				let lastPlace = t2.tBodies[0].rows[0];
				let newPlace = b2.tBodies[0].firstChild;
				environment.insertBefore(lastPlace, newPlace);
			}
			else {
				comments.innerHTML = comments.innerHTML + "Сбрасываем page reference bit верхней строки T2 и перемещаем ее в конец T2.\n\n";
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
		comments.innerHTML = "Устанавливаем page refernece bit искомой строки равным 1"; 
		if (searchT1.length) {
			searchT1[0].tBodies[0].rows[searchT1[1]].classList.add("greenText");
			nextBtn.disabled = true;
			backBtn.disabled = true;
			wait2(1000).then(function(){
				searchT1[0].tBodies[0].rows[searchT1[1]].classList.remove("greenText");
				searchT1[0].tBodies[0].rows[searchT1[1]].cells[1].innerHTML = 1;
				nextBtn.disabled = false;
				backBtn.disabled = false;
			});
		}
		if (searchT2.length) {
			searchT2[0].tBodies[0].rows[searchT2[1]].classList.add("greenText");
			nextBtn.disabled = true;
			backBtn.disabled = true;
			wait2(1000).then(function(){
				searchT2[0].tBodies[0].rows[searchT2[1]].classList.remove("greenText");
				searchT2[0].tBodies[0].rows[searchT2[1]].cells[1].innerHTML = 1;
				nextBtn.disabled = false;
				backBtn.disabled = false;
			});
		}
		colorCacheHit("green", str);
	}
	else { 
		comments.innerHTML = "";
		if(t1.tBodies[0].rows.length + t2.tBodies[0].rows.length === c){ 
			result = replace(); 
			if((!searchB1.length && !searchB2.length) && (t1.tBodies[0].rows.length + b1.tBodies[0].rows.length == c)){
				comments.innerHTML = comments.innerHTML + "Удаляем LRU из B1.\n\n";
				b1.tBodies[0].removeChild(b1.tBodies[0].lastChild);
			}
			else if((t1.tBodies[0].rows.length + t2.tBodies[0].rows.length + b1.tBodies[0].rows.length + b2.tBodies[0].rows.length == 2*c) && (!searchB1.length && !searchB2.length)){
				comments.innerHTML = comments.innerHTML + "Удаляем LRU из B2.\n\n";
				b2.tBodies[0].removeChild(b2.tBodies[0].lastChild); 
			}
		}
		if(!searchB1.length && !searchB2.length){ // cache directory miss
			comments.innerHTML = comments.innerHTML + "Заносим искомую строку в конец T1 с нулевым page reference bit.\n";
			let tr = t1.tBodies[0].rows[0].cloneNode(true);
			tr.innerHTML = `<td>${str}</td><td>0</td>`;
			t1.tBodies[0].appendChild(tr);
		}
		else if (searchB1.length) {
			// Adapt: Increase the target size for the list T1 as: p = min {p + max{1, |B2|/|B1|}, c}
			comments.innerHTML = comments.innerHTML + "Изменяем параметр р.";
			p = Math.min(p + Math.max(1, b2.tBodies[0].rows.length/b1.tBodies[0].rows.length), c);
			parameter.innerHTML = p;
			// Move x at the tail of T2. Set the page reference bit of x to 0
			comments.innerHTML = comments.innerHTML + "Перемещаем искомую строку в конец T2 с нулевым page reference bit.\n\n";
			let tr = t1.tBodies[0].rows[0].cloneNode(true);
			tr.innerHTML = `<td>${str}</td><td>0</td>`;
			t2.tBodies[0].appendChild(tr);
			colorCacheHit("yellow", str);

			[].forEach.call(b1.tBodies[0].rows, (elem) => {
				if(elem.cells[0].innerHTML == str){
					elem.parentNode.removeChild(elem);
				}
			});
		}
		//cache directory hit
		else { // x must be in B2
			// Adapt: Decrease the target size for the list T1 as: p = max {p − max{1, |B1|/|B2|}, 0}
			comments.innerHTML = comments.innerHTML + "Изменяем параметр р.";
			p = Math.max(p - Math.max(1, b1.tBodies[0].rows.length/b2.tBodies[0].rows.length), 0);
			parameter.innerHTML = p;
			// Move x at the tail of T2. Set the page reference bit of x to 0
			comments.innerHTML = comments.innerHTML + "Перемещаем искомую строку в конец T2 с нулевым page reference bit.\n\n";
			let tr = t1.tBodies[0].rows[0].cloneNode(true);
			tr.innerHTML = `<td>${str}</td><td>0</td>`;
			t2.tBodies[0].appendChild(tr);
			colorCacheHit("yellow", str);

			[].forEach.call(b2.tBodies[0].rows, (elem) => {
				if(elem.cells[0].innerHTML == str){
					elem.parentNode.removeChild(elem);
				}
			});
		}
	}
	return result;
}