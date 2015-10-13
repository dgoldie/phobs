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
    socket.onOpen( ev => console.log("OPEN", ev) )
    socket.onError( ev => console.log("ERROR", ev) )
    socket.onClose( e => console.log("CLOSE", e))

    System.init(socket)
    Processes.init(socket)

    // Initial tab
    System.join(socket)
  }
}

$( () => App.init() )

export default App
