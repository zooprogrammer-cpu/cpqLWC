export function onAfterCalculate(quote,lines,conn){
    quote.groups.forEach(function(group){ //loop through groups
        console.log("Running QCP")
        var number = 0; 
        group.record.Roll_up__c =0;
        console.log("from group = " + group.key);
        lines.forEach(function(line){
            //aggregations here
            if(line.parentGroupKey == group.key){
                console.log("from line =" + line.parentGroupKey);
                number == line.record.SBQQ__NetTotal__c;
                console.log("number =" + number); 
            }
        });
        group.record.Roll_up__c = number.toString();
        console.log("number end of loop =" + number);
    })

    console.log(quote.groups);

    return Promise.resolve();
}