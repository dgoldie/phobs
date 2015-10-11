defmodule Phobs.PageControllerTest do
  use Phobs.ConnCase

  test "GET /" do
    conn = get conn(), "/"
    assert html_response(conn, 200) =~ "Phoenix Observer"
  end
end
