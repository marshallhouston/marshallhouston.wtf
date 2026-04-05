#!/bin/sh

# point git to tracked hooks
git config core.hooksPath scripts/hooks

echo "done — git hooks configured"
