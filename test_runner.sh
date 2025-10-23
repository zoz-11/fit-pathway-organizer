#!/bin/bash
# Simple test runner to check if our fixes work

cd apps/web-app
npm test -- --passWithNoTests --watchAll=false