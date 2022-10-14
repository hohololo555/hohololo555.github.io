// Manage core logic by this variable
var Settlement = [];
Settlement.strtolower = function(str)
{
	return (str + '').toLowerCase();
}
Settlement.ucfirst = function(str)
{
	str += '';
	if (str.length == 0)
	{
		return 0;
	}
	return str.charAt(0).toUpperCase() + str.substr(1);
}
Settlement.count = function(mixed_var, mode)
{
	var key, cnt = 0;
	if (mixed_var === null || typeof mixed_var === 'undefined')
	{
		return 0;
	}
	else if (mixed_var.constructor !== Array && mixed_var.constructor !== Object)
	{
		return 1;
	}
	if (mode === 1)
	{
		mode = 1;
	}
	if (mode != 1)
	{
		mode = 0;
	}
	for (key in mixed_var)
	{
		if (mixed_var.hasOwnProperty(key))
		{
			cnt++;
			if (mode == 1 && mixed_var[key] && 
                (mixed_var[key].constructor === Array || 
                 mixed_var[key].constructor === Object))
			{
				cnt += this.count(mixed_var[key], 1);
			}
		}
	}
	return cnt;
}
Settlement.wordwrap = function(str, int_width, str_break, cut)
{
	var m = ((arguments.length >= 2) ? arguments[1] : 75);
	var b = ((arguments.length >= 3) ? arguments[2] : '\n');
	var c = ((arguments.length >= 4) ? arguments[3] : false);
	var i, j, l, s, r;
	str += '';
	if (m < 1)
	{
		return str;
	}
	for (i = -1, l = (r = str.split(/\r\n|\n|\r/)).length; ++i < l; r[i] += s)
	{
		for (s = r[i], r[i] = ''; 
             s.length > m; 
             r[i] += s.slice(0, j) + ((s = s.slice(j)).length ? b : ''))
		{
			j = c == 2 || (j = s.slice(0, m + 1).match(/\S*(\s)?$/))[1] ? m : j.input.length - j[0].length || c == 1 && m || j.input.length + (j = s.slice(m).match(/^\S*/))[0].length;
		}
	}
	return r.join('\n');
}
Settlement.nl2br = function(text, 
	is_xhtml = true )
{
	var break_tag = '<br>';
	if(is_xhtml == true || is_xhtml == 1)
	{
		break_tag = '<br ' + '/>';
	}
	// When text not a string
	text += "";
	return text.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, 
                        '$1' + break_tag + '$2');;
}
//---------------------------------
// kalkicode.com 
// These methods have not been changed by our tools.
// session_start
// glob
// preg_match
// set_exception_handler
// ob_start
// ob_get_contents
// ob_end_clean
// date
// file_exists
// file_get_contents
// trim
//----------------------------

