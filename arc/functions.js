function wait1(ms) {
	let start = Date.now(),
	now = start;
	while(now - start < ms) {
		now = Date.now();
	}
}

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
	let res = fs.readFileSync('resources/app/arc/arcVariants.json', 'utf8');
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

// заполнение таблиц начальными данными, считанными из json-файла
function fillTables(){
	for (let i = 0; i < searchArr.length; i++) {
		processor.tBodies[0].innerHTML += `<tr><td>${searchArr[i]}</td><td>${randomInteger(0,15)}</td></tr>`;
	}

	for (let i = 0; i < p; i++) {
		t1.tBodies[0].innerHTML += `<tr><td>string ${cashArr[i]}0</td></tr>`;
		t2.tBodies[0].innerHTML += `<tr><td>string ${cashArr[i+8]}0</td></tr>`;
		b1.tBodies[0].innerHTML += `<tr><td>string ${shadowArr[i]}0</td></tr>`;
		b2.tBodies[0].innerHTML += `<tr><td>string ${shadowArr[i+8]}0</td></tr>`;
	}

	for (let i = 0; i < c; i++) {
		tags.tBodies[0].innerHTML += `<tr><td>${cashArr[i]}</td><td>${i}</td></tr>`
		cache.tBodies[0].innerHTML += `<tr><td>${i}</td><td>${randomInteger(0,1)}</td><td>${randomInteger(0,1)}</td><td>string ${cashArr[i]}0</td></tr>`
	}
}

