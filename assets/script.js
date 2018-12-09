Likes = 0, Dislikes = 0, Total = 0, Difference = 0;
LikesMin = 0, DislikesMin = 0, TotalMin = 0;
let LikeAnim, DislikeAnim;
Meta = {};

function getOffset(e){return box=e.getBoundingClientRect(),{top:box.top+window.pageYOffset-document.documentElement.clientTop,left:box.left+window.pageXOffset-document.documentElement.clientLeft}};
function height(e){o=getComputedStyle(e,null).getPropertyValue('height').replace(/\D/g,'');return parseInt(o)}
function round(value,precision){var multiplier=Math.pow(10,precision||0);return Math.round(value*multiplier)/multiplier}
function PrintDate(){date=new Date();return((date.getHours()>12)?(date.getHours()-12):date.getHours())+':'+((date.getMinutes()<10?'0':'') + date.getMinutes() )+':'+((date.getSeconds()<10?'0':'') + date.getSeconds() )+' '+((date.getHours()>12)?'PM':'AM')+' '+date.toLocaleTimeString('en-us',{timeZoneName:'short'}).split(' ')[2]}

function GetDifference(){
	if (Dislikes>Likes){
		return {leader: 'dislikes',diff: (Dislikes-Likes)};
	} else if (Likes>Dislikes){
		return {leader: 'likes',diff: (Likes-Dislikes)};
	}
}
function getPercentages(){
	LikesPercentage = (Likes / Total) * 100;
	DislikesPercentage = (Dislikes / Total) * 100;
	document.querySelector('#like-block').style.width = LikesPercentage+'%';
	document.querySelector('.perc-like').innerText = round(LikesPercentage,3)+'%';
	document.querySelector('#dislike-block').style.width = DislikesPercentage+'%';
	document.querySelector('.perc-dis').innerText = round(DislikesPercentage,3)+'%';
}
function LikeIncrease(){return (Likes-parseInt(localStorage.InitalLikes))};
function DislikeIncrease(){return (Dislikes-parseInt(localStorage.InitalDislikes))};
function BeatBaby(){return (9716306-Dislikes)};

function Announce(str){
	if (str.length!==0){
		document.querySelector('.announce').style.visibility='visible';
		document.querySelector('.announce').style.display='block';
		document.querySelector('.announce h4').innerHTML=str;
	}
	
}

async function InitRewind(){
	M.FloatingActionButton.init(document.querySelectorAll('.fixed-action-btn'), {direction: 'left'});
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
	let meta = await fetch('/meta.json');
	Meta = await meta.json();
	if ('announce' in Meta){Announce(Meta.announce);}
	setInterval(function(){ CheckMeta(); }, 3600000);
}

async function UpdateFuck(DontUpdate){
	Results = await FuckRewind();
	if (Results!==true) throw 'Something happened';
	Total = Likes+Dislikes;
	Difference = GetDifference();
	getPercentages();
	document.querySelector('#total').innerText = Total.toLocaleString('en');
	document.querySelector('#like-increase').innerText = LikeIncrease().toLocaleString('en');
	document.querySelector('#dislike-increase').innerText = DislikeIncrease().toLocaleString('en');
	document.querySelector('#beat-baby').innerText = BeatBaby().toLocaleString('en');
	if (DontUpdate && DontUpdate===true) return;
	LikeAnim.update(Likes);
	DislikeAnim.update(Dislikes);
	return;
}

function MinuteStats(){
	document.querySelector('#like-min').innerText = (Likes-LikesMin).toLocaleString('en');
	document.querySelector('#dislike-min').innerText = (Dislikes-DislikesMin).toLocaleString('en');
	document.querySelector('#total-min').innerText = (Total-TotalMin).toLocaleString('en');
	document.querySelector('#updated-min').innerText = PrintDate();
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
	let meta = await fetch('/meta.json');
	let json = await meta.json();
	console.log(json, Meta);
	if (json.revision!==Meta.revision) {
		Announce('Page has updated, Refreshing shortly...');
		setTimeout(function(){ location.reload(); }, 5000);
	}
	if ('announce' in json){Announce(json.announce);}
}



InitRewind();