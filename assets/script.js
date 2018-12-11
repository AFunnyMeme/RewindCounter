Likes = 0, Dislikes = 0, Total = 0, Difference = 0;
Baby = 9716306, BabyLeft = 0;
LikesMin = 0, DislikesMin = 0, TotalMin = 0;
LikesPerMin = 0, DislikesPerMin = 850, TotalPerMin = 0;
let LikeAnim, DislikeAnim;
Meta = {};
AveragePerMin = ('AveragePerMin' in localStorage) ? localStorage.AveragePerMin.split(','):[];

function getOffset(e){return box=e.getBoundingClientRect(),{top:box.top+window.pageYOffset-document.documentElement.clientTop,left:box.left+window.pageXOffset-document.documentElement.clientLeft}};
function height(e){o=getComputedStyle(e,null).getPropertyValue('height').replace(/\D/g,'');return parseInt(o)}
function round(value,precision){var multiplier=Math.pow(10,precision||0);return Math.round(value*multiplier)/multiplier}
function dateAdd(date,interval,units){var ret=new Date(date);var checkRollover=function(){if(ret.getDate()!=date.getDate())ret.setDate(0)};switch(interval.toLowerCase()){case 'year':ret.setFullYear(ret.getFullYear()+units);checkRollover();break;case 'quarter':ret.setMonth(ret.getMonth()+3*units);checkRollover();break;case 'month':ret.setMonth(ret.getMonth()+units);checkRollover();break;case 'week':ret.setDate(ret.getDate()+7*units);break;case 'day':ret.setDate(ret.getDate()+units);break;case 'hour':ret.setTime(ret.getTime()+units*3600000);break;case 'minute':ret.setTime(ret.getTime()+units*60000);break;case 'second':ret.setTime(ret.getTime()+units*1000);break;default:ret=undefined;break}
return ret}//from http://jsfiddle.net/rhq0Lma5/345/
function PrintTime(date){return((date.getHours()>12)?(date.getHours()-12):date.getHours())+':'+((date.getMinutes()<10?'0':'') + date.getMinutes() )+':'+((date.getSeconds()<10?'0':'') + date.getSeconds() )+' '+((date.getHours()>12)?'PM':'AM')+' '+date.toLocaleTimeString('en-us',{timeZoneName:'short'}).split(' ')[2]}


function LikeIncrease(){return (Likes-parseInt(localStorage.InitalLikes))};
function DislikeIncrease(){return (Dislikes-parseInt(localStorage.InitalDislikes))};
function BeatBaby(){
	if(Baby>Dislikes){
		BabyLeft = (Baby-Dislikes);
		str='-'+BabyLeft.toLocaleString('en');
		TimeUntilBeatBaby();
		}
	else if(Dislikes>Baby){
		BabyLeft = 0;
		str='+'+(Dislikes-Baby).toLocaleString('en');
		}
	document.querySelector('#beat-baby').innerText=str;
	}
function GetDifference(){if(Dislikes>Likes){return{leader:'dislikes',diff:(Dislikes-Likes)}}else if(Likes>Dislikes){return{leader:'likes',diff:(Likes-Dislikes)}}}

