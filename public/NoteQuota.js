var exports = (function() {

	var NoteQuota = function(cb) {
		this.points = NoteQuota.MAX;
		this.history = new Array(NoteQuota.HISTLEN);
		this.cb = cb;
	};

	NoteQuota.ALLOWANCE = 33;
	NoteQuota.MAX = 99;
	NoteQuota.HISTLEN = NoteQuota.MAX / NoteQuota.ALLOWANCE;

	NoteQuota.prototype.tick = function() {
		// keep a brief history
		this.history.unshift(this.points);
		this.history.length = NoteQuota.HISTLEN;
		// hook a brother up with some more quota
		this.points += NoteQuota.ALLOWANCE;
		if(this.points > NoteQuota.MAX) this.points = NoteQuota.MAX;
		// fire callback
		if(this.cb) this.cb(this.points);
	};

	NoteQuota.prototype.spend = function(needed) {
		// check whether aggressive limitation is needed
		var sum = 0;
		for(var i in this.history) {
			sum += this.history[i];
		}
		if(sum <= 0) needed *= NoteQuota.ALLOWANCE;
		// fire callback
		if(this.cb) this.cb(this.points);
		// can they afford it?  spend
		if(this.points < needed) {
			return false;
		} else {
			this.points -= needed;
			return true;
		}
	};

	return NoteQuota;

})();

if(typeof module !== "undefined") {
	module.exports = exports;
} else {
	this.NoteQuota = exports;
}


/*
     FILE ARCHIVED ON 10:36:45 Dec 17, 2012 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 21:46:12 Dec 22, 2023.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 151.951
  exclusion.robots: 0.084
  exclusion.robots.policy: 0.073
  cdx.remote: 0.061
  esindex: 0.01
  LoadShardBlock: 120.468 (3)
  PetaboxLoader3.datanode: 127.513 (4)
  load_resource: 71.437
  PetaboxLoader3.resolve: 44.74
*/