function fallRND(tag1){
    var random = Math.floor(Math.random() * 14) + 1 
    console.log(random)
    var string = "string "+tag1+"0"
    vd(random)
    document.getElementById('del').dataset.i=random
    document.getElementById('del').dataset.tag1=tag1
    document.getElementById('del').dataset.string=string
}

function fallLFUandMRU(tag1){
    var stringToDelete = $($("#table4 tr .string")[16]).text() //удаляю последнюю строку
    var tagToDelete = stringToDelete[7] + stringToDelete[8] + stringToDelete[9]
    var string = "string "+tag1+"0"
    $('#table2 tr .tag2').each(function(i,elem){
        if ($(elem).text()==tagToDelete){
            vd(i)
            document.getElementById('del').dataset.elem=elem
            document.getElementById('del').dataset.i=i
            document.getElementById('del').dataset.tag1=tag1
            document.getElementById('del').dataset.string=string
        }
    })
}

function fallLRU(tag1){
    var stringToDelete = $($("#table4 tr .string")[16]).text() //удаляю последнюю строку
    var tagToDelete = stringToDelete[7] + stringToDelete[8] + stringToDelete[9]
    var string = "string "+tag1+"0"
    $('#table2 tr .tag2').each(function(i,elem){
        if ($(elem).text()==tagToDelete){
            vd(i)
            document.getElementById('del').dataset.elem=elem
            document.getElementById('del').dataset.i=i
            document.getElementById('del').dataset.tag1=tag1
            document.getElementById('del').dataset.string=string
        }
    })   
}

function fallFIFO(tag1){
    var stringToDelete = $($("#table4 tr .string")[16]).text() //удаляю последнюю строку
    var tagToDelete = stringToDelete[7] + stringToDelete[8] + stringToDelete[9]
    var string = "string "+tag1+"0"
    console.log(tagToDelete)
    $('#table2 tr .tag2').each(function(i,elem){
        if ($(elem).text()==tagToDelete){
            vd(i)
            document.getElementById('del').dataset.elem=elem
            document.getElementById('del').dataset.i=i
            document.getElementById('del').dataset.tag1=tag1
            document.getElementById('del').dataset.string=string
        }
    }) 
}

// function fallARC(tag1){
//     var stringToDelete = $($("#table4 tr .string")[16]).text() //удаляю последнюю строку 
//     var tagToDelete = stringToDelete[7] + stringToDelete[8] + stringToDelete[9]
//     var string = "string "+tag1+"0"
//     $('#table2 tr .tag2').each(function(i,elem){
//         if ($(elem).text()==tagToDelete){
//             vd(i)
//             document.getElementById('del').dataset.elem=elem
//             document.getElementById('del').dataset.i=i
//             document.getElementById('del').dataset.tag1=tag1
//             document.getElementById('del').dataset.string=string
//         }
//     })   
// }
