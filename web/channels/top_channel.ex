defmodule Phobs.TopChannel do
  use Phoenix.Channel
  require Logger

  alias Phobs.TopChannel.Top

  def join("phobs:top", message, socket) do
    Process.flag(:trap_exit, true)

    # Need to do this only once, not per join
    # Also need to stop the timer when all connections terminate
    :timer.send_interval(1000, :update)

    {:ok, socket}
  end

  def handle_info(:update, socket) do
    broadcast! socket, "top:update", %{top: Top.top}
    {:noreply, socket}
  end

  def terminate(reason, _socket) do
    Logger.debug"> leave #{inspect reason}"
    :ok
  end
end
