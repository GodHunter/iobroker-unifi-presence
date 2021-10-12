// ************************************************************
// KONFIGURATION
//
// pfad: Gibt an wo die Datenpunkte erstellt werden
// json: Enthält die Konfigurationsdaten (Name d. Person, MAC Adresse des zu Überwachenden Geräts, Zeit in Minuten bis als Abwesend markiert)
// telegram: Versendet bei Bedarf eine Nachricht via Telegram Adapter
//
// ************************************************************
 
const pfad      = '0_userdata.0.Anwesenheit.';
const json      = '{"person":[{"name":"PERSON1", "mac":"12:34:56:78:90:ab", "zeit":3},{"name":"PERSON2", "mac":"12:34:56:78:90:ab", "zeit":5}]}';
const telegram  = true;
 
// AB HIER KEINE ÄNDERUNGEN MEHR VORNHMEN
on({id: 'unifi.0.info.connection', change: "any"}, function (obj){
 
    const now   = new Date();
    const array = JSON.parse(json);    
    var total   = array.person.length;
    
    createStates(array);
 
    array.person.forEach(function(person){
 
        var seen = new Date( getState('unifi.0.default.clients.'+ person.mac +'.last_seen').val );
 
        if( ( now.getTime() - seen.getTime() ) > ( person.zeit * 60000 ) ){
            
            if( getState(pfad + person.name).val === true) {
                setState(pfad + person.name, false, true);
 
                if(telegram){
                    setTimeout(function() {
                        send(person.name +' ist gegangen.');
                    }, 5000);
                }
 
            }
 
            total = total -1;
 
        } else {
 
            if( getState(pfad + person.name).val === false ) {
                setState(pfad + person.name, true, true);
                if(telegram) {
                    setTimeout(function() {
                        send(person.name +' ist angekommen.');
                    }, 5000);
                }
            }
 
        }
 
    })
 
    setState(pfad +'Anwesend', total, true);
    setState(pfad +'Abwesend', (array.person.length - total), true);
 
});
 
function send(nachricht){
    
    setTimeout(function() {
        nachricht = '<b>Anwesenheit</b>\r\n'+ nachricht;
    
        sendTo("telegram.0", "send", {
            "text": [nachricht].join(''),
            parse_mode: "HTML"
        });
 
    }, 2000);
 
}
 
function createStates(personen){
    
    createState(pfad +'Anwesend', 99, {read:true, write:true, type:'number', desc:'Anzahl Personen anwesend'});
    createState(pfad +'Abwesend', 99, {read:true, write:true, type:'number', desc:'Anzahl Personen abwesend'});
 
    personen.person.forEach(function(person){
        createState(pfad + person.name, false, {read:true, write:true, type:'boolean', def:false, desc:'Anwesenheitsstatus von '+ person.name});    
    });
 
}
