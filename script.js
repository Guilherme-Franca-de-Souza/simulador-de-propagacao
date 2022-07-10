
function distance(x1, x2, y1, y2){ // mede a distancia entre as esferas, verifica colisão
    xDistance = x2 - x1;
    yDistance = y2 - y1;
    
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}



function randrange(min, max) {
    return Math.random() * (max - min) + min; 
}


var doentes = 0;
var recuperados = 0;
var mortos = 0;
function painel(){
    p1.innerHTML = "DOENTES: "+doentes;
    p2.innerHTML = "RECUPERADOS: "+recuperados;
    p3.innerHTML = "MORTOS: "+mortos;
} 
painel();


function startcanvas(){
    var canvas = document.getElementById("c1"); 
    width = window.innerWidth * 0.98;
    canvas.width = width;
    height = window.innerHeight * 0.75;
    canvas.height = height;
    div = document.getElementById("container")
    div.style.height = ((window.innerHeight * 0.20)+"px")
    var c = canvas.getContext('2d');
    return c;
}
var c = startcanvas();



running = false;

function start(){
    if(running == true){
        running = false;
        document.getElementById("button").value = "START";
        document.getElementById("tm").disabled = false;
        document.getElementById("pt").disabled = false;
        document.getElementById("tr").disabled = false;
        document.getElementById("pq").disabled = false;
        document.getElementById("pp").disabled = false;
    }else{
        jscript();
        document.getElementById("button").value = "STOP";
        document.getElementById("tm").disabled = true;
        document.getElementById("pt").disabled = true;
        document.getElementById("tr").disabled = true;
        document.getElementById("pq").disabled = true;
        document.getElementById("pp").disabled = true;
    }

}


function jscript(){

    var pp = document.getElementById("pp").value;

    document.getElementById("populacao").innerHTML= "POPULACAO: "+pp;
    // seta as variaveis aqui
    var tm = document.getElementById("tm").value;
    var pt = document.getElementById("pt").value;
    var tr = document.getElementById("tr").value;
    var pq = document.getElementById("pq").value;


    var aparticles = [];
    doentes = 0;
    recuperados = 0;
    mortos = 0;

    function direction(){
        // aponta direção da particula, quando X -1 significa esquerda e 1 significa direita
        // quando Y -1 significa pra cima e 1 significa pra baixo 
        var dire = [-1,1];
            var a = Math.random()
            if(a<0.5){
                a = dire[1];
            }else{
                a = dire[0];
        }
        return a;
    }

    function Particle(x, y, rai, movel){
        this.sick = false;
        this.alive = true;
        this.imune = false;
        this.x = x;
        this.y = y;
        this.rai = rai;
        this.movel = movel;
        this.sx = direction();
        this.sy = direction();
        this.color = "cyan";
        this.time = 0;
        this.count = 0;

        this.draw = function(){
            c.beginPath();
            c.fillStyle = this.color;
            c.arc(this.x, this.y, this.rai, 0, Math.PI * 2, false);
            c.fill();
        }
        
        this.getsick = function(){
            var ppt = randrange(0,100);
            if(this.imune == false && ppt < pt){
                console.log(ppt);
                this.sick = true;
                this.color = "Magenta";
                this.imune = true;
                this.count = 1;
                doentes += 1;
                painel();
            }
        }
        
        this.n = 0; // n é um contador, toda vez que ele chega a 10, a particula muda de direção
        this.chandir = function(){
            if(this.n > 10){
                this.n = 0;
                this.sx = direction();
                this.sy = direction();
            }
        
        }
        
        
        this.update = Particle => { 
            if(this.time < tr){
                this.time = this.time + this.count // time é um contador, pra particula doente
                // count, quando a particula é saudável, é zero, quando doente é 1
                // ao final do time, a particula morre ou se recupera
                // nesse proximo else
            }else{
                this.count = 0;
                this.time = 0;
                var pm = randrange(0, 100);
                if(pm < tm){
                    this.alive = false;
                    this.color = "black";
                    this.sick = false;
                    mortos += 1;
                    doentes -= 1;
                }else{
                    this.sick = false;
                    this.color = "yellow";
                    recuperados += 1;
                    doentes -= 1;
                    painel();
                }
                
            }
            
            this.draw();
            
            for(i=0;i<pp;i++){
                if(this === aparticles[i]) continue; 
                // "continue" termina a atual iteração, ou seja, nao comára ele com ele mesmo
                if(distance(this.x, aparticles[i].x, this.y, aparticles[i].y) - 5 * 2 < 0){
                    // verifica se colidiu com a particula, e se ela tiver doente, transmite
                    if(aparticles[i].sick == true){
                        this.getsick();
                    
                    }
                }
            }
            
            if(this.alive && this.movel){
                this.chandir();
                this.n++;
                this.x += this.sx; // é aqui que ele anda, a proxima posição dele vai ser definida aqui
                this.y += this.sy;
                // abaixo verifica colisão com a parede 
                if(this.x > width - this.rai || this.x < this.rai){
                    this.sx = -this.sx;
                    this.n = 0;
                }
                if(this.y > height - this.rai || this.y < this.rai){
                    this.sy = -this.sy;
                    this.n = 0;
                }
            }
            
        }
    }

    // criando as particulas
    
    var n = 0;

    function pmovel(){
        var p = randrange(0,100);
        if(p<pq){
            return false;
        }else{
            return true;
        }
    }

    while(n < pp){ 
        var rai = 1;
        var x = randrange(rai, width - (rai));
        var y = randrange(rai, height - (rai));
        if(n != 0){
            var ok = true;
            for(j=0;j < aparticles.length; j++){
                if(distance(x, aparticles[j].x, y, aparticles[j].y) - rai * 2 < 0){
                    ok = false
                }            
            }
            if(ok == true){
                movel = pmovel();
                aparticles.push(new Particle(x, y, rai, movel));
                n++;
            }
        }else{
            aparticles.push(new Particle(x, y, rai, true));
            n++;
        }  

    }

    running = true;
    // frames dos movimentos
    function animate(){
        if(running == true){
            requestAnimationFrame(animate);
            c.clearRect(0, 0, innerWidth , innerHeight); // limpa todo o canvas
            aparticles.forEach(Particle => {Particle.update(aparticles)}); // atualiza os dados de cada particula
        }else{
            cancelAnimationFrame(animate);
            return 0;
        }
    }

    // seta a primeira particula como doente, o caso 0
    aparticles[1].sick = true;
    aparticles[1].color = "Magenta";
    aparticles[1].imune = true;
    aparticles[1].count = 1;
    doentes += 1;
    painel();

    animate();
    
    return 0;
}; 