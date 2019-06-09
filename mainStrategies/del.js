function del(){
    document.getElementById("option1").checked = false;
    document.getElementById("option2").checked = false;
    
    var tag1=document.getElementById('del').dataset.tag1
    var i=document.getElementById('del').dataset.i
    var string=document.getElementById('del').dataset.string
    
    // if (document.getElementById('store').dataset.strategy=="ARC"){
    //     $($("#table2 tr .tag2")[i]).html(tag1)
    //     $($("#table3 tr .data")[i]).html(string)
    //     $($("#table4 tr .string")[16]).html(string)
    //     $($("#table4 tr .count")[16]).html(1)
    //     $($("#table4 tr .time")[16]).html(0)
    // }
    if (document.getElementById('store').dataset.strategy=="FIFO"){
        $($("#table2 tr .tag2")[i]).html(tag1)
        $($("#table3 tr .data")[i]).html(string)
        $($("#table4 tr")[17]).remove()
        $('#table4').prepend('<tr><td class="string">'+string+'</td><td class="count hide">1</td><td class="time hide">0</td></tr>')
    }
    else if (document.getElementById('store').dataset.strategy=="LRU"){
        $($("#table2 tr .tag2")[i]).html(tag1)
        $($("#table3 tr .data")[i]).html(string)
        $($("#table4 tr .string")[16]).html(string)
        $($("#table4 tr .time")[16]).html(0)
    }
    else if (document.getElementById('store').dataset.strategy=="LFU" || document.getElementById('store').dataset.strategy=="MRU"){
        $($("#table2 tr .tag2")[i]).html(tag1)
        $($("#table3 tr .data")[i]).html(string)
        $($("#table4 tr .string")[16]).html(string)
        $($("#table4 tr .count")[16]).html(1)
    }
    else if(document.getElementById('store').dataset.strategy=="RND"){
        $($("#table2 tr .tag2")[i]).html(tag1)
        $($("#table3 tr .valid")[i]).html(1)
        $($("#table3 tr .dirty")[i]).html(0)
        $($("#table3 tr .data")[i]).html(string)   
    }    
    
    unred(i)
    
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
    
    if (tag1!="D68"){ //переписать в будущем для большого числа вариантов и с любой последней строкой
        document.getElementById("forward").disabled = false;
        document.getElementById("back").disabled = false;
    }
    else {
        alert("Выполнение программы завершено,для повтора перезагрузите страницу")
        document.getElementsByClassName("strategy").disabled = true
    }
    
    document.getElementById("delete").disabled = true;
}

