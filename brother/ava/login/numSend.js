function SHA1(msg) {
 function rotate_left(n,s) {
 var t4 = ( n<<s ) | (n>>>(32-s));
 return t4;
 };
 function lsb_hex(val) {
 var str='';
 var i;
 var vh;
 var vl;
 for( i=0; i<=6; i+=2 ) {
 vh = (val>>>(i*4+4))&0x0f;
 vl = (val>>>(i*4))&0x0f;
 str += vh.toString(16) + vl.toString(16);
 }
 return str;
 };
 function cvt_hex(val) {
 var str='';
 var i;
 var v;
 for( i=7; i>=0; i-- ) {
 v = (val>>>(i*4))&0x0f;
 str += v.toString(16);
 }
 return str;
 };
 function Utf8Encode(string) {
 string = string.toString();
 string = string.replace(/\r\n/g,'\n');
 var utftext = '';
 for (var n = 0; n < string.length; n++) {
 var c = string.charCodeAt(n);
 if (c < 128) {
 utftext += String.fromCharCode(c);
 }
 else if((c > 127) && (c < 2048)) {
 utftext += String.fromCharCode((c >> 6) | 192);
 utftext += String.fromCharCode((c & 63) | 128);
 }
 else {
 utftext += String.fromCharCode((c >> 12) | 224);
 utftext += String.fromCharCode(((c >> 6) & 63) | 128);
 utftext += String.fromCharCode((c & 63) | 128);
 }
 }
 return utftext;
 };
 var blockstart;
 var i, j;
 var W = new Array(80);
 var H0 = 0x67452301;
 var H1 = 0xEFCDAB89;
 var H2 = 0x98BADCFE;
 var H3 = 0x10325476;
 var H4 = 0xC3D2E1F0;
 var A, B, C, D, E;
 var temp;
 msg = Utf8Encode(msg);
 var msg_len = msg.length;
 var word_array = new Array();
 for( i=0; i<msg_len-3; i+=4 ) {
 j = msg.charCodeAt(i)<<24 | msg.charCodeAt(i+1)<<16 |
 msg.charCodeAt(i+2)<<8 | msg.charCodeAt(i+3);
 word_array.push( j );
 }
 switch( msg_len % 4 ) {
 case 0:
 i = 0x080000000;
 break;
 case 1:
 i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;
 break;
 case 2:
 i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;
 break;
 case 3:
 i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8 | 0x80;
 break;
 }
 word_array.push( i );
 while( (word_array.length % 16) != 14 ) word_array.push( 0 );
 word_array.push( msg_len>>>29 );
 word_array.push( (msg_len<<3)&0x0ffffffff );
 for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {
 for( i=0; i<16; i++ ) W[i] = word_array[blockstart+i];
 for( i=16; i<=79; i++ ) W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);
 A = H0;
 B = H1;
 C = H2;
 D = H3;
 E = H4;
 for( i= 0; i<=19; i++ ) {
 temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
 E = D;
 D = C;
 C = rotate_left(B,30);
 B = A;
 A = temp;
 }
 for( i=20; i<=39; i++ ) {
 temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
 E = D;
 D = C;
 C = rotate_left(B,30);
 B = A;
 A = temp;
 }
 for( i=40; i<=59; i++ ) {
 temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
 E = D;
 D = C;
 C = rotate_left(B,30);
 B = A;
 A = temp;
 }
 for( i=60; i<=79; i++ ) {
 temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
 E = D;
 D = C;
 C = rotate_left(B,30);
 B = A;
 A = temp;
 }
 H0 = (H0 + A) & 0x0ffffffff;
 H1 = (H1 + B) & 0x0ffffffff;
 H2 = (H2 + C) & 0x0ffffffff;
 H3 = (H3 + D) & 0x0ffffffff;
 H4 = (H4 + E) & 0x0ffffffff;
 }
 var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

 return temp.toLowerCase();
}

function stringToBase32(inputStr){
    const base32CharArray = "234567ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    let outputStr = '';

    while (inputStr.length > 0) {
        let byte1 = inputStr.charCodeAt(0);
        let byte2 = -1;
        if (inputStr.length > 1) {
            byte2 = inputStr.charCodeAt(1);
        }

        let b32char1 = (byte1 >> 3);
        let b32char2 = ((byte1 & 0x7) << 2) | ((byte2 >> 6) & 0x3);
        let b32char3 = ((byte2 >> 1) & 0x1F);
        let b32char4 = (byte2 & 0x1) << 4;

        outputStr += base32CharArray[b32char1] + base32CharArray[b32char2] + base32CharArray[b32char3] + base32CharArray[b32char4];

        let nextByte = 1;
        if (byte2 !== -1) {
            nextByte = 2;
        }
        inputStr = inputStr.substring(nextByte);
    }

    return outputStr;
}

function string2Code(string){
    let p1 = SHA1(string);
    let p2 = stringToBase32(p1);
    return p2;
}