session_start();
//Start session for settings of proxy to be stored and recovered
require "includes/class.censorDodge.php";
//Load censorDodge class
proxy = new censorDodge(@_GET["cdURL"], true, true);
//Instantiate censorDodge class
//Clear cookies and resetting settings session
if (typeof _GET["clearCookies"] !== 'undefined') {
    proxy.clearCookies();
    console.log('<meta http-equiv="refresh" content="0; url='+cdURL+'">');
}
if (typeof _POST["resetSettings"] !== 'undefined') {
    unset(_SESSION["settings"]);
    console.log('<meta http-equiv="refresh" content="0; url='+cdURL+'">');
}
settings = proxy.getProxySettings();
//Get all settings (plugins included) that are user intractable
//Update settings in session for changing in proxy later
if (typeof _POST["updateSettings"] !== 'undefined') {
    foreach (settings as setting) {
        if (typeof proxy.{setting[0]} !== 'undefined') {
            _SESSION["settings"][setting[0]] = typeof _POST[setting[0]] !== 'undefined';
            //Store settings in session for later
            proxy.{setting[0]} = typeof _POST[setting[0]] !== 'undefined';
            //Update proxy instance settings
        }
    }
    console.log('<meta http-equiv="refresh" content="0; url='+cdURL+'">');
    //Reload page using META redirect
} else {
    foreach (settings as setting) {
        if (typeof proxy.{setting[0]} !== 'undefined' && typeof _SESSION["settings"][setting[0]] !== 'undefined') {
            proxy.{setting[0]} = _SESSION["settings"][setting[0]];
            //Update proxy instance settings
        }
    }
}
//Find any templates which can be used as themes components
templates = {};
foreach (glob(BASE_DIRECTORY+"plugins"+DS+"{**/*,*}", 1024) as file) {
    if (preg_match("~([a-z0-9\\_\\-]+)\\.cdTheme~i", file, m)) {
        templates[m[1]] = file;
    }
}
if (@templates["error"]) {
    set_exception_handler(function (e) use(proxy, settings, templates) {
        if (errorString = e.getMessage()) {
            include ""+templates["error"]+"";
        }
    });
}
if (@templates["miniForm"]) {
    ob_start();
    include ""+templates["miniForm"]+"";
    output = ob_get_contents();
    ob_end_clean();
    proxy.addMiniFormCode(output);
}
if (!@_GET["cdURL"]) {
    //Only run if no URL has been submitted
    if (!@templates["home"]) {
        console.log("<html><head><title>"+Settlement.ucfirst(Settlement.strtolower(_SERVER['SERVER_NAME']))+" - Censor Dodge "+proxy.version+"</title><meta name='generator' content='https://www.censordodge.com'></head><body>");
        //Basic title
        //Basic submission form with base64 encryption support
        console.log("\n        <script>function goToPage() { event.preventDefault(); var URL = document.getElementsByName('cdURL')[0].value; if (URL!='') { window.location = '?cdURL=' + "+(proxy.encryptURLs ? 'btoa(URL)' : 'URL')+"; } }</script>\n        <h2>Welcome to <a target='_blank' style='color:#000 !important;' href='https://www.censordodge.com/'>Censor Dodge "+proxy.version+"</a></h2>\n        <form action='#' method='GET' onsubmit='goToPage();'>\n            <input type='text' size='30' name='cdURL' placeholder='URL' required>\n            <input type='submit' value='Go!'>\n        </form>");
        console.log("<hr><h3>Proxy Settings:</h3><form action='"+cdURL+"' method='POST'>");
        foreach (settings as name => setting) {
            //Toggle option for setting listed in array, completely dynamic
            console.log('<span style="padding-right:20px;"><input type="checkbox" '+(proxy.{setting[0]} ? "checked" : "")+' name="'+setting[0]+'" value="'+setting[1]+'"> '+name+"</span>");
        }
        console.log("<br><input style='margin-top: 20px;' type='submit' name='updateSettings' value='Update Settings'><form action='"+cdURL+"' method='POST'><input style='margin-left: 5px;' type='submit' value='Reset' name='resetSettings'></form></form>");
        file = proxy.parseLogFile(date("d-m-Y")+".txt");
        //Parse log file of current date format
        console.log("<hr><h3>Pages Viewed Today (Total - "+Settlement.count(file)+" By "+Settlement.count(proxy.sortParsedLogFile(file, "IP"))+" Users):</h3>");
        if (Settlement.count(views = proxy.sortParsedLogFile(file, "URL")) > 0) {
            console.log("<table><thead><td><b>Website</b></td><td><b>View Count</b></td></thead>");
            //Table title
            foreach (views as URL => logs) {
                console.log("<tr><td style='padding-right: 80px;'>"+URL+"</td><td>"+Settlement.count(logs)+"</td></tr>");
                //Table row for each parsed log
            }
            console.log("</table>");
        } else {
            console.log("<p>No pages have been viewed yet today!</p>");
            //No logs in file so just display generic message
        }
        if (file_exists(proxy.cookieDIR)) {
            console.log("<hr><h3>Cookie File - <a href='?clearCookies'>[Delete File]</a>:</h3>");
            //Option to delete file
            console.log("<p style='word-wrap: break-word;'>"+Settlement.nl2br(Settlement.wordwrap(trim(file_get_contents(proxy.cookieDIR)), 190, "\n", true))+"</p>");
            //Output cookie file to screen
        } else {
            console.log("<hr><h3>Cookie File:</h3>");
            console.log("<p>No cookie file could be found!</p>");
            //No file found so just display generic message
        }
        console.log("</body></html>");
    } else {
        include ""+templates["home"]+"";
    }
} else {
    console.log(proxy.openPage());
    //Run proxy with URL submitted when proxy class was instantiated
}