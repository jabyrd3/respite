#!/usr/bin/env bats

@test "basic dns out of the box" {
  result="$(dig @primary +short example.com)"
  [ "$result" == "4.4.4.4" ]
}

@test "dns from secondary" {
  result="$(dig @secondary +short example.com)"
  [ "$result" == "4.4.4.4" ]
}

@test "dns from tertiary" {
  result="$(dig @tertiary +short example.com)"
  [ "$result" == "4.4.4.4" ]
}

