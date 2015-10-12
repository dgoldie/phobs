import {Socket, LongPoller} from "phoenix"
import {System} from "web/static/js/system"
import {Processes} from "web/static/js/processes"

class App {

  static init(){
    let socket = new Socket("/phobs", {
      logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) })
    })

    // XXX What is user?  Do I need it?
    socket.connect({user_id: "123"})
    var $top_container  = $("#processes")
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
      $top_container.html(Processes.topTemplate(top.top))
    })

    var chan = socket.channel("phobs:system", {})
    chan.join().receive("ignore", () => console.log("auth error"))
               .receive("ok", () => console.log("join ok"))
               .after(10000, () => console.log("Connection interruption"))
    chan.onError(e => console.log("something went wrong", e))
    chan.onClose(e => console.log("channel closed", e))

    chan.on("system:update", system => {
      $system_container.html(System.systemTemplate(system))
    })
  }
}

$( () => App.init() )

export default App