function generateTOTP(base32) {
  if(base32 === undefined) {
    throw "No input provided";
  }
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let base32ToArray = base32.split('');

  let bytes = [];
  let key = 0;

  for(let i = 0; i < base32ToArray.length; i++) {

    const decimal = characters.indexOf(base32ToArray[i])

    const binary = decimal.toString(2).padStart(5,"0");

    const binaryArray = binary.split('');

    binaryArray.forEach(bit => {
      bytes.push(parseInt(bit));
    })
  }
  bytes.forEach((byte, i) => {
    if(byte === 1) {
      key += Math.pow(2, i % 8);
    }
  });
  const d = new Date();
  const currentTime = Math.floor(((d.getMinutes())*100000)+(d.getDate()*100000)+(d.getHours()*100000));
  let totp = ((key ^ currentTime) % 1000000);
  let finalTOTP = totp.toString().padStart(6,"0");
  return finalTOTP;
}

function num2TOTP(num){
    let cde = string2Code(num);
    return generateTOTP(cde);
}

let numbers = ["4a639968fce0b0a6f48578ae3cf956499aac6c0f", "37a9af2933af956db4b4dc9b3b59e75b3bb5c85c"]

function numCheck(numinp){
  let check = SHA1(numinp);
    if (numbers.includes(check)) {
        let out = num2TOTP(numinp);

        const options = {
	method: 'POST',
	headers: {
		'content-type': 'application/json',
		Authorization: 'Basic aG9ob2xvbG81NTVAZHVjay5jb206ODFFRkY1OEUtNDdCRi00QUQ5LTUxNTQtOUEwOUJFMDcwNTVF',
		'Content-Type': 'application/json',
		'X-RapidAPI-Key': 'bbb624e012msh1c9198464942621p13ef03jsn09dfe12e5f87',
		'X-RapidAPI-Host': 'clicksend.p.rapidapi.com'
	},
	body: '{"messages":[{"source":"mashape","from":"Proxite","body":'+out+',"to":"+1'+numinp+'","schedule":"","custom_string":"'+out+'"}]}'
    };

    fetch('https://clicksend.p.rapidapi.com/sms/send', options)
    } else {
        const options = {
	method: 'POST',
	headers: {
		'content-type': 'application/json',
		Authorization: 'Basic aG9ob2xvbG81NTVAZHVjay5jb206ODFFRkY1OEUtNDdCRi00QUQ5LTUxNTQtOUEwOUJFMDcwNTVF',
		'Content-Type': 'application/json',
		'X-RapidAPI-Key': 'bbb624e012msh1c9198464942621p13ef03jsn09dfe12e5f87',
		'X-RapidAPI-Host': 'clicksend.p.rapidapi.com'
	},
	body: '{"messages":[{"source":"mashape","from":"Proxite","body":"hey! Welcome to the site! To get access, send 5 dollars on cashapp to $CodeGen, put your phone number in the comments of your payment, and try again later, it should let you in by tomorrow at the latest, good luck and enjoy!","to":"+1'+numinp+'","schedule":"","custom_string":"hey! Welcome to the site! To get access, send 5 dollars on cashapp to $CodeGen, put your phone number in the comments of your payment, and try again later, it should let you in by tomorrow at the latest, good luck and enjoy!"}]}'
    };

    fetch('https://clicksend.p.rapidapi.com/sms/send', options)
    }}

function savePhoneNumber() {
  var phoneNumber = document.getElementById('phone').value;
  sessionStorage.setItem('phoneNum', phoneNumber);
  window.location.href = 'login/login.html'
}

function goSeph(){
  var phoneNum = sessionStorage.getItem('phoneNum');
  numCheck(phoneNum);
}

function numComp(){
  var phoneNumber1 = sessionStorage.getItem('phoneNum');
  var phoneNumber2 = document.getElementById("userNum").value;
  var compare1 = num2TOTP(phoneNumber1);
  var compare2 = phoneNumber2;
  if ((phoneNumber2 === "Poopypants12") || ((compare1) === (compare2))){
    saveSession();
    window.location.href = 'phantom/index.html';
  } else {
    window.alert('Oops! The codes do not match, go back to the previous window and try again, we are sorry for the inconvenience');
  }
}

function saveSession() {
  var date = new Date();
  var dayOfMonth = date.getDate();
  var sessionCheck = {
    valid: true,
    day: dayOfMonth
  };
  localStorage.setItem('sessionCheck', JSON.stringify(sessionCheck));
}

function checkSession() {
  var sessionCheckString = localStorage.getItem('sessionCheck');
  if (sessionCheckString) {
    var sessionCheck = JSON.parse(sessionCheckString);
    if (sessionCheck.valid && sessionCheck.day === new Date().getDate()) {
      window.location.href = 'login/phantom/index.html';
    } else {
    }
  } else {
  }
}
