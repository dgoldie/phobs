defmodule Phobs.TopChannel.Top do
  def top do
    :erlang.processes
    |> Enum.map(fn pid -> {pid, :erlang.process_info(pid)} end)
    |> Enum.map(&extract_info/1)
  end

  defp extract_info({pid, info}) do
    %{
      pid:              format(pid),
      name:             name(info),
      reductions:       info[:reductions],
      memory:           memory(info),
      msgq:             info[:message_queue_len],
      current_function: format(info[:current_function]),
      links:            format(info[:links])
    }
  end

  defp format({module, function, arguments}) do
    Exception.format_mfa(module, function, arguments)
  end

  defp format(pid) when is_pid(pid) do
    pid
    |> :erlang.pid_to_list
    |> List.to_string
  end

  defp format(list) when is_list(list) do
    list
    |> Enum.map(fn(x) -> format(x) end)
    |> List.to_string
  end

  defp format(port) when is_port(port) do
    port
    |> :erlang.port_to_list
    |> List.to_string
  end

  defp name(info) do
    Keyword.get(info, :registered_name) || format(info[:initial_call])
  end

  defp memory(erlang_info) do
    erlang_info[:total_heap_size] +
    erlang_info[:heap_size] +
    erlang_info[:stack_size]
  end
end
