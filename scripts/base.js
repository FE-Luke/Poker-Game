/**
 * Created by Zhichao Liu on 11/14/2015.
 */


window.onload = function(){
    document.onselectstart = function () {
        return false;
    };
    document.getElementById('layout').style.height = innerHeight-300+'px';
    document.getElementById('alert').style.left = (innerWidth-700)/2+'px';
    document.getElementById('alert').style.top = (innerHeight-400)/2+'px';
    var layoutEl = document.getElementById('layout');
    var gamePanelEl = document.getElementById('game-panel');
    var GCPokerEl = document.getElementsByClassName('GCPoker');
    var nOTs = 2;
    var pokerTop = 0;
    var previousTarget=null;

    var HS = ['ht','het','fk','mh'];
    var pokerDict = {};
    var randomPoker = function(){
        var randomHS = HS[Math.floor(Math.random()*4)];
        var randomNum = Math.floor(1+Math.random()*13);
        pk = randomHS+String(randomNum);
        while(pokerDict[pk]){
            randomHS = HS[Math.floor(Math.random()*4)];
            randomNum = Math.floor(1+Math.random()*13);
            pk = randomHS+String(randomNum);
        }
        pokerDict[pk] = true;
        return {pokerNum:randomNum,poker:pk};
    };

    var alertWindow = function(type,info){
        var alertEl = document.getElementById('alert');
        var typePic = document.getElementById('pic');
        var infoEl = document.getElementById('info');
        var closeEl = document.getElementById('close');
        typePic.style.background = "url('./images/" + type +".png')";
        infoEl.innerHTML = info;
        if(type == 'win'||type=='error'){
            closeEl.onclick = function(){
                location.reload();
            }
        }else{
            closeEl.onclick = function(){
                alertEl.style.opacity = '0';
                alertEl.style.zIndex = '-1';
            }
        }
        alertEl.style.zIndex = '999';
        alertEl.style.opacity = '1';
    };

    var Valid = function () {
        var layoutEl = document.getElementById('layout');
        var GCLeftEl = document.getElementsByClassName('GCLeft')[0];
        var GCRightEl = document.getElementsByClassName('GCRight')[0];
        if(layoutEl.firstElementChild == null){
            alertWindow('win','你赢了!');
        }else{

        }
    };



    /*布置战场*/
    for(var i=0;i<7;i++){
        for(j=0;j<i+1;j++){
            var pokerEl = document.createElement('div');
            var pk = randomPoker();
            pokerEl.setAttribute('class','poker');
            pokerEl.setAttribute('id',i+'_'+j);
            pokerEl.index = pk.pokerNum;
            pokerEl.pkX = i;
            pokerEl.style.top = pokerTop + 'px';
            pokerEl.style.left = (6-i)*82+j*164+'px';
            pokerEl.style.background = "url('./images/"+pk.poker+".png')";
            layoutEl.appendChild(pokerEl);
        }
        pokerTop+=70;
    }


    for(var i=0;i<24;i++){
        var pokerEl = document.createElement('div');
        var pk = randomPoker();
        pokerEl.setAttribute('class','poker');
        pokerEl.index = pk.pokerNum;
        pokerEl.style.top = '0px';
        pokerEl.style.left = '0px';
        pokerEl.style.background = "url('./images/"+pk.poker+".png')";
        GCPokerEl[0].appendChild(pokerEl);
        pokerEl.style.transform="rotateY(0deg)";
    }

    var pokerCount = 0;
    var pokerAnim = setInterval(function(){
        var pokerEl = document.querySelectorAll('#layout .poker');
        console.log(pokerCount,pokerEl.length);
        if(pokerCount<pokerEl.length){
            pokerEl[pokerCount].style.animationName = 'pokerAnim';
            pokerEl[pokerCount].style.transform = 'rotateZ(0deg)';
            pokerCount++;
        }else{
            console.log(pokerCount);
            clearInterval(pokerAnim);
        }
    },100);

    //事件委托
    //
    layoutEl.onclick = function(e){
        if(e.target == this){return;}
        var pokerIdX = Number(e.target.getAttribute('id').split('_')[0]);
        var pokerIdY = Number(e.target.getAttribute('id').split('_')[1]);
        var targetElA = document.getElementById(pokerIdX+1+'_'+pokerIdY);
        var targetElB = document.getElementById(pokerIdX+1+'_'+(pokerIdY+1));
        if(targetElA||targetElB){
            alertWindow('tips','没有被压的牌才能点!');
            return;
        }
        if(previousTarget!=null){

            if(e.target == previousTarget){
                previousTarget.style.border = '2px solid black';
                previousTarget = null;
                return;
            }else{
                if(e.target.index + previousTarget.index == 13){
                    e.target.parentElement.removeChild(e.target);
                    previousTarget.parentElement.removeChild(previousTarget);
                    previousTarget = null;
                    Valid();
                    return;
                }else{
                    alertWindow('tips','需要让两张牌的点数加起来等于13');
                    previousTarget.style.border = '2px solid black';
                    previousTarget = null;
                    return;
                }
            }
        }
        if(e.target.index == 13){
            e.target.parentElement.removeChild(e.target);
            Valid();
            return;
        }
        previousTarget = e.target;
        e.target.style.border = '2px solid red';
    };

    gamePanelEl.onclick = function(e){
        if(e.target == this){
            return;
        }else if(e.target.getAttribute('class')=='GCNext'){
            var GCLeftEl = document.getElementsByClassName('GCLeft')[0];
            var GCRightEl = document.getElementsByClassName('GCRight')[0];
            if(GCLeftEl.lastElementChild){
                    GCRightEl.appendChild(GCLeftEl.lastElementChild);

            }else{
                --nOTs;
                if(nOTs<0){
                    alertWindow('error','翻牌次数已经用尽 , 你输了 !');
                }else{
                    while(GCRightEl.firstElementChild){
                        GCLeftEl.appendChild(GCRightEl.firstElementChild);
                    }
                }
            }
        }else{
            console.log(document.getElementById('layout').firstElementChild);
            if(previousTarget!=null){
                if(e.target == previousTarget){
                    previousTarget.style.border = '2px solid black';
                    previousTarget = null;
                    return;
                }else{
                    if(e.target.index + previousTarget.index == 13){
                        e.target.parentElement.removeChild(e.target);
                        previousTarget.parentElement.removeChild(previousTarget);
                        previousTarget = null;
                        Valid();
                        return;
                    }else{
                        alertWindow('tips','需要让两张牌的点数加起来等于13');
                        previousTarget.style.border = '2px solid black';
                        previousTarget = null;
                        return;
                    }
                }
            }
            if(e.target.index == 13){
                e.target.parentElement.removeChild(e.target);
                Valid();
                return;
            }
            previousTarget = e.target;
            e.target.style.border = '2px solid red';
        }
    };
};
