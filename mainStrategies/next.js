function next(){
    document.getElementById('store').dataset.table2=$("#table2").html()
    document.getElementById('store').dataset.table3=$("#table3").html()
    document.getElementById('store').dataset.table4=$("#table4 tbody").html()
                
    document.getElementById("back").disabled = false;
    
    enableStrategy()
                
    var current = $(".selected");
    $(".selected").next().addClass("selected");
    $(current).removeClass("selected");
                
    var tag1=$(".selected .tag1").text();

    $(".hit").removeClass("hit");
    
    var cashHit = false;
    
    $('#table2 tr .tag2').each(function(i,elem) {
        if ($(elem).text()==tag1) { //кэш-попадание
            var valid = Math.floor(Math.random() * 2) + 0
            var dirty = Math.floor(Math.random() * 2) + 0
            $($('#table3 tr .valid')[i]).html(valid)
            $($('#table3 tr .dirty')[i]).html(dirty)
                        
            cashHit = true;
            $(elem).parent().addClass("hit");
            $($('#table3 tr')[i+2]).addClass("hit");
            
            var string = 'string '+tag1+'0';
            $('#table4 tr .string').each(function(i,elem) {
                if (string==$(elem).text()){
                    var count = $($(elem).parent().find("td")[1]).html()
                    count++;
                    $($(elem).parent().find("td")[1]).html(count)
                    $($(elem).parent().find("td")[2]).html(0)
                }
                else {
                    var time = $($(elem).parent().find("td")[2]).html()
                    time++
                    $($(elem).parent().find("td")[2]).html(time)
                }
            })
        }
    }).promise().done(function() {
        if (tag1==$($("#table1 tag1")[20]).text()){
            document.getElementById("forward").disabled = true;
            document.getElementById("back").disabled = true;
            document.getElementsByClassName("strategy").disabled = true
            alert("Выполнение программы завершено,для повтора перезагрузите страницу")
            cashHit = true
        }
    });
    if (cashHit!=true) { //кэш-промах
        $('#table4 tr .string').each(function(i,elem) {
            var time = $($(elem).parent().find("td")[2]).html()
            time++
            $($(elem).parent().find("td")[2]).html(time)  
        })
        if (document.getElementById('store').dataset.strategy=="RND") {
            fallRND(tag1)
        }
        if (document.getElementById('store').dataset.strategy=="LFU" || document.getElementById('store').dataset.strategy=="MRU") {
            fallLFUandMRU(tag1)
        }
        if (document.getElementById('store').dataset.strategy=="LRU") {
            fallLRU(tag1)
        }
        if (document.getElementById('store').dataset.strategy=="FIFO") {
            fallFIFO(tag1)
        }
        // if (document.getElementById('store').dataset.strategy=="ARC") {
        //     fallARC(tag1)
        // }            
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
