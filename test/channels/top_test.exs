defmodule Phobs.TopChannel.Top.Test do
  use ExUnit.Case
  alias Phobs.TopChannel.Top

  test "it returns an Enumerable of processes" do
    Top.top
    |> Enum.each fn proc -> assert proc.pid end
  end
end
