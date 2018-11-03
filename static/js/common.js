// 时间戳转化为字符串
function timeStampToString(timeStamp) {
	var
		year = timeStamp.getFullYear();
		month = timeStamp.getMonth() + 1;
		date = timeStamp.getDate();
	return year + "-" + month + "-" + date;
}