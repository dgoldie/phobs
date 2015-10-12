defmodule Phobs.SystemChannel.System.Test do
  use ExUnit.Case
  alias Phobs.SystemChannel.System

  test "System.info should return a map" do
    assert System.info |> is_map
  end

  test "System.info should describe the system properties" do
    sysinfo = System.info

    IO.puts ""
    sysinfo
    |> Map.keys
    |> Enum.each(fn key -> IO.puts "#{key}\t->\t#{sysinfo[key]}" end)
    IO.puts ""

    assert Map.has_key?(sysinfo, :system_version)
    assert Map.has_key?(sysinfo, :erts_version)
    assert Map.has_key?(sysinfo, :compiled_for)
    assert Map.has_key?(sysinfo, :emulator_wordsize)
    assert Map.has_key?(sysinfo, :process_wordsize)
    assert Map.has_key?(sysinfo, :smp_support)
    assert Map.has_key?(sysinfo, :thread_support)
    assert Map.has_key?(sysinfo, :async_thread_pool_size)

    assert Map.has_key?(sysinfo, :logical_cpus)
    assert Map.has_key?(sysinfo, :logical_cpus_online)
    assert Map.has_key?(sysinfo, :logical_cpus_available)
    assert Map.has_key?(sysinfo, :schedulers)
    assert Map.has_key?(sysinfo, :schedulers_online)
    assert Map.has_key?(sysinfo, :schedulers_available)

    # assert Map.has_key?(sysinfo, :mem_total)
    # assert Map.has_key?(sysinfo, :mem_processes)
    # assert Map.has_key?(sysinfo, :mem_atoms)
    # assert Map.has_key?(sysinfo, :mem_binaries)
    # assert Map.has_key?(sysinfo, :mem_code)
    # assert Map.has_key?(sysinfo, :mem_ets)

    assert Map.has_key?(sysinfo, :uptime_ms)
    assert Map.has_key?(sysinfo, :processes_limit)
    assert Map.has_key?(sysinfo, :processes)
    # assert Map.has_key?(sysinfo, :run_queue)
    assert Map.has_key?(sysinfo, :io_input)
    assert Map.has_key?(sysinfo, :io_output)
  end
end