function TimeUntilBeatBaby(){
	Now = new Date();
	ZeroHour = new Date();
	if (BabyLeft===0) return;
	if (AveragePerMin.length>26) AveragePerMin.slice(Math.max(AveragePerMin.length - 25, 1))
	total = 0;
	for(a = 0; a < AveragePerMin.length; a++) {total += parseInt(AveragePerMin[a]);}
	avg = ((total/AveragePerMin.length)||DislikesPerMin);
	MinutesUntilBeat = (BabyLeft/avg);
	ZeroHour = dateAdd(ZeroHour, 'minute', MinutesUntilBeat);
	Distance = (ZeroHour.getTime() - Now.getTime());
	Time = {
		days: Math.floor(Distance / (1000 * 60 * 60 * 24)),
		hours: Math.floor((Distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
		minutes: Math.floor((Distance % (1000 * 60 * 60)) / (1000 * 60)),
		seconds: Math.floor((Distance % (1000 * 60)) / 1000)
	};
	left = '';
	for (key in Time){
		if (Time[key]!==0){
			left+=Time[key]+key[0]+' ';
		}
	}
	document.querySelector('#time-left').innerText = left.replace(/[ ]$/,'');
	document.querySelector('#date-left').innerText = ZeroHour.toLocaleDateString(navigator.languages[0], { year: 'numeric', month: 'short', day: 'numeric', timeZoneName:'short', hour:'2-digit',minute:'2-digit',second:'2-digit' });
}

function getPercentages(){
	LikesPercentage = (Likes / Total) * 100;
	DislikesPercentage = (Dislikes / Total) * 100;
	document.querySelector('#like-block').style.width = LikesPercentage+'%';
	document.querySelector('.perc-like').innerText = round(LikesPercentage,3)+'%';
	document.querySelector('.perc-like').setAttribute('data-tooltip',LikesPercentage+'%');
	document.querySelector('#dislike-block').style.width = DislikesPercentage+'%';
	document.querySelector('.perc-dis').innerText = round(DislikesPercentage,3)+'%';
	document.querySelector('.perc-dis').setAttribute('data-tooltip',DislikesPercentage+'%');
}


function Announce(str){
	if (str.length!==0){
		document.querySelector('.announce').style.visibility='visible';
		document.querySelector('.announce').style.display='block';
		document.querySelector('.announce').innerHTML=str;
	}
}

async function InitRewind(){
	//M.FloatingActionButton.init(document.querySelectorAll('.fixed-action-btn'), {direction: 'left'});
	M.Tooltip.init(document.querySelectorAll('.tooltipped'));
	pushpins = document.querySelectorAll('.section-nav');
	pushpins_parsed = [];
	if (pushpins.length!==0){
		pushpins.forEach(function(value,index){
			$target = document.querySelector('#'+pushpins[index].getAttribute('data-target'));
			p = M.Pushpin.init(pushpins[index], {
				top: getOffset($target).top,
				bottom: getOffset($target).top + $target.offsetHeight - height(pushpins[index])
			});
			pushpins_parsed.push(p);
		});
	}
	CO = {
		useEasing: true,
		easingFn: (t,b,c,d)=>{var ts=(t/=d)*t;var tc=ts*t;return b+c*(tc+ -3*ts+3*t)},
		useGrouping: true, 
		separator: ',', 
		decimal: '.', 
	};
	await UpdateFuck(true);
	LikeAnim = new CountUp('likesDiv', Likes, Likes, 0, 3, CO);
	DislikeAnim = new CountUp('disLiDiv', Dislikes, Dislikes, 0, 3, CO);
	LikeAnim.start();
	DislikeAnim.start();
	if (!('InitalLikes' in localStorage)) localStorage.InitalLikes = parseInt(Likes);
	if (!('InitalDislikes' in localStorage)) localStorage.InitalDislikes = parseInt(Dislikes);
	setInterval(function(){ UpdateFuck(); }, 5000);
	LikesMin = Likes;
	DislikesMin = Dislikes;
	TotalMin = Total;
	setInterval(function(){ MinuteStats(); }, 60000);
	let meta = await fetch('https://api.allorigins.ml/get?url=https%3A%2F%2Fpastebin.com%2Fraw%2Fbyr0QY8p');
	Meta = await meta.json();
	Meta = JSON.parse(Meta.contents);
	if ('announce' in Meta){Announce(Meta.announce);}
	setInterval(function(){ CheckMeta(); }, 600000);
}

async function UpdateFuck(DontUpdate){
	Results = await FuckRewind();
	if (Results!==true) throw 'Something happened';
	Total = Likes+Dislikes;
	Difference = GetDifference();
	getPercentages();
	BeatBaby();
	document.querySelector('#total').innerText = Total.toLocaleString('en');
	document.querySelector('#like-increase').innerText = LikeIncrease().toLocaleString('en');
	document.querySelector('#dislike-increase').innerText = DislikeIncrease().toLocaleString('en');
	if (DontUpdate && DontUpdate===true) return;
	LikeAnim.update(Likes);
	DislikeAnim.update(Dislikes);
	return;
}

function MinuteStats(){
	LikesPerMin = (Likes-LikesMin);
	DislikesPerMin = (Dislikes-DislikesMin);
	TotalPerMin = (Total-TotalMin);
	AveragePerMin.push(DislikesPerMin);
	localStorage.AveragePerMin = AveragePerMin.join(',');
	document.querySelector('#like-min').innerText = LikesPerMin.toLocaleString('en');
	document.querySelector('#dislike-min').innerText = DislikesPerMin.toLocaleString('en');
	document.querySelector('#total-min').innerText = TotalPerMin.toLocaleString('en');
	document.querySelector('#updated-min').innerText = PrintTime(new Date());
	LikesMin = Likes;
	DislikesMin = Dislikes;
	TotalMin = Total;
}

async function FuckRewind(){
	let page = await fetch('https://api.allorigins.ml/get?url=https%3A%2F%2Fm.youtube.com%2Fwatch%3Fv%3DYbJOTdZBX1g%26app%3Dm');
	let json = await page.json();
	LikeRegex = /\<span style="color:[ ]*?\#006500"\>(\d+)\<\/span>/g;
	DislikeRegex = /\<span style="color:[ ]*?\#CB0000"\>(\d+)\<\/span>/g;
	GetLikes = LikeRegex.exec(json.contents);
	GetDislikes = DislikeRegex.exec(json.contents);
	if (1 in GetLikes) Likes=parseInt(GetLikes[1]);
	if (1 in GetDislikes) Dislikes=parseInt(GetDislikes[1]);
	return true;
}

async function CheckMeta(){
	let meta = await fetch('https://api.allorigins.ml/get?url=https%3A%2F%2Fpastebin.com%2Fraw%2Fbyr0QY8p');
	let bin = await meta.json();
	let json = JSON.parse(bin.contents);
	if (json.revision!==Meta.revision) {
		Announce('Page has updated, Refreshing shortly...');
		setTimeout(function(){ location.reload(); }, 5000);
	}
	if ('announce' in json){Announce(json.announce);}
}



InitRewind();