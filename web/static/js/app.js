import {Socket, LongPoller} from "phoenix"

class App {

  static init(){
    let socket = new Socket("/phobs", {
      logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) })
    })

    // XXX What is user?  Do I need it?
    socket.connect({user_id: "123"})
    var $top_container  = $("#top")
    var $system_container  = $("#system")


    socket.onOpen( ev => console.log("OPEN", ev) )
    socket.onError( ev => console.log("ERROR", ev) )
    socket.onClose( e => console.log("CLOSE", e))

    var chan = socket.channel("phobs:top", {})
    chan.join().receive("ignore", () => console.log("auth error"))
               .receive("ok", () => console.log("join ok"))
               .after(10000, () => console.log("Connection interruption"))
    chan.onError(e => console.log("something went wrong", e))
    chan.onClose(e => console.log("channel closed", e))

    chan.on("top:update", top => {
      $top_container.html(this.topTemplate(top.top))
    })

    var chan = socket.channel("phobs:system", {})
    chan.join().receive("ignore", () => console.log("auth error"))
               .receive("ok", () => console.log("join ok"))
               .after(10000, () => console.log("Connection interruption"))
    chan.onError(e => console.log("something went wrong", e))
    chan.onClose(e => console.log("channel closed", e))

    chan.on("system:update", system => {
      $system_container.html(this.systemTemplate(system))
    })
  }

  static sanitize(html){ return $("<div/>").text(html).html() }

  static messageTemplate(msg){
    let username = this.sanitize(msg.user || "anonymous")
    let body     = this.sanitize(msg.body)

    return(`<p><a href='#'>[${username}]</a>&nbsp; ${body}</p>`)
  }

  static topTemplate(top) {
    let outer = this.topOuter(top)
    return(`<p><table class="table table-striped">${outer}</table>`)
  }

  static topOuter(top) {
    var arrayLength = top.length;

    let rows = this.header()
    for (var i = 0; i < arrayLength; i++) {
      rows += this.procTemplate(top[i])
    }

    return rows
  }

  static header() {
    return `<tr><th>PID</th><th>Name / Initial Function</th><th>Reductions</th><th>Memory</th><th>Current Function</th><th>Links</th></tr>`
  }

  static procTemplate(proc){
    let pid      = this.sanitize(proc.pid)
    let name     = this.sanitize(proc.name)
    let reds     = this.sanitize(proc.reductions)
    let memory   = this.sanitize(proc.memory)
    let current  = this.sanitize(proc.current_function)
    let links    = this.sanitize(proc.links)

    return(`<tr><td>${pid}</td><td>${name}</td><td>${reds}</td><td>${memory}</td><td>${current}</td><td>${links}</td></tr>`)
  }

  static systemTemplate(sys) {
    let structure = ""
    structure += `<div class="row">`
    structure += `  <div class="col-md-6"><h4>System and Architecture</h4></div>`
    structure += `  <div class="col-md-6"><h4>Memory Usage</h4></div>`
    structure += `</div>`

    let sysarch = this.sysarchTemplate(sys)
    let mem = this.memTemplate(sys)
    structure += `<div class="row">`
    structure += `  <div class="col-md-6">${sysarch}</div>`
    structure += `  <div class="col-md-6">${mem}</div>`
    structure += `</div>`

    structure += `<div class="row">`
    structure += `  <div class="col-md-6"><h4>CPUS and Threads</h4></div>`
    structure += `  <div class="col-md-6"><h4>Statistics</h4></div>`
    structure += `</div>`

    let cpu = this.cpuThreadTemplate(sys)
    let stats = this.statsTemplate(sys)
    structure += `<div class="row">`
    structure += `  <div class="col-md-6">${cpu}</div>`
    structure += `  <div class="col-md-6">${stats}</div>`
    structure += `</div>`

    return (structure)
  }

  static systemTable(sys, names) {
    var table;
    var index;

    table += `<table class="table table-striped">`
    for (var key in names) {
      if (names.hasOwnProperty(key)) {
        let syskey = names[key]
        table +=`    <tr> <td>${key}</td> <td>${this.sanitize(sys[syskey])}</td> </tr>`
      }
    }
    table += `</table>`

    return table
  }

  static sysarchTemplate(sys) {
    return this.systemTable(sys,
      {
        "System Version": "system_version",
        "Erts Version": "erts_version",
        "Compiled For": "compiled_for",
        "Emulator Word Size": "emulator_wordsize",
        "Process Word Size": "smp_support",
        "Thread Support": "thread_support",
        "Async thread pool size": "async_thread_pool_size"
      }
    )
  }

  static memTemplate(sys) {
    return `Mem Sucks`
  }

  static cpuThreadTemplate(sys) {
    return this.systemTable(sys,
      {
        "Logical CPUs": "logical_cpus",
        "Online Logical CPUs": "logical_cpus_online",
        "Available Logical CPUs": "logical_cpus_available",
        "Schedulers": "schedulers",
        "Online Schedulers": "schedulers_online",
        "Available Schedulers": "schedulers_available",
      }
    )
  }

  static statsTemplate(sys) {
    sys.uptime_ms = this.msToTime(sys.uptime_ms)

    return this.systemTable(sys,
      {
        "Up time": "uptime_ms",
        "Max Processes": "processes_limit",
        "Processes": "processes",
        // "Run Queue": "schedulers",
        // "IO Input": "schedulers_online",
        // "IO Output": "schedulers_available",
      }
    )
  }

  static msToTime(duration) {
      var seconds = parseInt((duration/1000)%60)
          , minutes = parseInt((duration/(1000*60))%60)
          , hours = parseInt((duration/(1000*60*60))%24);

      var result;
      result = seconds + " Seconds ";
      if (minutes > 0) result = minutes + " Minutes";
      if (hours > 0) result = hours + " Hours";

      return result;
  }
}

$( () => App.init() )

export default App
