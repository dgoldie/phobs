import {Socket, LongPoller} from "phoenix"

class App {

  static init(){
    let socket = new Socket("/phobs", {
      logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) })
    })

    // XXX What is user?  Do I need it?
    socket.connect({user_id: "123"})
    var $top_container  = $("#top")

    socket.onOpen( ev => console.log("OPEN", ev) )
    socket.onError( ev => console.log("ERROR", ev) )
    socket.onClose( e => console.log("CLOSE", e))

    var chan = socket.channel("phobs:top", {})
    chan.join().receive("ignore", () => console.log("auth error"))
               .receive("ok", () => console.log("join ok"))
               .after(10000, () => console.log("Connection interruption"))
    chan.onError(e => console.log("something went wrong", e))
    chan.onClose(e => console.log("channel closed", e))

    // XXX I don't think I need this
    // $input.off("keypress").on("keypress", e => {
    //   if (e.keyCode == 13) {
    //     chan.push("new:msg", {user: $username.val(), body: $input.val()})
    //     $input.val("")
    //   }
    // })

    chan.on("top:update", top => {
      $top_container.html(this.topTemplate(top.top))
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
    return `<tr><th>PID</th><th>Name / Initial Function</th><th>Reductions</th><th>Memory</th><th>Current Function</th></tr>`
  }

  static procTemplate(proc){
    let pid      = this.sanitize(proc.pid)
    let name     = this.sanitize(proc.name)
    let reds     = this.sanitize(proc.reductions)
    let memory   = this.sanitize(proc.memory)
    let current  = this.sanitize(proc.current_function)

    return(`<tr><td>${pid}</td><td>${name}</td><td>${reds}</td><td>${memory}</td><td>${current}</td></tr>`)
  }
}

$( () => App.init() )

export default App