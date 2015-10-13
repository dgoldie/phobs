defmodule Phobs.TopChannel do
  use Phoenix.Channel
  require Logger

  alias Phobs.TopChannel.Top
  alias Phoenix.Socket

  def join("phobs:top", _message, socket) do
    Process.flag(:trap_exit, true)
    socket = start_timer(socket)

    {:ok, socket}
  end

  def handle_info(:update, socket) do
    broadcast! socket, "top:update", %{top: Top.top}
    {:noreply, socket}
  end

  def terminate(reason, socket) do
    Logger.debug"> leave #{inspect reason}"
    socket = cancel_timer(socket)
    :ok
  end

  defp start_timer(socket) do
    count = socket.assigns[:phobs_top_timer_count]
    if (count == nil or count == 0) do
      {:ok, tref} = :timer.send_interval(1000, :update)
      socket = Socket.assign(socket, :phobs_top_timer_ref, tref)
      socket = Socket.assign(socket, :phobs_top_timer_count, 1)
    else
      socket = Socket.assign(socket, :phobs_top_timer_count, count + 1)
    end
    socket
  end

  defp cancel_timer(socket) do
    count = socket.assigns[:phobs_top_timer_count]
    if (count == 1) do
      tref = socket.assigns[:phobs_top_timer_ref]
      :timer.cancel(tref)
    end
    Socket.assign(socket, :phobs_top_timer_count, count - 1)
  end

end
