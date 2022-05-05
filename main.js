let currentPage = '#introPage'
//vi holder styr på hvilket spørgsmål vi er nået til med variablen q
let q = 0
//userChoidce markerer det pågældende valg brugeren har foretaget på det nuværende spørgsmål
let userChoice
//client er den variabel der bruges til at oprette forbindelse til mqtt serveren
let client 
let timer = ()=>{console.log("Time")
    select('#rightOrWrong').html('Forkert')
                select('#wheelButton').show()
                select('#nextButton').hide()
                shiftPage('#wheelPage')
}
var timeoutid

function setup(){
    //kald funktionen mqttinit() som sætter client op til at forbinde med mqtt serveren
    mqttInit()
    console.log('script klar')
    select('#startButton').mousePressed( () => {
        newQuestion()
        shiftPage('#questionPage')
    })
    select('#wheelButton').mousePressed(()=> {
        client.publish('wheel', 'wrong')
        shiftPage('#wheelPage')
    })
    select('#nextButton').mousePressed(()=>{
        newQuestion()
        shiftPage('#questionPage')
    })
    select('#continueButton').mousePressed(()=>{
        newQuestion()
        shiftPage('#questionPage')
    })
}

function newQuestion(){
    if(timeoutid!=undefined){
        clearTimeout(timeoutid)
    }
    timeoutid=setTimeout(timer,30000)
    select('#questionHeader').html(questions[q].question)
    select('#questionOptions').html('')
    //nu løber vi svar mulighederne i spørgsmålet igennem med funktinen map()
    questions[q].answers.map( (answer, index) => {
        //for HVER svarmulighed laver vi en ny html div med klassen 'answer'
        let answerDiv = createDiv(answer).addClass('answer')
        //når brugeren så KLIKKER på denne svardiv tjekker vi om svaret er rigtigt
        answerDiv.mousePressed(()=>{
            if(index == questions[q].correct){
                select('#rightOrWrong').html('Korrekt')
                select('#nextButton').show()
                select('#wheelButton').hide()
            }else{
                select('#rightOrWrong').html('Forkert')
                select('#wheelButton').show()
                select('#nextButton').hide()
            }
            //gå videre til næste spørgsål
            q = q + 1
            if(q==questions.length){
                q=0
            }
            //skift til svarsiden 
            shiftPage('#answerPage')
        })
        select('#questionOptions').child(answerDiv)
    })
}

function shiftPage(newPage){
    //p5 funktion der returnerer alle div elemeneter med class=page
    let pages = selectAll('.page')
    pages.map( p => p.removeClass('show'))
    currentPage = newPage
    select(newPage).addClass('show')
}

const mqttInit = () => {
    //opret et id med en random talkode og sæt gem servernavnet i en variabel
    const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8)
    const host = 'wss://mqtt.nextservices.dk'
  
    //opret et objekt med de oplysninger der skal bruges til at forbinde til serveren
    const options = {
      keepalive: 300,
      clientId: clientId,
      reconnectPeriod: 1000,
    }
  
    console.log('connecting mqtt client')
  
    //forsøg at oprette forbindelse 
    client = mqtt.connect(host, options)
  
    //hvis der sker en fejl kaldes denne funktion
    client.on('error', (err) => {
      console.log('Connection error: ', err)
      client.end()
    })
  
    //og hvis forbindelsen mistes kaldes denne funktion
    client.on('reconnect', () => {
      console.log('Reconnecting...')
    })
  
    //hvis forbindelsen lykkes kaldes denne funktion
    client.on('connect', (t, m) => {
      console.log('Client connected:' + clientId, t)
    })
  
    //når forbindelsen lukkes kaldes denne funktion
    client.on('close', () => {
      console.log(clientId + ' disconnected')
    })
  } 