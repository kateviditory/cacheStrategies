function start(strategy){
    document.getElementById('store').dataset.strategy=strategy;             
    if (document.getElementById('store').dataset.start=="no") {
        document.getElementById('store').dataset.start="yes"
        document.getElementById("forward").disabled = false;
        $($("#table1 tr")[2]).addClass("selected")
        $($("#table2 tr")[2]).addClass("hit")
        $($("#table3 tr")[2]).addClass("hit")
    }
    if (document.getElementById('store').dataset.strategy=="LFU"){
        sortTableLFU('table4', 1);
    }
    if (document.getElementById('store').dataset.strategy=="MRU"){
        sortTableMRU('table4', 1);
    }
    if (document.getElementById('store').dataset.strategy=="LRU"){
        sortTableMRU('table4', 2);
    }
    // if (document.getElementById('store').dataset.strategy=="ARC"){
    //     sortTableMRU('table4', 2);
    //     sortTableLFU('table4', 1);
    // }
}

function startRND(){
    $("#table4").hide()
    $("#table5").show()
}

function startLFUandMRU(){
    $("#table4 .time").hide()
    $("#table4 .count").show()
    $("#table4").show()
    $("#table5").hide() 
    if (document.getElementById('store').dataset.strategy=="LFU"){
        sortTableLFU('table4', 1);
    }
    else if (document.getElementById('store').dataset.strategy=="MRU"){
        sortTableMRU('table4', 1);
    }
}

function startLRU(){
    $("#table4 .count").hide()
    $("#table4 .time").show()
    $("#table4").show()
    $("#table5").hide() 
}

function startFIFO(){
    $("#table4 .time").hide()
    $("#table4 .count").hide()
    $("#table4").show()
    $("#table5").hide()
}

// function startARC(){
//     $("#table4 .time").show() 
//     $("#table4 .count").show()
//     $("#table4").show()
//     $("#table5").hide()
// }