defmodule Phobs.SystemChannel do
  use Phoenix.Channel
  require Logger

  alias Phobs.SystemChannel.System

  def join("phobs:system", message, socket) do
    Process.flag(:trap_exit, true)

    # Need to do this only once, not per join
    # Also need to stop the timer when all connections terminate
    :timer.send_interval(1000, :update)

    {:ok, socket}
  end

  def handle_info(:update, socket) do
    broadcast! socket, "system:update", System.info
    {:noreply, socket}
  end

  def terminate(reason, _socket) do
    Logger.debug"> leave #{inspect reason}"
    :ok
  end
end