// отработка нажатия кнопки "Вперёд"
function nextBtnOnClick() {
	let str = "string " + processor.tBodies[0].rows[pointer].cells[0].innerHTML + "0";
	if (!pointer) { // первая поисковая строка (1й запрос процессора)
		processor.tBodies[0].rows[pointer].classList.add("grey");
		searchString(str);
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
			searchString(str);
			nextBtn.disabled = true;
		}
		else {
			processor.tBodies[0].rows[pointer].classList.add("grey");
			res = searchString(str);
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

// кэш-попадание в T1, пересортировка L1,L2
// arr - данные, по найденной строке
function hitInT1(arr) {
	comments.innerHTML = "Перемещаем искомую строку в начало списка T2";

	let environment = t2.tBodies[0];
	let lastPlace = arr[3].parentNode;
	let newPlace = t2.tBodies[0].firstChild
	lastPlace.classList.add("greenText");
	colorCacheHit("green", arr[3].innerHTML);
	nextBtn.disabled = true;
	backBtn.disabled = true;

	wait2(2000).then(function(){
		removeColoredCacheTags();
		lastPlace.classList.remove("greenText");
		environment.insertBefore(lastPlace, newPlace);
		t2.tBodies[0].firstChild.classList.add("greenText");
		nextBtn.disabled = false;
		backBtn.disabled = false;
		colorCacheHit("green",arr[3].innerHTML);
	})

	return "green";
}

// кэш-попадание в T2, пересортировка L1,L2
// arr - данные, по найденной строке
function hitInT2(arr) {
	comments.innerHTML = "Перемещаем искомую строку в начало списка T2";

	let environment = arr[0].tBodies[0];
	let lastPlace = arr[3].parentNode;
	let newPlace = arr[0].tBodies[0].firstChild;
	lastPlace.classList.add("greenText");
	colorCacheHit("green", arr[3].innerHTML);
	nextBtn.disabled = true;
	backBtn.disabled = true;

	wait2(2000).then(function(){
		removeColoredCacheTags();
		lastPlace.classList.remove("greenText");
		environment.insertBefore(lastPlace, newPlace);
		arr[0].tBodies[0].firstChild.classList.add("greenText");
		nextBtn.disabled = false;
		backBtn.disabled = false;
		colorCacheHit("green",arr[3].innerHTML);
	});

	return "green";
}

// вспомогательная функция для пересортировки списков L1,L2 
// arr - данные, по найденной строке
// p - целевой размер списка T1
function replace (arr, p) {
	let deletedStr;
	let t1Size = t1.tBodies[0].rows.length;
	if (t1Size && (t1Size > p) || (arr[0] === b2 && t1Size === p)) {
		comments.innerHTML = comments.innerHTML + "\n\nПеремещаем LRU строку списка T1 в начало списка B1";
		deletedStr = t1.tBodies[0].lastChild;
		let environment = b1.tBodies[0];
		let lastPlace = t1.tBodies[0].lastChild;
		let newPlace = b1.tBodies[0].firstChild;
		environment.insertBefore(lastPlace, newPlace);
	}
	else {
		comments.innerHTML = comments.innerHTML + "\n\nПеремещаем LRU строку списка T2 в начало списка B2";
		deletedStr = t2.tBodies[0].lastChild;
		let environment = b2.tBodies[0];
		let lastPlace = t2.tBodies[0].lastChild;
		let newPlace = b2.tBodies[0].firstChild;
		environment.insertBefore(lastPlace, newPlace);
	}
	return deletedStr;
}

// кэш-попадание в B1
// arr - данные, по найденной строке
function hitInB1(arr) {
	comments.innerHTML = "Изменяем параметр р";

	// обновляем параметр p
	let b1Size = b1.tBodies[0].rows.length;
	let b2Size = b2.tBodies[0].rows.length;
	let b;
	if (b1Size > b2Size) {
		b = 1;
	}
	else {
 		b = b2Size/b1Size;
	}
	p = Math.min(p+b,c);
	parameter.innerHTML = p;
	// пересортировка L1,L2
	replace(arr,p);
	comments.innerHTML = comments.innerHTML + "\n\nПеремещаем искомую строку в начало списка T2";
	let environment = t2.tBodies[0];
	let lastPlace = arr[3].parentNode;
	let newPlace = t2.tBodies[0].firstChild;
	lastPlace.classList.add("blueText");
	// colorCacheHit("yellow", arr[3].innerHTML);
	nextBtn.disabled = true;
	backBtn.disabled = true;

	wait2(2000).then(function(){
		removeColoredCacheTags();
		lastPlace.classList.remove("blueText");
		environment.insertBefore(lastPlace, newPlace);
		t2.tBodies[0].firstChild.classList.add("greenText");
		nextBtn.disabled = false;
		backBtn.disabled = false;
		colorCacheHit("green", arr[3].innerHTML);
	});

	return "yellow";
}

// кэш-попадание в B2
// arr - данные, по найденной строке
function hitInB2(arr) {
	comments.innerHTML = "Изменяем параметр р";

	// обновляем параметр p
	let b1Size = b1.tBodies[0].rows.length;
	let b2Size = b2.tBodies[0].rows.length;
	let b;
	if (b2Size > b1Size){
		b = 1;
	}
	else {
		b = b1Size/b2Size;
	}
	p = Math.max(p - b, 0);
	parameter.innerHTML = p;
	// пересортировка L1,L2
	replace(arr,p);
	comments.innerHTML = comments.innerHTML + "\n\nПеремещаем искомую строку в начало списка T2";
	let environment = t2.tBodies[0];
	let lastPlace = arr[3].parentNode;
	let newPlace = t2.tBodies[0].firstChild
	lastPlace.classList.add("blueText");
	// colorCacheHit("yellow", arr[3].innerHTML);
	nextBtn.disabled = true;
	backBtn.disabled = true;

	wait2(2000).then(function(){
		removeColoredCacheTags();
		lastPlace.classList.remove("blueText");
		environment.insertBefore(lastPlace, newPlace);
		t2.tBodies[0].firstChild.classList.add("greenText");
		nextBtn.disabled = false;
		backBtn.disabled = false;
		colorCacheHit("green", arr[3].innerHTML);
	});

	return "yellow";
}

//обновляем таблицу "Память тегов"
function updateTags() {
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
function deleteString(deletedStr){
	document.getElementById("option1").disabled = false;
  document.getElementById("option2").disabled = false;

	nextBtn.disabled = true;
	backBtn.disabled = true;

	[].forEach.call(t1.tBodies[0].rows, (elem) => {
		if(elem.cells[0].innerHTML == deletedStr.cells[0].innerHTML){
			elem.classList.add("red");
		}
	});
	[].forEach.call(t2.tBodies[0].rows, (elem) => {
		if(elem.cells[0].innerHTML == deletedStr.cells[0].innerHTML){
			elem.classList.add("red");
		}
	});
	[].forEach.call(b1.tBodies[0].rows, (elem) => {
		if(elem.cells[0].innerHTML == deletedStr.cells[0].innerHTML){
			elem.classList.add("red");
		}
	});
	[].forEach.call(b2.tBodies[0].rows, (elem) => {
		if(elem.cells[0].innerHTML == deletedStr.cells[0].innerHTML){
			elem.classList.add("red");
		}
	});

	[].forEach.call(tags.tBodies[0].rows, (elem) => {
		if(elem.cells[0].innerHTML == deletedStr.cells[0].innerHTML.substr(7,3)){
			elem.classList.add("red");
		}
	});

	[].forEach.call(cache.tBodies[0].rows, (elem) => {
		if(elem.cells[3].innerHTML == deletedStr.cells[0].innerHTML){
			elem.classList.add("red");
			valid_dirty = elem.cells[1].innerHTML * elem.cells[2].innerHTML;
			// 1 - с сохранением в ОП
			// 0 - без сохранения в ОП
		}
	});
}

// ищем строку в кэш-памяти
// str - искомая строка
function searchString(str){
	let color = "red";
	saveTablesState();
	let searchResult = searchInList(str,t1); 
	if (searchResult.length) {
		// Hit in T1
		color = hitInT1(searchResult);
		// colorCacheHit(color, str);
	}
	else {
		searchResult = searchInList(str,t2)
		if (searchResult.length) {
			// Hit in T2
			color = hitInT2(searchResult);
			// colorCacheHit(color, str);
		}
		else {
			searchResult = searchInList(str,b1);
			if (searchResult.length) {
				// Hit in B1
				color = hitInB1(searchResult);
				// colorCacheHit(color, str);
			}
			else {
				searchResult = searchInList(str,b2);
				if(searchResult.length) {
					// Hit in B2
					color = hitInB2(searchResult);
					// colorCacheHit(color, str);
				}
				else {
					// Cache miss
					let deletedStr = miss(str);
					if (previousT1_2 && previousT2_2 && previousB1_2 && previousB2_2){
						t1.innerHTML = previousT1_2;
						t2.innerHTML = previousT2_2;
						b1.innerHTML = previousB1_2;
						b2.innerHTML = previousB2_2;
					}
					else {
						t1.innerHTML = previousT1_1;
						t2.innerHTML = previousT2_1;
						b1.innerHTML = previousB1_1;
						b2.innerHTML = previousB2_1;
					}
					deleteString(deletedStr);
				}
			}
		}
	}
	return [color];
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

// обработка нажатия кнопки "Удалить строку"
function deleteBtnOnClick(){
	//////////////////
	[].forEach.call(tags.tBodies[0].rows, (elem) => {
		elem.classList.remove("red","green","yellow","grey");
	});
	[].forEach.call(cache.tBodies[0].rows, (elem) => {
		elem.classList.remove("red","green","yellow","grey");
	});
	tags.tBodies[0].rows[0].classList.add("green");
	cache.tBodies[0].rows[0].classList.add("green");
	/////////////////

	let data = "string " + processor.tBodies[0].rows[pointer-1].cells[0].innerHTML + "0";

	miss(data);
	updateTags();
	updateCache();
	//removeColoredStrings();

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
	let deletedStr;
	let l1Size = t1.tBodies[0].rows.length + b1.tBodies[0].rows.length;
	let l2Size = t2.tBodies[0].rows.length + b2.tBodies[0].rows.length;
	let t1Size = t1.tBodies[0].rows.length;

	if (l1Size === c) {
		if(t1Size < c) {
			comments.innerHTML = "Удаляем LRU строку списка B1";
			b1.tBodies[0].removeChild(b1.tBodies[0].lastChild); 
			deletedStr = replace(arr,p);
		}
		else {
			comments.innerHTML = "Удаляем LRU строку списка T1";
			deletedStr = t1.tBodies[0].lastChild;
			t1.tBodies[0].removeChild(t1.tBodies[0].lastChild);
		}
	}
	else if ((l1Size < c) && ((l1Size + l2Size) >= c)) {
		if((l1Size + l2Size) === 2*c) {
			comments.innerHTML = "Удаляем LRU строку списка B2";
			b2.tBodies[0].removeChild(b2.tBodies[0].lastChild); 
			deletedStr = replace(arr,p); 
		}
	}
	comments.innerHTML = comments.innerHTML + "\n\nПомещаем искомую строку в начало списка T1";
	let tr = document.createElement("tr");
    tr.innerHTML = `<td>${arr}</td>`;
	t1.tBodies[0].prepend(tr);
	return deletedStr;
}

function removeColoredCacheTags (){
	[].forEach.call(tags.tBodies[0].rows, (elem) => {
		elem.classList.remove("red","green","yellow","grey");
	});
	[].forEach.call(cache.tBodies[0].rows, (elem) => {
		elem.classList.remove("red","green","yellow","grey");
	});
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
		elem.classList.remove("red","green","yellow","grey", "greenText");
	});
	[].forEach.call(t2.tBodies[0].rows, (elem) => {
		elem.classList.remove("red","green","yellow","grey", "greenText");
	});
	[].forEach.call(b1.tBodies[0].rows, (elem) => {
		elem.classList.remove("red","green","yellow","grey", "blueText");
	});
	[].forEach.call(b2.tBodies[0].rows, (elem) => {
		elem.classList.remove("red","green","yellow","grey", "blueText");
	});
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