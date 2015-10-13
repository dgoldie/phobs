import {Utils} from "web/static/js/utils"

export class System {
  static init(socket) {
    $("a[href='#system']").on('show.bs.tab', function(e) {
      System.join(socket)
    });
  }

  static join(socket) {
    var chan = socket.channel("phobs:system", {})
    chan.join().receive("ignore", () => console.log("auth error"))
               .receive("ok", () => console.log("join ok"))
               .after(10000, () => console.log("Connection interruption"))
    chan.onError(e => console.log("something went wrong", e))
    chan.onClose(e => console.log("channel closed", e))

    var $system_container  = $("#system")
    chan.on("system:update", system => {
      $system_container.html(System.systemTemplate(system))
    })

    $("a[href='#system']").on('hidden.bs.tab', function(e) {
      chan.leave()
    });
  }

  static systemTemplate(sys) {
    let structure = ""

    let sysarch = this.sysarchTemplate(sys)
    let mem = this.memTemplate(sys)
    structure += `<div class="row">`
    structure += `  <div class="col-md-6">`
    structure += `    <h4>System and Architecture</h4>`
    structure += `    ${sysarch}`
    structure += `</div>`
    structure += `  <div class="col-md-6">`
    structure += `    <h4>Memory Usage</h4>`
    structure += `    ${mem}`
    structure += `  </div>`
    structure += `</div>`

    let cpu = this.cpuThreadTemplate(sys)
    let stats = this.statsTemplate(sys)
    structure += `<div class="row">`
    structure += `  <div class="col-md-6">`
    structure += `    <h4>CPUs and Threads</h4>`
    structure += `    ${cpu}`
    structure += `</div>`
    structure += `  <div class="col-md-6">`
    structure += `    <h4>Statistics</h4>`
    structure += `    ${stats}`
    structure += `  </div>`
    structure += `</div>`

    return (structure);
  }

  static systemTable(sys, names) {
    let table = `<table class="table table-striped">`
    for (var key in names) {
      if (names.hasOwnProperty(key)) {
        let syskey = names[key]
        table +=`    <tr> <td>${key}</td> <td>${Utils.sanitize(sys[syskey])}</td> </tr>`
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
    sys.mem_total = Utils.formatBytes(sys.mem_total);
    sys.mem_processes = Utils.formatBytes(sys.mem_processes);
    sys.mem_atom = Utils.formatBytes(sys.mem_atom);
    sys.mem_binary = Utils.formatBytes(sys.mem_binary);
    sys.mem_code = Utils.formatBytes(sys.mem_code);
    sys.mem_ets = Utils.formatBytes(sys.mem_ets);

    return this.systemTable(sys,
      {
        "Total": "mem_total",
        "Processes": "mem_processes",
        "Atoms": "mem_atom",
        "Binaries": "mem_binary",
        "Code": "mem_code",
        "Ets": "mem_ets",
      }
    )
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
    sys.uptime_ms = Utils.msToTime(sys.uptime_ms)
    sys.io_input = Utils.formatBytes(sys.io_input);
    sys.io_output = Utils.formatBytes(sys.io_output);

    return this.systemTable(sys,
      {
        "Up time": "uptime_ms",
        "Max Processes": "processes_limit",
        "Processes": "processes",
        "Run Queue": "run_queue",
        "IO Input": "io_input",
        "IO Output": "io_output",
      }
    )
  }
}
