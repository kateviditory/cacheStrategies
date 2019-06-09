function back() {
    var current = $(".selected");
    $(".selected").prev().addClass("selected");
    $(current).removeClass("selected");
    document.getElementById('table2').innerHTML=document.getElementById('store').dataset.table2
    document.getElementById('table3').innerHTML=document.getElementById('store').dataset.table3
    document.getElementById('table4body').innerHTML=document.getElementById('store').dataset.table4
    document.getElementById("back").disabled = true;
}

function sortTableLFU(table_id, sortColumn){
    var tableData = document.getElementById(table_id).getElementsByTagName('tbody').item(0);
    var rowData = tableData.getElementsByTagName('tr');            
    for(var i = 0; i < rowData.length - 1; i++){
        for(var j = 0; j < rowData.length - (i + 1); j++){
            if(Number(rowData.item(j).getElementsByTagName('td').item(sortColumn).innerHTML.replace(/[^0-9\.]+/g, "")) < Number(rowData.item(j+1).getElementsByTagName('td').item(sortColumn).innerHTML.replace(/[^0-9\.]+/g, ""))){
                tableData.insertBefore(rowData.item(j+1),rowData.item(j));
            }
        }
    }
}

function sortTableMRU(table_id, sortColumn){
    var tableData = document.getElementById(table_id).getElementsByTagName('tbody').item(0);
    var rowData = tableData.getElementsByTagName('tr');            
    for(var i = 0; i < rowData.length - 1; i++){
        for(var j = 0; j < rowData.length - (i + 1); j++){
            if(Number(rowData.item(j).getElementsByTagName('td').item(sortColumn).innerHTML.replace(/[^0-9\.]+/g, "")) > Number(rowData.item(j+1).getElementsByTagName('td').item(sortColumn).innerHTML.replace(/[^0-9\.]+/g, ""))){
                tableData.insertBefore(rowData.item(j+1),rowData.item(j));
            }
        }
    }
}

function option(value){
    if (value==document.getElementById('store').dataset.vd){
        document.getElementById("delete").disabled = false; 
        document.getElementById("option1").disabled = true;
        document.getElementById("option2").disabled = true;
    }
}

function red(i){
    $("#table2 tr")[i].style.background = "red"
    $("#table3 tr")[i].style.background = "red"
}

function unred(i){
    $("#table2 tr")[Number(i)+2].style.background = "white"
    $("#table3 tr")[Number(i)+2].style.background = "white"   
}

function lock(){
    document.getElementById("forward").disabled = true;
    document.getElementById("back").disabled = true;
    document.getElementById("delete").disabled = true;
    document.getElementById("option1").disabled = false;
    document.getElementById("option2").disabled = false;
    disableStrategy()
}

function vd(i){
    red(i+2)
    lock()
    var vd = Number($($("#table3 tr .valid")[i]).text())+Number($($("#table3 tr .dirty")[i]).text())
    if (vd>1){
        document.getElementById('store').dataset.vd=1
    }
    else {
        document.getElementById('store').dataset.vd=2
    }   
}

function disableStrategy(){
    document.getElementById("rnd").disabled = true;
    document.getElementById("lru").disabled = true;
    document.getElementById("mru").disabled = true;
    document.getElementById("fifo").disabled = true;
    // document.getElementById("arc").disabled = true;
    document.getElementById("lfu").disabled = true;
}

function enableStrategy(){
    document.getElementById("rnd").disabled = false;
    document.getElementById("lru").disabled = false;
    document.getElementById("mru").disabled = false;
    document.getElementById("fifo").disabled = false;
    // document.getElementById("arc").disabled = false;
    document.getElementById("lfu").disabled = false;  
}