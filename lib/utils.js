var crypto = require('crypto');

exports.md5 = function(str, encoding) {
  return crypto.createHash('md5').update(str).digest(encoding || 'hex');
};

exports.getguid = function(xguid) {
  var guid = xguid || '-';
  if (xguid == undefined) {
    return '-';
  }
  guid = xguid.substr(0, 34);
  if (guid.length < 34) {
    return '-';
  } else {
    var v = guid.split('');
    var xor_value = 0;
    var xor_sum = parseInt(v[32] + v[33], 16);
    for ( var i = 0; i < 32; i += 2) {
      xor_value = xor_value ^ parseInt(v[i] + v[i + 1], 16);
    }
    if (xor_sum == xor_value) {
      return guid;
    } else {
      return '-';
    }
  }
};

exports.getTimestamp = function() {
  return Math.floor(new Date().getTime() / 1000);
};

exports.getDateString = function() {
  var date = new Date();
  var pad = function(i) {
    if (i < 10) {
      return '0' + i;
    }
    return i;
  };
  return [ date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate()) ].join('');
};


exports.getLocaleISOString = function() {
  var date = new Date();
  var pad = function(i) {
    if (i < 10) {
      return '0' + i;
    }
    return i;
  };
  var pad3 = function(i) {
    if (i < 100) {
      return '0' + i;
    } else if (i < 10) {
      return '00' + i;
    }
    return i;
  };
  return [ date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate()) ].join('-') + ' ' + [ pad(date.getHours()), pad(date.getMinutes()), pad(date.getSeconds()) ].join(':') + '.' + pad3(date.getMilliseconds());
};

exports.in_array = function(stringToSearch, arrayToSearch) {
  for ( var s = 0; s < arrayToSearch.length; s++) {
    thisEntry = arrayToSearch[s].toString();
    if (thisEntry == stringToSearch) {
      return true;
    }
  }
  return false;
};

exports.indexOf = function(stringToSearch, arrayToSearch) {
  for ( var s = 0; s < arrayToSearch.length; s++) {
    thisEntry = arrayToSearch[s].toString();
    if (thisEntry == stringToSearch) {
      return s+1;
    }
  }
  return 0;
};