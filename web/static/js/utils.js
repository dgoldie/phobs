export class Utils {
  static sanitize(html){ return $("<div/>").text(html).html() }

  static msToTime(duration) {
      var seconds = parseInt((duration/1000)%60)
          , minutes = parseInt((duration/(1000*60))%60)
          , hours = parseInt((duration/(1000*60*60))%24);

      var result;
      result = seconds + " Seconds ";
      if (minutes == 1) result = "1 Minute";
      if (minutes > 1) result = minutes + " Minutes";
      if (hours == 1) result = "1 Hour"
      if (hours > 1) result = hours + " Hours";

      return result;
  }

  static formatBytes(bytes) {
    var size;

    if (bytes > 10 * 1024 * 1024)
      return Math.floor(bytes / (1024 * 1024)) + " Mb"

    if (bytes > 1024)
      return Math.floor(bytes / 1024) + " Kb"

    return bytes + " bytes"
  }
}
