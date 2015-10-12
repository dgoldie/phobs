import {Utils} from "web/static/js/utils"

export class Processes {
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
    let pid      = Utils.sanitize(proc.pid)
    let name     = Utils.sanitize(proc.name)
    let reds     = Utils.sanitize(proc.reductions)
    let memory   = Utils.sanitize(proc.memory)
    let current  = Utils.sanitize(proc.current_function)
    let links    = Utils.sanitize(proc.links)

    return(`<tr><td>${pid}</td><td>${name}</td><td>${reds}</td><td>${memory}</td><td>${current}</td><td>${links}</td></tr>`)
  }
}
