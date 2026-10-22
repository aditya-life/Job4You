#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "============================================================"
echo "🧪 Running Job4You Comprehensive Production Test Suite..."
echo "============================================================"

# Ensure test DB is clean
rm -f ./test_job4you.db

export PYTHONPATH="."
./venv/bin/pytest -v tests/

echo "============================================================"
echo "✅ All Job4You Production Tests Passed Successfully!"
echo "============================================================"
